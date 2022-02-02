#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SimpleStack } from '../lib/simple-stack';

const app = new cdk.App();
new SimpleStack(app, 'SimpleStack', { });