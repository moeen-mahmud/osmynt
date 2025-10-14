#!/bin/bash

# Osmynt Documentation Local Development Server
# This script helps you run the documentation locally

echo "🚀 Starting Osmynt Documentation Server..."

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

# Install dependencies
echo "📦 Installing dependencies..."
if [ ! -f "Gemfile.lock" ]; then
    echo "🔧 First time setup - installing dependencies..."
    bundle install
else
    echo "📦 Dependencies already installed"
fi

# Check for Ruby 3.0+ compatibility issues
echo "🔍 Checking for Ruby 3.0+ compatibility..."
if bundle list | grep -q "webrick"; then
    echo "✅ webrick gem found - Ruby 3.0+ compatibility ensured"
else
    echo "⚠️  webrick gem not found - this may cause issues with Ruby 3.0+"
fi

# Start Jekyll server
echo "🌐 Starting Jekyll server..."
echo "📍 Documentation will be available at: http://localhost:4001"
echo "🔄 Auto-rebuild is enabled - changes will be reflected automatically"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Start Jekyll server with incremental build (faster than live reload)
bundle exec jekyll serve --incremental --port 4001
