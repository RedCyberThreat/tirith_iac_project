from cfnlint.rules import CloudFormationLintRule, RuleMatch


class CustomS3PublicAccessBlockRule(CloudFormationLintRule):
    id = 'E01'
    shortdesc = 'S3 public access block booleans must be true'
    description = 'Detect S3 PublicAccessBlockConfiguration keys set to False'
    tags = ['s3','security']


    def match(self, cfn):
        matches = []
        # Check BucketPublicAccessBlock resources
        for name, resource in cfn.get_resources(
            ["AWS::S3::BucketPublicAccessBlock"]
        ).items():
            props = resource.get("Properties", {})
            pab = props.get("PublicAccessBlockConfiguration", {}) or {}
            for key in (
                "BlockPublicAcls",
                "IgnorePublicAcls",
                "BlockPublicPolicy",
                "RestrictPublicBuckets",
            ):
                if key in pab and pab[key] is False:
                    path = [
                        "Resources",
                        name,
                        "Properties",
                        "PublicAccessBlockConfiguration",
                        key,
                    ]
                    matches.append(RuleMatch(path, f"{name}: {key} is False"))
        # Check Bucket PublicAccessBlockConfiguration on AWS::S3::Bucket
        for name, resource in cfn.get_resources(["AWS::S3::Bucket"]).items():
            props = resource.get("Properties", {}) or {}
            pab = props.get("PublicAccessBlockConfiguration", {}) or {}
            for key in (
                "BlockPublicAcls",
                "IgnorePublicAcls",
                "BlockPublicPolicy",
                "RestrictPublicBuckets",
            ):
                if key in pab and pab[key] is False:
                    path = [
                        "Resources",
                        name,
                        "Properties",
                        "PublicAccessBlockConfiguration",
                        key,
                    ]
                    matches.append(RuleMatch(path, f"{name}: {key} is False"))
        return matches


class CustomS3BucketEncryptionRule(CloudFormationLintRule):
    id = 'E02'
    shortdesc = 'S3 buckets should have server-side encryption'
    description = 'Checks that S3 BucketEncryption uses AES256 or aws:kms, if aws:kms is set, check that the keys has been initialized'
    tags = ['s3','encryption']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::S3::Bucket"]).items():
            props = res.get("Properties", {}) or {}
            enc = props.get("BucketEncryption") or {}
            configs = (enc.get("ServerSideEncryptionConfiguration") or []) or []
            found_good = False
            for cfg in configs:
                sbyd = cfg.get("ServerSideEncryptionByDefault") or {}
                alg = sbyd.get("SSEAlgorithm")
                if alg == "AES256":
                    found_good = True
                elif alg == "aws:kms":
                    kms_key = cfg.get("KMSMasterKeyID")
                    if kms_key:
                        found_good = True
            if not found_good:
                path = ["Resources", name, "Properties", "BucketEncryption"]
                matches.append(
                    RuleMatch(
                        path, f"{name} has no AES256/aws:kms server-side encryption"
                    )
                )
        return matches


class CustomIamWildcardActionRule(CloudFormationLintRule):
    id = 'E03'
    shortdesc = 'IAM policies should not use wildcard action'
    description = 'Detects Action: * wildcard or similar in policies'
    tags = ['iam','security']

    def _check_policy_doc(self, policy_doc, base_path, matches, resname):
        stmts = policy_doc.get("Statement") or []
        for i, st in enumerate(stmts):
            actions = st.get("Action")
            if actions is None:
                continue
            if isinstance(actions, str):
                act_list = [actions]
            else:
                act_list = actions
            for a in act_list:
                if a == "*" or a.endswith(":*") or a == "*:*":
                    path = base_path + ["Statement", i, "Action"]
                    matches.append(
                        RuleMatch(path, f"{resname} policy Action uses wildcard: {a}")
                    )

    def match(self, cfn):
        matches = []
        # AWS::IAM::Policy resources
        for name, res in cfn.get_resources(["AWS::IAM::Policy"]).items():
            pd = (res.get("Properties", {}) or {}).get("PolicyDocument") or {}
            self._check_policy_doc(
                pd, ["Resources", name, "Properties", "PolicyDocument"], matches, name
            )
        # Roles / inline policies
        for name, res in cfn.get_resources(
            ["AWS::IAM::Role", "AWS::IAM::User", "AWS::IAM::Group"]
        ).items():
            props = res.get("Properties", {}) or {}
            policies = props.get("Policies") or []
            for idx, pol in enumerate(policies):
                pd = pol.get("PolicyDocument") or {}
                self._check_policy_doc(
                    pd,
                    [
                        "Resources",
                        name,
                        "Properties",
                        "Policies",
                        idx,
                        "PolicyDocument",
                    ],
                    matches,
                    name,
                )
        return matches


