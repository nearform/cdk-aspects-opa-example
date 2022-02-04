
import { aws_s3, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class SimpleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new InsecureBucket(this, "MyBucket");
  }
}

export class InsecureBucket extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);   
    const insecureBucket = new aws_s3.Bucket(this, "InsecureBucket", {
      encryption: undefined
    });
  }
 }
 