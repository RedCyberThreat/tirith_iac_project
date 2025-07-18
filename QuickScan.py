import json as j

with open ('cloudFormation_template.json', 'r') as file:
    data = j.load(file)
  
#list of s3 rules  
list_of_s3_rules = ['BlockPublicAcls', 'IgnorePublicAcls', 'BlockPublicPolicy', 'RestrictPublicBuckets']
#list of SecurityGroup rules
list_of_securityGroup_rules = ['FromPort', 'ToPort']
#list for IAM rules
list_of_iam_rules = ['Action']
#list of RDS rules
list_of_rds_rules = ['StorageEncrypted']

#function to evaluate the severity of the rule
def severity_evaluation(rule):
    high_severity = {"open", "public", "*", "0.0.0.0", "ssh", "rdp", "internet", "admin", "fromport", "toport"}
    medium_severity = {"encryption", "unencrypted", "policy", "role", "privilege", "logging", "audit", "kms", "encrypted"}
    low_severity = {"naming", "tag", "versioning", "backup", "idle", "default", "description"}

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
    
    
#fucntion to search for threats in the S3 buckets settings
def s3_path(list_of_s3_rules, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {'Type' : 'S3'}
    
    #loop to check each rule againts the json
    
    for i in list_of_s3_rules:
        try:
            if (value['Properties']['PublicAccessBlockConfiguration'][i]) == False:
                dangerous_rules[i] = severity_evaluation(i)
        except KeyError:
            continue
    
    try:
        path = value['Properties']['BucketEncryption']['ServerSideEncryptionConfiguration'][0]['ServerSideEncryptionByDefault']['SSEAlgorithm']
        path_2 = value['Properties']['BucketEncryption']['ServerSideEncryptionConfiguration'][0]['ServerSideEncryptionByDefault']['KMSMasterKeyID']
    except KeyError:
        path_2 = False
        
    if (path == "AES256"):
        return dangerous_rules
    elif (path == 'aws:kms' and path_2):
        return dangerous_rules        
    else:
        dangerous_rules['ServerSideEncryption'] = severity_evaluation('ServerSideEncryptionConfiguration')
        
    return dangerous_rules


#function to search for for threats in the SecurityGroup settings
def securityGroup_path(list_of_securityGroup_rules, iter, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {'Type' : 'SecurityGroup'}
    
    #loop inside the list that contain the securityGroup properties
    for i in list_of_securityGroup_rules:
        try:
            if (value['Properties']['SecurityGroupIngress'][iter][i] in [22, 3389]):
                if (value['Properties']['SecurityGroupIngress'][iter]["CidrIp"] == "0.0.0.0/0"):
                    dangerous_rules[i] = severity_evaluation(i)
        except KeyError:
            continue     
    
    return dangerous_rules


#fuction to search for threats in the IAM settings
def iam_path(list_of_iam_rules, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {'Type' : 'IAM'}
    
    #loop inside the list that contain the IAM properties
    for i in list_of_iam_rules:
        try:
            if (value['Properties']['AssumeRolePolicyDocument']['Statement'][0][i] == '*' or
                value['Properties']['Policies'][0]['PolicyDocument']['Statement'][0][i] == '*'):
                
                dangerous_rules['Actions'] = severity_evaluation('*')
        except KeyError:
            continue
    
    return dangerous_rules


#function to search threats in the RDS settings
def rds_path(list_of_rds_rules, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {'Type' : 'RDS'}
    
    #loop inside the list that contain the RDS properties
    for i in list_of_rds_rules:
        if(value['Properties'][i]) == False:
            dangerous_rules[i] = severity_evaluation(i)
    
    return dangerous_rules


def threat_check():
    #loop in the uploded json to check for threats
    informations = data['Resources']
    for key, value in informations.items():
        
        #checking for S3 threaths
        if 'S3' in value['Type']:
            s3_issues = s3_path(list_of_s3_rules, value)
            print(s3_issues)
            
        #checking for SecurityGroup threats
        if 'SecurityGroup' in value['Type']:
            val_type = value['Properties']['SecurityGroupIngress']
            iteration = 0
            for rule in val_type:
                securityGroup_issues = securityGroup_path(list_of_securityGroup_rules, iteration, value)
                print(securityGroup_issues)
                iteration += 1
                
        #checking for IAM threats
        if 'IAM::Role' in value['Type']:
            iam_issues = iam_path(list_of_iam_rules, value)
            print(iam_issues)
            
        #checking for RDS threats
        if 'RDS::DBInstance' in value['Type']:
            rds_issues = rds_path(list_of_rds_rules, value)
            print(rds_issues)
   
            
threat_check()


