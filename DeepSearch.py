from pathlib import Path
import json as j

from cfnlint.api import lint_file, ManualArgs
from cfnlint.rules import Match
from rule_engine import severity_evaluation


#to run this code use py 3.13.0

def lint_cloudformation_template(template_file_path: str):
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
            
        )
        

        matches = lint_file(template_path_obj, config=config_args)
        
        filtered_matches = []
        for match in matches:

            filtered_matches.append(match)
            
        return filtered_matches

    except Exception as e:
        print(f"An unexpected error occurred during linting: {e}")
        return None

def generate_lint_findings_dict(lint_results: list):
    grouped_output = {}

    if lint_results is None:
        return {"error": "Linting failed or returned no results."}

    for match in lint_results:
        if not match.path or len(match.path) < 2:
            continue

        resource_name = str(match.path[0])
        
        if len(match.path) >= 3:
            property_name = str(match.path[3])
        else:
            property_name = "UnknownProperty"

        finding = {
            "severity": severity_evaluation(str(property_name)),
            "message": match.message,
            "path": f"{match.filename}:{match.linenumber}:{match.columnnumber}",
            "rule_description": match.rule.description
        }

        if resource_name not in grouped_output:
            grouped_output[resource_name] = {}
        if property_name not in grouped_output[resource_name]:
            grouped_output[resource_name][property_name] = []

        grouped_output[resource_name][property_name].append(finding)

    return grouped_output

# main execution 
if __name__ == "__main__":
        
    template_file = './cloudFormation_template.json'

    lint_findings = lint_cloudformation_template(template_file)

    if lint_findings is not None:
        print(j.dumps(generate_lint_findings_dict(lint_findings), indent=2))        
