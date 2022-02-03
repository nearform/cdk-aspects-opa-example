import '@aws-cdk/assert/jest';
import * as cdk from 'aws-cdk-lib';
import { Annotations } from 'aws-cdk-lib/assertions';
import { OpaChecker } from '../lib/opa-checker';
import { BucketEncryptionChecker } from '../lib/s3-checker';
import * as Simple from '../lib/simple-stack';

test('S3 Bucket Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new Simple.SimpleStack(app, 'MyTestStack');
    // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket')
});

test('S3 Bucket Not Created Without Encryption', () => {
  const app = new cdk.App();
    // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');
  
  cdk.Aspects.of(stack).add(new BucketEncryptionChecker());
  
  stack.node.validate()
    // THEN  
  Annotations.fromStack(stack).hasError('/MyTestStack/MyBucket/InsecureBucket/Resource', 'AWS::S3::Bucket::NoEncryption');
});

test('OPA Bundle Test Not Allowed', async () => {
  
  //expect.assertions(1);

  const app = new cdk.App();
  
  // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');

  cdk.Aspects.of(stack).add(new OpaChecker());

  // THEN  
  Annotations.fromStack(stack).hasError('/MyTestStack/MyBucket/InsecureBucket/Resource', 'OpaChecker::NotAllowed')
});


test('OPA Bundle Test Allowed', async () => {
  
  //expect.assertions(1);

  const app = new cdk.App();
  
  // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');

  cdk.Tags.of(stack).add('active', 'yes')
  cdk.Tags.of(stack).add('hasBudget', 'yes')

  cdk.Aspects.of(stack).add(new OpaChecker());

  // THEN  
  Annotations.fromStack(stack).hasInfo('/MyTestStack/MyBucket/InsecureBucket/Resource', 'OpaChecker::Allowed')
});
