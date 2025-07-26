import os
import sys
import subprocess
from pathlib import Path
import json

from cfnlint.api import lint_file, lint, ManualArgs
from cfnlint.rules import Match

def lint_cloudformation_template_programmatically(template_file_path: str) -> list[Match] | None:
    """
    Lints a CloudFormation template file using cfn-lint's Python API,
    specifically leveraging the `lint_file` function from `cfnlint.api`.

    Args:
        template_file_path (str): The path to the CloudFormation JSON/YAML file.

    Returns:
        list[Match]: A list of cfnlint.rules.Match objects representing the findings.
                     Returns an empty list if no issues, or None if a critical error occurred.
    """
    template_path_obj = Path(template_file_path)

    if not template_path_obj.exists():
        print(f"Error: Template file not found at {template_file_path}")
        return []

    try:
        config_args = ManualArgs(
            regions=["us-east-1"],
            # You can add other configurations here, e.g.:
            # ignore_checks=['W2001'], # Example: ignore unused parameter warnings
            # include_checks=["W", "E"] # Only show Warnings and Errors
        )

        matches = lint_file(template_path_obj, config=config_args)
        
        filtered_matches = []
        for match in matches:

            filtered_matches.append(match)
            
        return filtered_matches

    except Exception as e:
        print(f"An unexpected error occurred during linting: {e}")
        import traceback
        traceback.print_exc()
        return None


def print_lint_findings(lint_results: list[Match] | None):
    """
    Prints the linting findings from cfn-lint's Python API.
    Only prints non-syntax errors and their paths.
    """
    if lint_results is None:
        print("Linting failed or returned no results due to a critical error.")
        return
    if not lint_results:
        print("\n--- cfn-lint Findings (excluding syntax errors) ---")
        print("No non-syntax issues found. Template is clean.")
        return

    print("\n--- cfn-lint Findings (excluding syntax errors) ---")
    for match in lint_results:

        print(f"  Rule: {match.rule.id} ({match.rule.severity})")
        print(f"    Message: {match.message}")
        print(f"    Path: {match.filename}:{match.linenumber}:{match.columnnumber}")
        print(f"    Rule Description: {match.rule.description}")
        print("-" * 30)

# --- Main execution ---
if __name__ == "__main__":
    template_file = 'my_cloudFormation_template.json'

        
    template_file = './cloudFormation_template.json'

    # Check for PyYAML installation (cfn-lint can handle YAML too)
    try:
        import yaml
    except ImportError:
        print("PyYAML not found. Installing PyYAML...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pyyaml"])
            print("PyYAML installed successfully.")
        except Exception as e:
            print(f"Failed to install PyYAML: {e}. You might need to install it manually (e.g., pip install pyyaml).")
        import yaml 


    lint_findings = lint_cloudformation_template_programmatically(template_file)

    if lint_findings is not None:
        print_lint_findings(lint_findings)
