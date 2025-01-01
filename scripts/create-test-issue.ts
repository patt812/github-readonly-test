import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config();

async function createTestIssue() {
  try {
    const privateKey = fs.readFileSync(
      path.resolve(process.env.PRIVATE_KEY_PATH || ''),
      'utf-8'
    );

    // Initialize Octokit with App credentials
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: parseInt(process.env.APP_ID || '', 10),
        privateKey: privateKey,
        installationId: parseInt(process.env.INSTALLATION_ID || '', 10),
      },
    });

    // Read issue template
    const template = fs.readFileSync(
      path.resolve(__dirname, '../templates/issues/basic.md'),
      'utf-8'
    );

    // Create issue
    const response = await octokit.issues.create({
      owner: process.env.REPOSITORY_OWNER || '',
      repo: process.env.REPOSITORY_NAME || '',
      title: 'Test Issue from Bot',
      body: template,
      labels: ['test'],
    });

    console.log('Issue created:', response.data.html_url);
  } catch (error) {
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

createTestIssue(); 