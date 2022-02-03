import * as cdk from "aws-cdk-lib"
import { Annotations } from "aws-cdk-lib"
import { Construct, IConstruct } from "constructs"
import * as s from "sync-request"
export class OpaChecker implements cdk.IAspect {
  public visit(node: IConstruct): void {
    if (cdk.TagManager.isTaggable(node)){

      var res = s.default('POST', 'http://localhost:8181/v1/data/policy/financial', {
        json: {
          input: node.tags.tagValues()
        }
      });

      var result = JSON.parse(res.getBody('utf8')).result;

      if(!result.allow){
        Annotations.of(node).addError('OpaChecker::NotAllowed');
      }else{
        Annotations.of(node).addInfo('OpaChecker::Allowed');
      }
    }
  }
}