class CustomSecurityGroupOpenToWorldRule(CloudFormationLintRule):
    id = 'E04'
    shortdesc = 'SecurityGroup opens SSH/RDP or all ports to 0.0.0.0/0'
    description = 'Detects SecurityGroup ingress/egress entries open to 0.0.0.0/0 on ports 22 or 3389 or all ports'
    tags = ['ec2','security']

    def _port_contains_danger(self, from_p, to_p):
        try:
            if from_p is None and to_p is None:
                return True
            if from_p is None:
                return True
            if to_p is None:
                return True
            return (
                (from_p <= 22 <= to_p)
                or (from_p <= 3389 <= to_p)
                or (from_p == 0 and to_p == 65535)
            )
        except Exception:
            return False

    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::EC2::SecurityGroup"]).items():
            props = res.get("Properties", {}) or {}
            for prop_name in ("SecurityGroupIngress", "SecurityGroupEgress"):
                rules = props.get(prop_name) or []
                for idx, rule in enumerate(rules):
                    cidr = rule.get("CidrIp") or rule.get("CidrIpv6")
                    # ports may be numbers or strings (or intrinsics). Only check numeric cases.
                    try:
                        from_p = rule.get("FromPort")
                        to_p = rule.get("ToPort")
                        if isinstance(from_p, str) and from_p.isdigit():
                            from_p = int(from_p)
                        if isinstance(to_p, str) and to_p.isdigit():
                            to_p = int(to_p)
                    except Exception:
                        from_p = to_p = None
                    if cidr == "0.0.0.0/0" or cidr == "::/0":
                        if self._port_contains_danger(from_p, to_p):
                            path = ["Resources", name, "Properties", prop_name, idx]
                            matches.append(
                                RuleMatch(
                                    path,
                                    f"{name} {prop_name}[{idx}] open to the world on dangerous ports",
                                )
                            )
        return matches


class CustomRdsStorageEncryptedRule(CloudFormationLintRule):
    id = 'E05'
    shortdesc = 'RDS StorageEncrypted must be true'
    description = 'Check DBInstance and DBCluster StorageEncrypted property'
    tags = ['rds','encryption']

    def match(self, cfn):
        matches = []
        for t in ("AWS::RDS::DBInstance", "AWS::RDS::DBCluster"):
            for name, res in cfn.get_resources([t]).items():
                props = res.get("Properties", {}) or {}
                se = props.get("StorageEncrypted")
                if se is not True:
                    path = ["Resources", name, "Properties", "StorageEncrypted"]
                    matches.append(
                        RuleMatch(path, f"{name} missing StorageEncrypted=true")
                    )
        return matches
    
#new rules
class CustomS3BucketVersioningRule(CloudFormationLintRule):
    id = 'E06'
    shortdesc = 'S3 buckets should have versioning enabled'
    description = 'Check if an S3 bucket has versioning configured and enabled'
    tags = ['s3', 'operations']

    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::S3::Bucket"]).items():
            props = resource.get("Properties", {}) or {}
            versioning_config = props.get("VersioningConfiguration")
            if not versioning_config or versioning_config.get("Status") != "Enabled":
                path = ["Resources", name, "Properties", "VersioningConfiguration"]
                matches.append(
                    RuleMatch(path, f"{name}: S3 bucket versioning is not enabled")
                )
        return matches

