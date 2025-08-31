import os
import shutil
import json
import json_source_map
from pathlib import Path


#function to evaluate the severity of the rule
def severity_evaluation(rule):
    high_severity = {"open", "public", "*", "0.0.0.0", "ssh", "rdp", "internet", "admin",
                    "fromport", "toport", "master", "password", "protection"}

    medium_severity = {"encryption", "unencrypted", "policy", "role", "privilege",
                    "logging", "audit", "kms", "encrypted", "group", "az", "property", "policies"}

    low_severity = {"naming", "tag", "versioning", "backup", "idle", "default", "description",
                "engine", "0", "1"}

    rule_lower = rule.lower()
    #check for high severity keywords
    if any(keyword in rule_lower for keyword in high_severity):
        return "High"
    #check for medium severity keywords
    if any(keyword in rule_lower for keyword in medium_severity):
        return "Medium"
    #check for low severity keywords
    if any(keyword in rule_lower for keyword in low_severity):
        return "Low"


#function to create a folder if not exist and put inside the json file to be parsed to lint
def save_file(raw_data):

    source_file_name = "user_json.json"

    os.makedirs("user_data", exist_ok=True)

    #define the path for the file
    file_path = os.path.join("user_data", source_file_name)
    second_file_name = os.path.join("user_data", "line_mapping.json")

    try:
        with open(second_file_name, "w")as secondfile:
            secondfile.write(raw_data)

    except Exception as e:
        print("Exception occurred while writing the file")


#function to delete the created folder once utilized
def delete_folder():
    folder_path = "./user_data"

    try:
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
    except Exception:
        print("Something get wrong while deleting the folder")

#function to calculate the line of the issue in the json
def find_line(data, match_path):

    file_path = Path(data)

    with open(file_path, "r") as f:
        the_json = f.read()

    try:
        source_map = json_source_map.calculate(the_json)

        line = source_map[match_path].value_start.line
        column = source_map[match_path].value_start.column

        return f"{line + 1}:{column}"
    except Exception:
        return "not found"


def create_path_for_coordinate_resources(matches):
    string_matches = [str(item) for item in matches]
    final_result = '/' + '/'.join(string_matches)

    return final_result
