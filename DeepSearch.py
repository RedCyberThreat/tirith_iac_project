from pathlib import Path
import json as j

from cfnlint.api import lint_file, ManualArgs
from utilities import severity_evaluation


#to run this code use py 3.13.0

def lint_cloudformation_template(data):
    
    file_path = Path(data)

    try:
        config_args = ManualArgs(
            regions=["us-east-1"],
            
        )
        

        matches = lint_file(file_path, config=config_args)
        
        filtered_matches = []
        for match in matches:

            filtered_matches.append(match)
            
        return filtered_matches

    except Exception as e:
        print(f"An unexpected error occurred during linting: {e}")
        return None

def generate_deepsearch_result(lint_results: list):
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
            "rule_solution": match.rule.description
        }

        if resource_name not in grouped_output:
            grouped_output[resource_name] = {}
        if property_name not in grouped_output[resource_name]:
            grouped_output[resource_name][property_name] = []

        grouped_output[resource_name][property_name].append(finding)

    return j.dumps(grouped_output, indent=2)

     