class CustomS3BucketAccessLoggingRule(CloudFormationLintRule):
    id = 'E07'
    shortdesc = 'S3 buckets should have access logging enabled'
    description = 'Check if an S3 bucket has access logging enabled'
    tags = ['s3', 'security', 'operations']

    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::S3::Bucket"]).items():
            props = resource.get("Properties", {}) or {}
            logging_config = props.get("LoggingConfiguration")
            if not logging_config or not logging_config.get("DestinationBucketName"):
                path = ["Resources", name, "Properties", "LoggingConfiguration"]
                matches.append(
                    RuleMatch(
                        path, f"{name}: S3 bucket access logging is not configured"
                    )
                )
        return matches


class CustomEC2InstanceNoPublicIpRule(CloudFormationLintRule):
    id = 'E08'
    shortdesc = 'EC2 instances should not have public IPs'
    description = 'EC2 instances with a public IP assigned during launch'
    tags = ['ec2', 'security']

    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::EC2::Instance"]).items():
            props = resource.get("Properties", {}) or {}
            public_ip = props.get("AssociatePublicIpAddress")
            if public_ip is True:
                path = ["Resources", name, "Properties", "AssociatePublicIpAddress"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: EC2 instance should not have a public IP address",
                    )
                )
        return matches

class CustomLambdaVpcConfigRule(CloudFormationLintRule):
    id = 'W09'
    shortdesc = 'Lambda functions should be in a VPC for sensitive workloads'
    description = 'Check if a Lambda function is not configured to run in a VPC'
    tags = ['lambda', 'security']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::Lambda::Function"]).items():
            props = resource.get("Properties", {}) or {}
            vpc_config = props.get("VpcConfig")
            if not vpc_config:
                path = ["Resources", name, "Properties", "VpcConfig"]
                matches.append(
                    RuleMatch(
                        path, f"{name}: Lambda function is not configured for a VPC"
                    )
                )
        return matches


class CustomRDSMultiAzRule(CloudFormationLintRule):
    id = 'W10'
    shortdesc = 'RDS instances should use Multi-AZ for high availability'
    description = 'Check if an RDS DBInstance is not configured for Multi-AZ'
    tags = ['rds', 'availability', 'operations']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::RDS::DBInstance"]).items():
            props = resource.get("Properties", {}) or {}
            multi_az = props.get("MultiAz")
            if multi_az is not True:
                path = ["Resources", name, "Properties", "MultiAz"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: RDS DBInstance should be Multi-AZ for high availability",
                    )
                )
        return matches


class CustomCloudFrontHttpsOnlyRule(CloudFormationLintRule):
    id = 'E11'
    shortdesc = 'CloudFront distributions should use HTTPS-only'
    description = 'Check if CloudFront distribution viewer protocol policy is not set to redirect to HTTPS'
    tags = ['cloudfront', 'security']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::CloudFront::Distribution"]).items():
            props = res.get("Properties", {}) or {}
            distribution_config = props.get("DistributionConfig") or {}
            default_cache_behavior = (
                distribution_config.get("DefaultCacheBehavior") or {}
            )
            viewer_policy = default_cache_behavior.get("ViewerProtocolPolicy")

            if viewer_policy != "redirect-to-https":
                path = [
                    "Resources",
                    name,
                    "Properties",
                    "DistributionConfig",
                    "DefaultCacheBehavior",
                    "ViewerProtocolPolicy",
                ]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: CloudFront viewer policy is not set to redirect to HTTPS",
                    )
                )
        return matches


