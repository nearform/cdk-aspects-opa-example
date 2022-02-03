import * as cdk from 'aws-cdk-lib';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class SecureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new SecureBucket(this, "MyBucket");
  }
}

export class SecureBucket extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);   
    const secureBucket = new cdk.aws_s3.Bucket(this, "SecureBucket", {
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED
    });
  }
 }
 