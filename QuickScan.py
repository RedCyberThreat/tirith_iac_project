import json as j
from rule_engine import (
    s3_check_public_access,
    s3_check_encryption,
    ec2_check_securitygroups,
    iam_check_role,
    rds_check_dbinstance,
)

#list of s3 rules  
s3_public_access_rules = ['BlockPublicAcls', 'IgnorePublicAcls', 'BlockPublicPolicy', 'RestrictPublicBuckets']
#list of SecurityGroup rules
list_of_securityGroup_rules = ['FromPort', 'ToPort']
#list for IAM rules
list_of_iam_rules = ['Action']
#list of RDS rules
list_of_rds_rules = ['StorageEncrypted']
def append_result(result, type_name, all_findings):
    if len(result) > 0:
        if type_name not in all_findings:
            all_findings[type_name] = []
        all_findings[type_name].append(result)

def threat_check(data):
    all_findings = {}
    #loop in the uploded json to check for threats
    try:
        reseurces = data['Resources']
    except KeyError:
        reseurces = data['Resource']
        
    for key, value in reseurces.items():

        #checking for S3 threaths
        if 'S3' in value['Type']:
            # checking for AWS:S3:Bucket threaths
            if 'S3::Bucket' in value['Type']:
                result1 = s3_check_public_access(s3_public_access_rules, value)
                result2 = s3_check_encryption(value)

                for result in [result1, result2]:
                    type_name = 'AWS::S3::Bucket'
                    append_result(result, type_name, all_findings)
            
        #checking for EC2 threats
        if 'EC2' in value['Type']:
            # checking for AWS::EC2::SecurityGroup threaths
            if 'EC2::SecurityGroup' in value['Type']:
                for i, _ in enumerate(value['Properties'].get('SecurityGroupIngress', [])):
                    result = ec2_check_securitygroups(list_of_securityGroup_rules, i, value)
                    type_name = 'AWS::EC2::SecurityGroup'
                    append_result(result, type_name, all_findings)
                
        #checking for IAM threats
        if 'IAM' in value['Type']:
            # checking for AWS::IAM::Role threaths
            if 'IAM::Role' in value['Type']:
                result = iam_check_role(list_of_iam_rules, value)
                type_name = 'AWS::IAM::Role'
                append_result(result, type_name, all_findings)

        #checking for RDS threats
        if 'RDS' in value['Type']:
            # checking for AWS::RDS::DBInstance threaths
            if 'RDS::DBInstance' in value['Type']:
                result = rds_check_dbinstance(list_of_rds_rules, value)
                type_name = 'AWS::RDS::DBInstance'
                append_result(result, type_name, all_findings)


    return j.dumps(all_findings, indent=2)

