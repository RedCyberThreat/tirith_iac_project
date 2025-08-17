import os
import shutil
import json

#function to evaluate the severity of the rule
def severity_evaluation(rule):
    high_severity = {"open", "public", "*", "0.0.0.0", "ssh", "rdp", "internet", "admin", "fromport", "toport", "master", "password"}
    medium_severity = {"encryption", "unencrypted", "policy", "role", "privilege", "logging", "audit", "kms", "encrypted", "group"}
    low_severity = {"naming", "tag", "versioning", "backup", "idle", "default", "description", "engine"}

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
def save_file(data):
    
    source_file_name = "user_json.json"
    
    os.makedirs("user_data", exist_ok=True)
    
    #define the path for the file
    file_path = os.path.join("user_data", source_file_name)
    
    try:
        with open(file_path, "w")as file:
            json.dump(data, file, indent=2)
    
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