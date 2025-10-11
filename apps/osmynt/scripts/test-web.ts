#!/usr/bin/env bun

import { spawn } from 'child_process';
import { resolve } from 'path';

// Test the VS Code web extension in a browser
async function testWebExtension() {
    console.log('🚀 Starting VS Code web extension test...');
    
    // First, ensure the extension is built
    console.log('📦 Building web extension...');
    const buildProcess = spawn('bun', ['run', 'build:web'], {
        stdio: 'inherit',
        cwd: resolve(__dirname, '..')
    });
    
    await new Promise((resolve, reject) => {
        buildProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Build completed successfully');
                resolve(undefined);
            } else {
                reject(new Error(`Build failed with code ${code}`));
            }
        });
    });
    
    // Now test the extension
    console.log('🌐 Opening VS Code web extension in browser...');
    const testProcess = spawn('vscode-test-web', [
        '--extensionDevelopmentPath=.',
        '--extensionTestsPath=./dist/browser/extension.js'
    ], {
        stdio: 'inherit',
        cwd: resolve(__dirname, '..')
    });
    
    testProcess.on('close', (code) => {
        console.log(`🏁 Test completed with code ${code}`);
        process.exit(code || 0);
    });
    
    testProcess.on('error', (error) => {
        console.error('❌ Error running test:', error);
        process.exit(1);
    });
}

testWebExtension().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
