#!/usr/bin/env bun

import { spawn } from 'child_process';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Simple VS Code web extension test without test runner
async function testWebExtension() {
    console.log('🚀 Starting simple VS Code web extension test...');
    
    // Check if extension is built
    const extensionPath = resolve(__dirname, '..', 'dist', 'browser', 'extension.js');
    if (!existsSync(extensionPath)) {
        console.log('📦 Building extension first...');
        const buildProcess = spawn('bun', ['run', 'build:web'], {
            stdio: 'inherit',
            cwd: resolve(__dirname, '..')
        });
        
        await new Promise((resolve, reject) => {
            buildProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Build completed');
                    resolve(undefined);
                } else {
                    reject(new Error(`Build failed with code ${code}`));
                }
            });
        });
    }
    
    console.log('🌐 Opening VS Code web with your extension...');
    console.log('📝 Extension loaded from:', extensionPath);
    console.log('🔧 Use Ctrl+C to stop the server');
    console.log('🎯 Open browser dev tools to see extension logs');
    
    // Start VS Code web without test runner
    const testProcess = spawn('vscode-test-web', [
        '--extensionDevelopmentPath=.',
        '--browser=chromium',
        '--headless=false',
        '--port=7070',
        '--open-devtools'
    ], {
        stdio: 'inherit',
        cwd: resolve(__dirname, '..')
    });
    
    // Handle cleanup
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping VS Code web server...');
        testProcess.kill('SIGINT');
        process.exit(0);
    });
    
    testProcess.on('close', (code) => {
        console.log(`🏁 VS Code web server stopped with code ${code}`);
        process.exit(code || 0);
    });
    
    testProcess.on('error', (error) => {
        console.error('❌ Error starting VS Code web server:', error);
        process.exit(1);
    });
}

testWebExtension().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