class CustomCloudWatchLogRetentionRule(CloudFormationLintRule):
    id = 'W12'
    shortdesc = 'CloudWatch Log Group retention period should be set'
    description = 'Check if a CloudWatch Log Group has no retention period defined'
    tags = ['cloudwatch', 'operations', 'cost']

    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::Logs::LogGroup"]).items():
            props = resource.get("Properties", {}) or {}
            retention_in_days = props.get("RetentionInDays")
            if not retention_in_days:
                path = ["Resources", name, "Properties", "RetentionInDays"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: CloudWatch Log Group should have a retention period set",
                    )
                )
        return matches


class CustomVpcFlowLogsEnabledRule(CloudFormationLintRule):
    id = 'W13'
    shortdesc = 'VPC Flow Logs should be enabled'
    description = 'Check if VPC Flow Logs are not enabled for a VPC'
    tags = ['ec2', 'vpc', 'security']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::EC2::VPC"]).items():
            props = resource.get("Properties", {}) or {}
            flow_logs = cfn.get_resources(["AWS::EC2::FlowLog"]).values()
            found_log = any(
                "ResourceId" in fl.get("Properties", {})
                and fl["Properties"]["ResourceId"] == {"Ref": name}
                for fl in flow_logs
            )
            if not found_log:
                path = ["Resources", name]
                matches.append(
                    RuleMatch(
                        path, f"{name}: VPC Flow Logs are not enabled for this VPC"
                    )
                )
        return matches


class CustomLambdaEnvVarEncryptionRule(CloudFormationLintRule):

    id = 'W16'
    shortdesc = 'Lambda environment variables should not contain secrets'
    description = 'Check if Lambda function environment variables are potentially sensitive'
    tags = ['lambda', 'security']

    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::Lambda::Function"]).items():
            props = resource.get("Properties", {}) or {}
            environment = props.get("Environment") or {}
            variables = environment.get("Variables") or {}
            for var_name, var_value in variables.items():
                if any(
                    x in var_name.upper()
                    for x in ("PASSWORD", "SECRET", "API_KEY", "TOKEN")
                ):
                    path = [
                        "Resources",
                        name,
                        "Properties",
                        "Environment",
                        "Variables",
                        var_name,
                    ]
                    matches.append(
                        RuleMatch(
                            path,
                            f"{name}: Lambda environment variable '{var_name}' may contain a secret",
                        )
                    )
        return matches


class CustomEC2TaggingEnforcedRule(CloudFormationLintRule):
    id = 'W17'
    shortdesc = 'EC2 instances should have a Name tag'
    description = 'Check if an EC2 instance is missing a Name tag'
    tags = ['ec2', 'cost', 'operations']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::EC2::Instance"]).items():
            props = resource.get("Properties", {}) or {}
            tags = props.get("Tags") or []
            if not any(tag.get("Key") == "Name" for tag in tags):
                path = ["Resources", name, "Properties", "Tags"]
                matches.append(
                    RuleMatch(path, f"{name}: EC2 instance is missing a 'Name' tag")
                )
        return matches


class CustomEbsEncryptionEnabledRule(CloudFormationLintRule):
    id = 'E18'
    shortdesc = 'EBS volumes must be encrypted'
    description = 'Checks if an EBS volume has encryption enabled'
    tags = ['ec2', 'ebs', 'encryption', 'security']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::EC2::Volume"]).items():
            props = resource.get("Properties", {}) or {}
            encrypted = props.get("Encrypted")
            if encrypted is not True:
                path = ["Resources", name, "Properties", "Encrypted"]
                matches.append(RuleMatch(path, f"{name}: EBS volume is not encrypted"))
        return matches


class CustomECRImageScanningRule(CloudFormationLintRule):
    id = 'W19'
    shortdesc = 'ECR repositories should have image scanning enabled'
    description = 'Check if an ECR repository is not configured for image scanning on push'
    tags = ['ecr', 'security']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::ECR::Repository"]).items():
            props = resource.get("Properties", {}) or {}
            image_scan_config = props.get("ImageScanningConfiguration") or {}
            scan_on_push = image_scan_config.get("ScanOnPush")
            if scan_on_push is not True:
                path = ["Resources", name, "Properties", "ImageScanningConfiguration"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: ECR repository does not have image scanning enabled",
                    )
                )
        return matches


