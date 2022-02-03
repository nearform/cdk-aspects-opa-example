import * as cdk from "aws-cdk-lib";
import { Annotations } from "aws-cdk-lib";
import { Construct, IConstruct } from "constructs";

export class OpaChecker implements cdk.IAspect {
  public visit(node: IConstruct): void {
    if (cdk.TagManager.isTaggable(node)){


      console.debug(node.tags.tagValues());
      
      
      Annotations.of(node).addError('OpaChecker::NotAllowed');
    }
  }
}
