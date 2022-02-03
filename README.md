# CDK Aspects and Open Policy Manager
Aspects are a way to change constructs in a given scope based on any aspect of that node.  CDK Aspects implements the Visitor pattern using the interface IAspect. 

## A policy for block the creation of buckets without encryption

```typescript
export class BucketEncryptionChecker implements cdk.IAspect {
 public visit(node: IConstruct): void {
     if (node instanceof cdk.aws_s3.CfnBucket && !node.bucketEncryption){    
       Annotations.of(node).addError('Bucket encryption is not enabled');
     }       
   }
 }
```
## A rich example using OPA
When we talk about dozens of policies and the validation of them in some contexts we can get all this stuff much complex, and control It with imperative code is panyfull as you can imaginate. In this case the Open Policy Agente or just OPA can help us!

## Policy-based control for cloud native environments
OPA brings us stable, simple and flexible fine-grained control for all aspects of elements in a stack. With this one you can decouple your policies and rules from your services and maintain a concise base for those without losing performance or availability.

## Running opa server
For run this project you need [opa agent](https://www.openpolicyagent.org/docs/v0.11.0/get-started/) installed

### To run in localhost:8181

```opa run -s -b --watch test/policies```
## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
