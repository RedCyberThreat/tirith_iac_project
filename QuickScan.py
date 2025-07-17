import json as j

with open ('cloudFormation_template.json', 'r') as file:
    data = j.load(file)
  
# list_of_supported_rules = ["S3", "IAM", "SecurityGroup", "RDS", "AWS::S3::Bucket"]  
list_of_s3_rules = ['BlockPublicAcls', 'IgnorePublicAcls', 'BlockPublicPolicy', 'RestrictPublicBuckets']

def s3_path(list_of_s3_rules):
    dangerous_rules = {}
    for i in list_of_s3_rules:
        if (value['Properties']['PublicAccessBlockConfiguration'][i]) == False:
            dangerous_rules[i] = "Threat"
        
    return dangerous_rules

informations = data['Resources']
for key, value in informations.items():
    
    
    if 'S3' in value['Type']:
        s3_issues = s3_path(list_of_s3_rules)
        print(s3_issues)
