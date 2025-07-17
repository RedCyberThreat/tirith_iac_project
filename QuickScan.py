import json as j

with open ('cloudFormation_template.json', 'r') as file:
    data = j.load(file)
  
#list of s3 rules  
list_of_s3_rules = ['BlockPublicAcls', 'IgnorePublicAcls', 'BlockPublicPolicy', 'RestrictPublicBuckets']
#list of SecurityGroup rules
list_of_securityGroup_rules = ['FromPort', 'ToPort']
#list for IAM rules
list_of_iam_rules = ['Action']


#fucntion to search for threats in the S3 buckets settings
def s3_path(list_of_s3_rules):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
    #loop to check each rule againts the json
    for i in list_of_s3_rules:
        if (value['Properties']['PublicAccessBlockConfiguration'][i]) == False:
            dangerous_rules[i] = "Threat"
    
    if (value['Properties']['BucketEncryption']['ServerSideEncryptionConfiguration'][0]['ServerSideEncryptionByDefault']['SSEAlgorithm']) != "AES256":
        dangerous_rules['ServerSideEncryption'] = 'Threat'
        
    return dangerous_rules



#function to search for for threats in the SecurityGroup settings
def securityGroup_path(list_of_securityGroup_rules, iter):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
    #loop inside the list that contain the securityGroup properties
    for i in list_of_securityGroup_rules:
        if(value['Properties']['SecurityGroupIngress'][iter][i]) == (22 or 3389):
            dangerous_rules[i] = "Threat"
    
    return dangerous_rules

#fuction to search for threats in the IAM settings
def iam_path(list_of_iam_rules):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
    for i in list_of_iam_rules:
        if (value['Properties']['AssumeRolePolicyDocument']['Statement'][0][i] == '*' or
            value['Properties']['Policies'][0]['PolicyDocument']['Statement'][0][i] == '*'):
            
            dangerous_rules['Actions'] = 'Threat'
    
    return dangerous_rules


#loop in the uploded json to check for threats
informations = data['Resources']
for key, value in informations.items():
    
    #checking for S3 threaths
    if 'S3' in value['Type']:
        s3_issues = s3_path(list_of_s3_rules)
        print(s3_issues)
        
    #checking for SecurityGroup threats
    if 'SecurityGroup' in value['Type']:
        val_type = value['Properties']['SecurityGroupIngress']
        iteration = 0
        for rule in val_type:
            securityGroup_issues = securityGroup_path(list_of_securityGroup_rules, iteration)
            print(securityGroup_issues)
            iteration += 1
            
    if 'IAM::Role' in value['Type']:
        iam_issues = iam_path(list_of_iam_rules)
        print(iam_issues)
        
        
