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
  
    // THEN  
  Annotations.fromStack(stack).hasError('/MyTestStack/MyBucket/InsecureBucket/Resource', 'AWS::S3::Bucket::NoEncryption');
});

test('Financial Policy Not Allowed', async () => {
  const app = new cdk.App();
  
  // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');

  cdk.Aspects.of(stack).add(new OpaChecker('PolicyFinancial', 'http://localhost:8181/v1/data/policy/financial'));

  // THEN  
  Annotations.fromStack(stack).hasError('/MyTestStack/MyBucket/InsecureBucket/Resource', 'OpaChecker::PolicyFinancial::NotAllowed')
});


test('Financial Policy Allowed', async () => {
  
  //expect.assertions(1);

  const app = new cdk.App();
  
  // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');

  cdk.Tags.of(stack).add('active', 'yes')
  cdk.Tags.of(stack).add('hasBudget', 'yes')
  
  cdk.Aspects.of(stack).add(new OpaChecker('PolicyFinancial', 'http://localhost:8181/v1/data/policy/financial'));

  // THEN  
  Annotations.fromStack(stack).hasInfo('/MyTestStack/MyBucket/InsecureBucket/Resource', 'OpaChecker::PolicyFinancial::Allowed')
  expect(stack).toHaveResource('AWS::S3::Bucket')
});

test('Change Policy Not Allowed', async () => {
  
  //expect.assertions(1);

  const app = new cdk.App();
  
  // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');

  cdk.Aspects.of(stack).add(new OpaChecker('PolicyChange', 'http://localhost:8181/v1/data/policy/change'));

  // THEN  
  Annotations.fromStack(stack).hasError('/MyTestStack/MyBucket/InsecureBucket/Resource', 'OpaChecker::PolicyChange::NotAllowed')
});

test('Change Policy Allowed', async () => {
  
  //expect.assertions(1);

  const app = new cdk.App();
  
  // WHEN
  let stack = new Simple.SimpleStack(app, 'MyTestStack');

  stack.node.addMetadata("repoTag", "test-opa-change")
  stack.node.addMetadata("errorBudget", 0.1)

  cdk.Aspects.of(stack).add(new OpaChecker('MockBin', 'https://mockbin.org/bin/0ad461b4-4661-4a13-8070-44ed95f8a6a7'));
  cdk.Aspects.of(stack).add(new OpaChecker('PolicyChange', 'http://localhost:8181/v1/data/policy/change'));
  
  // THEN  
  Annotations.fromStack(stack).hasInfo('/MyTestStack/MyBucket/InsecureBucket/Resource', 'OpaChecker::PolicyChange::Allowed')
}); 