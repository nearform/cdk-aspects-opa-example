#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as s3checker from '../lib/s3-checker';
import { SimpleStack } from '../lib/simple-stack';

const app = new cdk.App();
const simpleStack = new SimpleStack(app, 'SimpleStack', { });
cdk.Aspects.of(simpleStack).add(new s3checker.BucketEncryptionChecker());