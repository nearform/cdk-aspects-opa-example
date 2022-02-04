import { Annotations, CfnResource, IAspect, Stack, TagManager } from "aws-cdk-lib"
import { ExecException } from "child_process"
import { IConstruct } from "constructs"
import * as syncRequest from "sync-request"
export class OpaChecker implements IAspect {

  private id = ''
  private opClient: IOpaClient
  
  constructor(id: string, opClient: IOpaClient){
    this.id = id
    this.opClient = opClient
  }

  public visit(node: IConstruct): void {
  
    const data = this.buildData(node)

    this.loadTagsData(node, data)
    this.loadCnfResourceData(node, data)

    const opaResult = this.opClient.submit(
      {
        input: data
      }
    )

    if(opaResult.error){
      Annotations.of(node).addError(`OpaChecker::${this.id}::${opaResult.errorMsg}`);
    }
    
    if(opaResult.result.allow){
      Annotations.of(node).addInfo(`OpaChecker::${this.id}::Allowed`);
    }else{
      Annotations.of(node).addError(`OpaChecker::${this.id}::NotAllowed`);
    }
  }

  private loadTagsData(node: IConstruct, data: any){
    if (TagManager.isTaggable(node)){
      data.tags = node.tags.tagValues()
    }
  }
  
  private loadCnfResourceData(node: IConstruct, data: any){
    if (node instanceof CfnResource){
      data.type = node.cfnResourceType
      data.metadata = node.node.metadata
      data.stackMetadata = node.stack.node.metadata
      data.isStack = Stack.isStack(node)
    }
  }

  private buildData(node: IConstruct): any{
    return {
        id: node.node.id,
        addr: node.node.addr,
        path: node.node.path,
        metadata: node.node.metadata        
    }
  }
}

export interface IOpaClient {
  submit(data: any): any;
}

export class DefaultOpaClient implements IOpaClient {

  private policyEndpoint = ''
  
  constructor(policyEndpoint: string){
    this.policyEndpoint = policyEndpoint
  }

  submit(data: any): any {

    try{
      var res = syncRequest.default('POST', this.policyEndpoint, {
        json: data
      });
  
      if(res.statusCode > 399){
        return {
          error: true,
          errorMsg: `DefaultOpaClient::HttpError_${res.statusCode}`
        }
      }
  
      return JSON.parse(res.getBody('utf8'));

    }catch(e){
      return {
        error: true,
        errorMsg: (e as ExecException).message
      }
    }    
  }
}