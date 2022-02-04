#!/usr/bin/env node
import 'source-map-support/register';
import { DefaultOpaClient, OpaChecker } from '../lib/opa-checker';
import { BucketEncryptionChecker } from '../lib/s3-checker';
import { App, Aspects, Tags } from 'aws-cdk-lib';
import { SecureStack } from '../lib/secure-stack';

// => bin/simple.ts
const app = new App();
const stack = new SecureStack(app, 'SimpleStack', {});

Tags.of(stack).add("projectId", "my-project")
Tags.of(stack).add('active', 'yes')
Tags.of(stack).add('hasBudget', 'yes')

stack.node.addMetadata("repoTag", "v0.0.0")
stack.node.addMetadata("errorBudget", 0.1)

Aspects.of(stack).add(new BucketEncryptionChecker());

const opaServerEndpoing = "http://localhost:8181/v1/data"
const policyChangeClient = new DefaultOpaClient(`${opaServerEndpoing}/policy/change`)
const policyFinancialClient = new DefaultOpaClient(`${opaServerEndpoing}/policy/financial`)

Aspects.of(stack).add(new OpaChecker('PolicyChange', policyChangeClient))
Aspects.of(stack).add(new OpaChecker('PolicyFinancial', policyFinancialClient))
