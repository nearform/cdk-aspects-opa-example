import * as cdk from "aws-cdk-lib"
import { Annotations } from "aws-cdk-lib"
import { IConstruct } from "constructs"
import * as s from "sync-request"
export class OpaChecker implements cdk.IAspect {

  private policyEndpoint = ''
  private id = ''
  
  constructor(id: string, policyEndpoint: string){
    this.id = id
    this.policyEndpoint = policyEndpoint
  }

  public visit(node: IConstruct): void {
  
    if (node instanceof cdk.CfnResource){
      
      let tags = null
      if (cdk.TagManager.isTaggable(node)){
        tags = node.tags.tagValues()
      }

      const data = {
        input: {
          id: node.node.id,
          addr: node.node.addr,
          path: node.node.path,
          type: node.cfnResourceType,
          metadata: node.node.metadata,
          stackMetadata: node.stack.node.metadata,
          isStack: cdk.Stack.isStack(node),
          tags: tags
        }
      }

      var res = s.default('POST', this.policyEndpoint, {
        json: data
      });

      if(res.statusCode > 399){
        Annotations.of(node).addError(`OpaChecker::${this.id}::HttpError_${res.statusCode}`);
        return
      }

      var body = JSON.parse(res.getBody('utf8'));
      
      if(body.result.allow){
        Annotations.of(node).addInfo(`OpaChecker::${this.id}::Allowed`);
      }else{
        Annotations.of(node).addError(`OpaChecker::${this.id}::NotAllowed`);
      }
    } 
  }
}
