#!/usr/bin/env python3
"""
Skills Lego - Combine multiple Claude Code skills into one composite skill.

Usage:
    python lego.py \
        --name "my-workflow" \
        --skills "github.com/user/skill-a" "github.com/user/skill-b" \
        --workflow "Description of how skills work together" \
        --output ./my-composite

    python lego.py --update ./existing-composite  # Re-fetch from SOURCES.md
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse


def parse_github_url(url: str) -> tuple[str, str, str, str]:
    """Parse GitHub URL into (owner, repo, branch, skill_path).

    Supports formats:
    - github.com/owner/repo
    - github.com/owner/repo@skill-name (skill in skills/skill-name/)
    - owner/repo@skill-name
    """
    url = url.strip()

    # Remove protocol
    if url.startswith("https://"):
        url = url[8:]
    elif url.startswith("http://"):
        url = url[7:]

    # Remove github.com prefix
    if url.startswith("github.com/"):
        url = url[11:]

    # Check for @skill-name suffix
    skill_path = ""
    if "@" in url:
        url, skill_name = url.rsplit("@", 1)
        skill_path = f"skills/{skill_name}"

    # Parse owner/repo
    parts = url.split("/")
    owner = parts[0]
    repo = parts[1].replace(".git", "") if len(parts) > 1 else ""

    # Check for branch (tree/branch-name)
    branch = "main"
    if len(parts) > 3 and parts[2] == "tree":
        branch = parts[3]

    return owner, repo, branch, skill_path


def fetch_skill(url: str, dest: Path) -> dict:
    """Clone a skill repo and return metadata."""
    owner, repo, branch, skill_path = parse_github_url(url)
    clone_url = f"https://github.com/{owner}/{repo}.git"

    skill_name = skill_path.split("/")[-1] if skill_path else repo
    print(f"  Fetching {owner}/{repo}" + (f"@{skill_name}" if skill_path else "") + "...")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp) / repo

        # Clone the repo
        result = subprocess.run(
            ["git", "clone", "--depth", "1", "--branch", branch, clone_url, str(tmp_path)],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            # Try 'master' if 'main' fails
            if branch == "main":
                result = subprocess.run(
                    ["git", "clone", "--depth", "1", "--branch", "master", clone_url, str(tmp_path)],
                    capture_output=True,
                    text=True
                )
                if result.returncode == 0:
                    branch = "master"

            if result.returncode != 0:
                raise RuntimeError(f"Failed to clone {clone_url}: {result.stderr}")

        # Get commit hash
        commit_result = subprocess.run(
            ["git", "-C", str(tmp_path), "rev-parse", "HEAD"],
            capture_output=True,
            text=True
        )
        commit = commit_result.stdout.strip()[:7]

        # If skill_path specified, look there first
        skill_md = None
        if skill_path:
            specific_path = tmp_path / skill_path / "SKILL.md"
            if specific_path.exists():
                skill_md = specific_path
            else:
                raise RuntimeError(f"No SKILL.md found at {skill_path} in {clone_url}")
        else:
            # Find SKILL.md (could be in root or a subdirectory)
            skill_md = find_skill_md(tmp_path)
            if not skill_md:
                raise RuntimeError(f"No SKILL.md found in {clone_url}")

        skill_root = skill_md.parent

        # Copy skill contents to destination
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(skill_root, dest, dirs_exist_ok=True)

        # Remove .git directory if copied
        git_dir = dest / ".git"
        if git_dir.exists():
            shutil.rmtree(git_dir)

        # Extract metadata from SKILL.md
        metadata = parse_skill_md(dest / "SKILL.md")

        return {
            "name": repo,
            "url": f"github.com/{owner}/{repo}",
            "branch": branch,
            "commit": commit,
            "description": metadata.get("description", ""),
            "triggers": metadata.get("triggers", []),
            "license": detect_license(dest),
        }


def find_skill_md(path: Path) -> Optional[Path]:
    """Find SKILL.md in a directory tree."""
    # Check root first
    if (path / "SKILL.md").exists():
        return path / "SKILL.md"

    # Check one level deep
    for child in path.iterdir():
        if child.is_dir() and (child / "SKILL.md").exists():
            return child / "SKILL.md"

    return None


def parse_skill_md(path: Path) -> dict:
    """Parse SKILL.md and extract frontmatter + body."""
    content = path.read_text()

    result = {
        "name": "",
        "description": "",
        "triggers": [],
        "body": content,
    }

    # Check for YAML frontmatter
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1].strip()
            result["body"] = parts[2].strip()

            # Parse frontmatter (simple YAML parsing)
            for line in frontmatter.split("\n"):
                if line.startswith("name:"):
                    result["name"] = line.split(":", 1)[1].strip().strip('"\'')
                elif line.startswith("description:"):
                    result["description"] = line.split(":", 1)[1].strip().strip('"\'')
                elif line.startswith("triggers:"):
                    # Triggers might be on next lines
                    pass
                elif line.strip().startswith("- ") and "triggers" in frontmatter[:frontmatter.find(line)]:
                    result["triggers"].append(line.strip()[2:])

    return result


def detect_license(path: Path) -> str:
    """Detect license from LICENSE file."""
    for name in ["LICENSE", "LICENSE.md", "LICENSE.txt"]:
        license_file = path / name
        if license_file.exists():
            content = license_file.read_text().lower()
            if "mit" in content:
                return "MIT"
            elif "apache" in content:
                return "Apache-2.0"
            elif "gpl" in content:
                return "GPL"
            elif "bsd" in content:
                return "BSD"
    return "Unknown"


def rewrite_paths(content: str, skill_name: str) -> str:
    """Rewrite relative paths to include skill prefix."""
    patterns = [
        # Backtick paths
        (r'`references/', f'`skills/{skill_name}/references/'),
        (r'`scripts/', f'`skills/{skill_name}/scripts/'),
        (r'`assets/', f'`skills/{skill_name}/assets/'),
        (r'`templates/', f'`skills/{skill_name}/templates/'),
        # Relative paths
        (r'\./references/', f'./skills/{skill_name}/references/'),
        (r'\./scripts/', f'./skills/{skill_name}/scripts/'),
        (r'\./assets/', f'./skills/{skill_name}/assets/'),
        (r'\./templates/', f'./skills/{skill_name}/templates/'),
        # Markdown links
        (r'\]\(references/', f'](skills/{skill_name}/references/'),
        (r'\]\(scripts/', f'](skills/{skill_name}/scripts/'),
    ]

    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)

    return content


def generate_skill_md(name: str, description: str, skills: list[dict], workflow: str) -> str:
    """Generate the main SKILL.md for the composite."""

    # Combine triggers from all skills
    all_triggers = []
    for skill in skills:
        all_triggers.extend(skill.get("triggers", []))

    # Build the document
    lines = [
        "---",
        f'name: "{name}"',
        f'description: "{description}"',
    ]

    if all_triggers:
        lines.append("triggers:")
        for trigger in all_triggers[:10]:  # Limit to 10 triggers
            lines.append(f'  - "{trigger}"')

    lines.extend([
        "---",
        "",
        f"# {name}",
        "",
        description,
        "",
        "## Included Skills",
        "",
        "| Skill | Description | Instructions |",
        "|-------|-------------|--------------|",
    ])

    for skill in skills:
        skill_name = skill["name"]
        skill_desc = skill.get("description", "")[:50]
        lines.append(f"| {skill_name} | {skill_desc} | `skills/{skill_name}/instructions.md` |")

    lines.extend([
        "",
        "## Workflow",
        "",
        workflow if workflow else "_No orchestration defined. Skills can be used independently._",
        "",
        "## Reference Table",
        "",
        "| Reference | When to Read |",
        "|-----------|--------------|",
    ])

    for skill in skills:
        skill_name = skill["name"]
        lines.append(f"| `skills/{skill_name}/instructions.md` | When working with {skill_name} functionality |")

    lines.extend([
        "",
        "---",
        "",
        "See `SOURCES.md` for attribution and update information.",
    ])

    return "\n".join(lines)


def generate_sources_md(skills: list[dict]) -> str:
    """Generate SOURCES.md with attribution."""
    now = datetime.now().strftime("%Y-%m-%d")

    lines = [
        "# Sources",
        "",
        f"Last composed: {now}",
        "",
        "## Included Skills",
        "",
        "| Skill | Source | Commit | License |",
        "|-------|--------|--------|---------|",
    ]

    for skill in skills:
        name = skill["name"]
        url = skill["url"]
        commit = skill.get("commit", "unknown")
        license_ = skill.get("license", "Unknown")
        lines.append(f"| {name} | [{url}](https://{url}) | `{commit}` | {license_} |")

    lines.extend([
        "",
        "## Updating",
        "",
        "To update this composite with the latest versions:",
        "",
        "```bash",
        "python lego.py --update .",
        "```",
        "",
        "Or regenerate manually:",
        "",
        "```bash",
        "python lego.py \\",
    ])

    for i, skill in enumerate(skills):
        prefix = "    --skills" if i == 0 else "            "
        suffix = " \\" if i < len(skills) - 1 else ""
        lines.append(f'{prefix} "{skill["url"]}"{suffix}')

    lines.extend([
        "    --output ./updated",
        "```",
    ])

    return "\n".join(lines)


def compose(
    name: str,
    skill_urls: list[str],
    output_path: Path,
    workflow: str = "",
    description: str = "",
) -> None:
    """Compose multiple skills into one."""

    print(f"\nComposing '{name}' from {len(skill_urls)} skills...\n")

    # Create output directory
    output_path.mkdir(parents=True, exist_ok=True)
    skills_dir = output_path / "skills"
    skills_dir.mkdir(exist_ok=True)

    # Fetch each skill
    skills = []
    for url in skill_urls:
        # Parse URL to get skill name (use @skill-name if present, else repo name)
        _, repo, _, skill_path = parse_github_url(url)
        skill_name = skill_path.split("/")[-1] if skill_path else repo
        skill_dest = skills_dir / skill_name

        metadata = fetch_skill(url, skill_dest)
        skills.append(metadata)

        # Rename SKILL.md to instructions.md and strip frontmatter
        skill_md = skill_dest / "SKILL.md"
        if skill_md.exists():
            parsed = parse_skill_md(skill_md)

            # Rewrite paths in the body
            rewritten_body = rewrite_paths(parsed["body"], skill_name)

            # Write as instructions.md
            instructions_md = skill_dest / "instructions.md"
            instructions_md.write_text(rewritten_body)

            # Remove original SKILL.md
            skill_md.unlink()

        print(f"  ✓ {metadata['name']} ({metadata['commit']})")

    # Generate description if not provided
    if not description:
        skill_names = [s["name"] for s in skills]
        description = f"Composite skill combining: {', '.join(skill_names)}"

    # Generate main SKILL.md
    skill_md_content = generate_skill_md(name, description, skills, workflow)
    (output_path / "SKILL.md").write_text(skill_md_content)
    print(f"\n  ✓ Generated SKILL.md")

    # Generate SOURCES.md
    sources_md_content = generate_sources_md(skills)
    (output_path / "SOURCES.md").write_text(sources_md_content)
    print(f"  ✓ Generated SOURCES.md")

    print(f"\n✓ Composite skill created at: {output_path}")
    print(f"\nTo install:")
    print(f"  ln -s {output_path.absolute()} ~/.claude/skills/{name}")


def update_from_sources(composite_path: Path) -> None:
    """Re-fetch skills from SOURCES.md."""
    sources_md = composite_path / "SOURCES.md"
    if not sources_md.exists():
        raise RuntimeError(f"No SOURCES.md found in {composite_path}")

    # Parse SOURCES.md for skill URLs
    content = sources_md.read_text()
    urls = re.findall(r'\[github\.com/[^\]]+\]', content)
    urls = [u[1:-1] for u in urls]  # Remove brackets

    if not urls:
        raise RuntimeError("No skill URLs found in SOURCES.md")

    # Get name from existing SKILL.md
    skill_md = composite_path / "SKILL.md"
    name = composite_path.name
    workflow = ""

    if skill_md.exists():
        parsed = parse_skill_md(skill_md)
        name = parsed.get("name", name)

        # Try to preserve workflow section
        body = parsed.get("body", "")
        workflow_match = re.search(r'## Workflow\s*\n\n(.*?)(?=\n##|\Z)', body, re.DOTALL)
        if workflow_match:
            workflow = workflow_match.group(1).strip()

    # Re-compose
    compose(name, urls, composite_path, workflow)


def package(composite_path: Path, output_file: Path) -> None:
    """Package composite as a .zip file."""
    import zipfile

    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file_path in composite_path.rglob('*'):
            if file_path.is_file():
                arcname = file_path.relative_to(composite_path)
                zf.write(file_path, arcname)

    print(f"✓ Packaged to: {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description="Skills Lego - Combine multiple Claude Code skills into one composite skill.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create a new composite
  python lego.py \\
      --name "document-suite" \\
      --skills "github.com/user/pdf-skill" "github.com/user/xlsx-skill" \\
      --workflow "Use PDF for reading documents, XLSX for spreadsheets" \\
      --output ./my-composite

  # Update existing composite from SOURCES.md
  python lego.py --update ./my-composite

  # Package as .zip
  python lego.py --package ./my-composite --output my-composite.zip
        """
    )

    parser.add_argument("--name", "-n", help="Name for the composite skill")
    parser.add_argument("--skills", "-s", nargs="+", help="GitHub URLs of skills to combine")
    parser.add_argument("--workflow", "-w", default="", help="Description of how skills work together")
    parser.add_argument("--description", "-d", default="", help="Description of the composite skill")
    parser.add_argument("--output", "-o", type=Path, help="Output directory or file")
    parser.add_argument("--update", "-u", type=Path, help="Update existing composite from SOURCES.md")
    parser.add_argument("--package", "-p", type=Path, help="Package composite as .zip")

    args = parser.parse_args()

    if args.update:
        update_from_sources(args.update)
    elif args.package:
        output = args.output or Path(f"{args.package.name}.zip")
        package(args.package, output)
    elif args.skills and args.name and args.output:
        compose(args.name, args.skills, args.output, args.workflow, args.description)
    else:
        parser.print_help()
        print("\nError: Either --update, --package, or (--name, --skills, --output) required")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