class CustomRdsDeletionProtectionRule(CloudFormationLintRule):
    id = 'W20'
    shortdesc = 'RDS instances should have deletion protection enabled'
    description = 'Check if an RDS DBInstance is not configured with deletion protection'
    tags = ['rds', 'operations']


    def match(self, cfn):
        matches = []
        for name, resource in cfn.get_resources(["AWS::RDS::DBInstance"]).items():
            props = resource.get("Properties", {}) or {}
            deletion_protection = props.get("DeletionProtection")
            if deletion_protection is not True:
                path = ["Resources", name, "Properties", "DeletionProtection"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: RDS DBInstance deletion protection is not enabled",
                    )
                )
        return matches


class CustomIamUserNoInlinePolicies(CloudFormationLintRule):
    id = 'W21'
    shortdesc = 'IAM users should not have inline policies'
    description = 'Use managed policies over inline policies for IAM users'
    tags = ['iam', 'security']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::IAM::User"]).items():
            props = res.get("Properties", {}) or {}
            policies = props.get("Policies") or []
            if policies:
                path = ["Resources", name, "Properties", "Policies"]
                matches.append(
                    RuleMatch(path, f"{name}: IAM user should not have inline policies")
                )
        return matches


class CustomSnsTopicPolicyEnforcedRule(CloudFormationLintRule):
    id = 'E22'
    shortdesc = 'SNS topic policies should restrict access'
    description = 'Check for an SNS topic policy that is overly permissive'
    tags = ['sns', 'security']


    def _check_policy(self, policy_doc, base_path, matches, resname):
        statements = policy_doc.get("Statement") or []
        for i, statement in enumerate(statements):
            principals = statement.get("Principal")
            if principals == "*" or (
                isinstance(principals, dict) and principals.get("AWS") == "*"
            ):
                path = base_path + ["Statement", i, "Principal"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{resname}: SNS Topic policy is overly permissive with a wildcard principal",
                    )
                )

    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::SNS::TopicPolicy"]).items():
            props = res.get("Properties", {}) or {}
            policy_doc = props.get("PolicyDocument") or {}
            self._check_policy(
                policy_doc,
                ["Resources", name, "Properties", "PolicyDocument"],
                matches,
                name,
            )
        return matches


class CustomWafEnabledOnCloudFront(CloudFormationLintRule):
    id = 'W23'
    shortdesc = 'CloudFront distributions should use a WAF WebACL'
    description = 'Control if a CloudFront distribution is not associated with a WebACLId'
    tags = ['cloudfront', 'security']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::CloudFront::Distribution"]).items():
            props = res.get("Properties", {}) or {}
            dist_config = props.get("DistributionConfig") or {}
            web_acl_id = dist_config.get("WebACLId")
            if not web_acl_id:
                path = [
                    "Resources",
                    name,
                    "Properties",
                    "DistributionConfig",
                    "WebACLId",
                ]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: CloudFront distribution should have a WAF WebACL configured",
                    )
                )
        return matches


class CustomCloudTrailEncryptionRule(CloudFormationLintRule):
    id = 'E24'
    shortdesc = 'CloudTrail logs should be encrypted with KMS'
    description = 'Check if a CloudTrail trail is configured with a KMS key ID for encryption'
    tags = ['cloudtrail', 'security', 'encryption']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::CloudTrail::Trail"]).items():
            props = res.get("Properties", {}) or {}
            kms_key_id = props.get("KMSKeyId")
            if not kms_key_id:
                path = ["Resources", name, "Properties", "KMSKeyId"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: CloudTrail logs should be encrypted with a KMS key",
                    )
                )
        return matches


