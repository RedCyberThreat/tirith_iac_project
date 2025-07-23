import json as j
from cfn_guard_rs import run_checks

def validate_template():
    """
    Validates a CloudFormation json template against a set of Guard rules.
    """
    
    #opening and reading the json file sent from the user
    with open("cloudFormation_template.json", "r") as user_file:
        template_data = j.loads(user_file)
        
    #opening and reading the set of .guard rules specified by the team 
    with open("guard_rules.guard", "r") as rules:
        rules_content = rules.read()
        
    
    #run the run_checks function to compare the json file with the rules and return a formatted json
    #the returned json will have the same format as the one in the Quickscan fucntion  
    
    return