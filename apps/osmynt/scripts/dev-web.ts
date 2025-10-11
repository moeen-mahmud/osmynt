#!/usr/bin/env bun

import { spawn } from 'child_process';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Development server for VS Code web extension
async function startDevServer() {
    console.log('🚀 Starting VS Code web extension development server...');
    
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
    
    console.log('🌐 Starting VS Code web extension test environment...');
    console.log('📝 Extension will be loaded from:', extensionPath);
    console.log('🔧 Use Ctrl+C to stop the server');
    
    // Start the test web server
    const testProcess = spawn('vscode-test-web', [
        '--extensionDevelopmentPath=.',
        '--browser=chromium', // Use Chromium for better debugging
        '--headless=false', // Show browser window
        '--open-devtools' // Open dev tools automatically
    ], {
        stdio: 'inherit',
        cwd: resolve(__dirname, '..')
    });
    
    // Handle cleanup
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping development server...');
        testProcess.kill('SIGINT');
        process.exit(0);
    });
    
    testProcess.on('close', (code) => {
        console.log(`🏁 Development server stopped with code ${code}`);
        process.exit(code || 0);
    });
    
    testProcess.on('error', (error) => {
        console.error('❌ Error starting development server:', error);
        process.exit(1);
    });
}

startDevServer().catch((error) => {
    console.error('❌ Development server failed:', error);
    process.exit(1);
});