class CustomSecretsManagerRotationRule(CloudFormationLintRule):
    id = 'W25'
    shortdesc = 'Secrets Manager secrets should have rotation enabled'
    description = 'An AWS Secrets Manager secret is not configured for rotation'
    tags = ['secretsmanager', 'security']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::SecretsManager::Secret"]).items():
            props = res.get("Properties", {}) or {}
            rotation_enabled = props.get("RotationLambdaARN")
            if not rotation_enabled:
                path = ["Resources", name, "Properties", "RotationLambdaARN"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: Secrets Manager secret should have rotation enabled",
                    )
                )
        return matches

class CustomS3PublicReadWriteACLRule(CloudFormationLintRule):
    id = 'E26'
    shortdesc = 'S3 buckets should not have public read/write ACLs'
    description = 'Check S3 buckets with ACLs that allow public read or write access'
    tags = ['s3', 'security']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::S3::Bucket"]).items():
            props = res.get("Properties", {}) or {}
            access_control = props.get("AccessControl")
            if access_control in ("PublicRead", "PublicReadWrite"):
                path = ["Resources", name, "Properties", "AccessControl"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: S3 bucket ACL '{access_control}' is too permissive",
                    )
                )
        return matches


class CustomApiGatewayCachingEnabledRule(CloudFormationLintRule):

    id = 'W28'
    shortdesc = 'API Gateway stages should have caching enabled'
    description = 'Check if an API Gateway Stage is not configured with caching'
    tags = ['apigateway', 'cost', 'performance']

    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::ApiGateway::Stage"]).items():
            props = res.get("Properties", {}) or {}
            method_settings = props.get("MethodSettings") or []
            if not any(setting.get("CachingEnabled") for setting in method_settings):
                path = ["Resources", name, "Properties", "MethodSettings"]
                matches.append(
                    RuleMatch(
                        path, f"{name}: API Gateway stage should have caching enabled"
                    )
                )
        return matches


class CustomDynamoDbEncryptionRule(CloudFormationLintRule):
    id = 'E29'
    shortdesc = 'DynamoDB tables should be encrypted'
    description = 'Check if a DynamoDB table has server-side encryption enabled'
    tags = ['dynamodb', 'security', 'encryption']

    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::DynamoDB::Table"]).items():
            props = res.get("Properties", {}) or {}
            sse_spec = props.get("SSESpecification")
            if not sse_spec or sse_spec.get("SSEEnabled") is not True:
                path = ["Resources", name, "Properties", "SSESpecification"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: DynamoDB table should have server-side encryption enabled",
                    )
                )
        return matches


class CustomIamPolicyAttachedToGroupRule(CloudFormationLintRule):
    id = 'W30'
    shortdesc = 'IAM policies should be attached to groups, not users'
    description = 'Attaching IAM policies to groups instead of individual users'
    tags = ['iam', 'security']

    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::IAM::Policy"]).items():
            props = res.get("Properties", {}) or {}
            users = props.get("Users")
            if users:
                path = ["Resources", name, "Properties", "Users"]
                matches.append(
                    RuleMatch(
                        path,
                        f"{name}: IAM policies should be attached to groups, not users",
                    )
                )
        return matches


class CustomEc2SshFromAnywhereRule(CloudFormationLintRule):
    id = 'E31'
    shortdesc = 'Security groups should not allow SSH from 0.0.0.0/0'
    description = 'Check security group ingress rules for port 22 open to the world'
    tags = ['ec2', 'security']


    def match(self, cfn):
        matches = []
        for name, res in cfn.get_resources(["AWS::EC2::SecurityGroup"]).items():
            props = res.get("Properties", {}) or {}
            ingress_rules = props.get("SecurityGroupIngress") or []
            for idx, rule in enumerate(ingress_rules):

                from_port = rule.get('Fromport')
                to_port = rule.get('ToPort')
                cidr_ip = rule.get('CidrIp')
                if cidr_ip in ('0.0.0.0/0', '::/0') and (from_port is not None and to_port is not None and from_port <= 22 <= to_port):
                    path = ['Resources', name, 'Properties', 'SecurityGroupIngress', idx]
                    matches.append(RuleMatch(path, f"{name}: Security group allows SSH from the internet"))
        return matches

