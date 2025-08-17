from utilities import severity_evaluation
    
#funcntion to search for threats in the S3 buckets settings
def s3_check_public_access(list_of_s3_rules, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
    #loop to check each rule againts the json
    
    for i in list_of_s3_rules:
        try:
            if (value['Properties']['PublicAccessBlockConfiguration'][i]) == False:
                dangerous_rules[i] = severity_evaluation(i)
        except KeyError:
            continue
    return dangerous_rules

def s3_check_encryption(value):
    dangerous_rules = {}
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
def ec2_check_securitygroups(list_of_securityGroup_rules, iter, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
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
def iam_check_role(list_of_iam_rules, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
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
def rds_check_dbinstance(list_of_rds_rules, value):
    #return dict containing the rules that represent a threat
    dangerous_rules = {}
    
    #loop inside the list that contain the RDS properties
    for i in list_of_rds_rules:
        if(value['Properties'][i]) == False:
            dangerous_rules[i] = severity_evaluation(i)
    
    return dangerous_rules