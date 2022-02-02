import * as cdk from "aws-cdk-lib";
import { Annotations } from "aws-cdk-lib";
import { Construct, IConstruct } from "constructs";

export class BucketEncryptionChecker implements cdk.IAspect {
  public visit(node: IConstruct): void {
      if (node instanceof cdk.aws_s3.CfnBucket && !node.bucketEncryption){     
        Annotations.of(node).addError('AWS::S3::Bucket::NoEncryption');
      }        
    }
  }

