from pathlib import Path
import json as js

from cfnlint.api import lint_file, ManualArgs
from utilities import severity_evaluation, find_line, create_path_for_coordinate_resources


#to run this code use py 3.11.0

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
    
    #dictionaries for sorting
    high_severity = {}
    medium_severity = {}
    low_severity = {}

    if lint_results is None:
        return {"error": "Linting failed or returned no results."}
    
    n = len(lint_results)
    
    severity_values = {"High" : 3, "Medium" : 2, "Low" : 1}
    for i in range(n):
        for j in range(0, n - i - 1):
            
            if len(lint_results[j].path) >= 4:
                property_name_1 = severity_evaluation(str(lint_results[j].path[3]))
            else:
                property_name_1 = severity_evaluation("UnknownProperty")
                
            if len(lint_results[j + 1].path) >= 4:
                property_name_2 = severity_evaluation(str(lint_results[j + 1].path[3])) 
            else:
                property_name_2 = severity_evaluation("UnknownProperty")
                
            if (severity_values[property_name_1] < severity_values[property_name_2]):
                temp_val = lint_results[j]
                lint_results[j] = lint_results[j + 1]
                lint_results[j + 1] = temp_val
            
         
    for match in lint_results:
        if not match.path or len(match.path) < 2:
            continue

        resource_name = str(match.path[0])
        
        if len(match.path) >= 4:
            property_name = str(match.path[3])
        else:
            property_name = "UnknownProperty"
            
        path_to_calculate_line = create_path_for_coordinate_resources(match.path)
        
        finding = {
            "severity": severity_evaluation(str(property_name)),
            "message": match.message,
            "path": str(find_line("./user_data/line_mapping.json", path_to_calculate_line)),
            "rule_solution": match.rule.description,
        }

        if resource_name not in grouped_output:
            grouped_output[resource_name] = {}
        if property_name not in grouped_output[resource_name]:
            grouped_output[resource_name][property_name] = []
            
        grouped_output[resource_name][property_name].append(finding)
        
    return js.dumps(grouped_output, indent=2)

     
