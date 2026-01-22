#!/bin/bash

# Vercel Deployment Setup Script for Grader Builder

echo "🚀 Grader Builder - Vercel Deployment Setup"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the app-grader-builder directory."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Check if Vercel CLI is installed
echo "🔍 Checking for Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Would you like to install it? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "📥 Installing Vercel CLI globally..."
        npm install -g vercel
        echo "✅ Vercel CLI installed"
    else
        echo "ℹ️  You can install it later with: npm install -g vercel"
    fi
else
    echo "✅ Vercel CLI is already installed"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Option 1: Deploy via Vercel Dashboard (Recommended)"
echo "  1. Push your code to GitHub"
echo "  2. Go to https://vercel.com"
echo "  3. Click 'Add New' → 'Project'"
echo "  4. Import your GitHub repository"
echo "  5. Deploy!"
echo ""
echo "Option 2: Deploy via Vercel CLI"
echo "  1. Run: vercel login"
echo "  2. Run: vercel"
echo "  3. Follow the prompts"
echo "  4. Run: vercel --prod (for production)"
echo ""
echo "📖 For detailed instructions, see: VERCEL_DEPLOYMENT.md"
echo ""
