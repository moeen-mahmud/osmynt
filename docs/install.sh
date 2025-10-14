#!/bin/bash

# Osmynt Documentation Installation Script
# This script helps you install dependencies for the documentation

echo "🚀 Installing Osmynt Documentation Dependencies..."

# Check if we're in the docs directory
if [ ! -f "Gemfile" ]; then
    echo "❌ Error: Please run this script from the docs directory"
    exit 1
fi

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "❌ Error: Ruby is not installed. Please install Ruby 3.1 or later"
    exit 1
fi

# Check if Bundler is installed
if ! command -v bundle &> /dev/null; then
    echo "❌ Error: Bundler is not installed. Please install Bundler: gem install bundler"
    exit 1
fi

# Clean up any existing lock file
echo "🧹 Cleaning up existing lock file..."
rm -f Gemfile.lock

# Install dependencies
echo "📦 Installing dependencies..."
bundle install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo "🚀 You can now run: ./serve.sh"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
