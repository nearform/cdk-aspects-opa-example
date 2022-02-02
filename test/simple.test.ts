import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Simple from '../lib/simple-stack';

test('S3 Bucket Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new Simple.SimpleStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', { });
});
