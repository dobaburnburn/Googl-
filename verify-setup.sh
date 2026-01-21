#!/bin/bash
# Backend Setup Verification Script

echo "🚀 Backend Setup Verification"
echo "=============================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
node -v || echo "✗ Node.js not installed"
echo ""

# Check pnpm
echo "✓ Checking pnpm..."
pnpm -v || echo "✗ pnpm not installed"
echo ""

# Check environment file
echo "✓ Checking environment configuration..."
if [ -f .env.local ]; then
    echo "✓ .env.local file found"
    echo "  Configured variables:"
    grep -E '^[A-Z_]+=' .env.local | sed 's/=.*/=***/' | sed 's/^/    /'
else
    echo "✗ .env.local file not found"
fi
echo ""

# Check dependencies
echo "✓ Checking node_modules..."
if [ -d node_modules ]; then
    echo "✓ Dependencies installed"
    echo "  Total packages: $(ls -1 node_modules | wc -l)"
else
    echo "✗ Dependencies not installed. Run: pnpm install"
fi
echo ""

# Check key directories
echo "✓ Checking project structure..."
dirs=("app/api" "components" "lib" "scripts" "public")
for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir"
    else
        echo "  ✗ $dir"
    fi
done
echo ""

# Check key files
echo "✓ Checking key files..."
files=("next.config.mjs" "tsconfig.json" "package.json" "postcss.config.mjs")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file"
    fi
done
echo ""

# Check database scripts
echo "✓ Checking database scripts..."
db_scripts=("scripts/001-create-tables.sql" "scripts/002-seed-articles.sql")
for script in "${db_scripts[@]}"; do
    if [ -f "$script" ]; then
        echo "  ✓ $script"
    else
        echo "  ✗ $script"
    fi
done
echo ""

echo "=============================="
echo "Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Fill in .env.local with your credentials"
echo "2. Run: pnpm dev (to start development server)"
echo "3. See BACKEND_SETUP.md for detailed configuration"
