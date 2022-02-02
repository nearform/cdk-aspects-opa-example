import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class SimpleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new InsecureBucket(this, "MyBucket");
  }
}

export class InsecureBucket extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);   
    const insecureBucket = new cdk.aws_s3.Bucket(this, "InsecureBucket", {
      encryption: undefined
    });
  }
 }
 