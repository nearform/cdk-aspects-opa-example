#!/usr/bin/env node
import 'source-map-support/register';
//import * as cdk from 'aws-cdk-lib';

import { OpaChecker } from '../lib/opa-checker';
import { BucketEncryptionChecker } from '../lib/s3-checker';
import { App, Aspects, Tags } from 'aws-cdk-lib';
import { SecureStack } from '../lib/secure-stack';

const app = new App();
const stack = new SecureStack(app, 'SimpleStack', {});

//Fetch tags from somplace
Tags.of(stack).add("projectId", "my-project")
Tags.of(stack).add('active', 'yes')
Tags.of(stack).add('hasBudget', 'yes')

stack.node.addMetadata("repoTag", "v0.0.0")
stack.node.addMetadata("errorBudget", 100)

Aspects.of(stack).add(new OpaChecker('PolicyChange', 'http://localhost:8181/v1/data/policy/change'));
Aspects.of(stack).add(new OpaChecker('PolicyFinancial', 'http://localhost:8181/v1/data/policy/financial'));

Aspects.of(stack).add(new BucketEncryptionChecker());
