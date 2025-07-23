#!/bin/bash

# Metis Hyperion Testnet Contract Verification Script
echo "🔍 Verifying Festify contract on Metis Hyperion Testnet..."
echo ""
echo "Chain: Metis Hyperion Testnet"
echo "Chain ID: 133717"
echo "Contract Address: 0xD9BF55E8bC7642AE6931A94ac361559C2F34298e"
echo "Block Explorer: https://hyperion-testnet.metisdevops.link/"
echo "Compiler Version: 0.8.28"
echo ""

echo "🚀 Running verification with Sourcify..."
echo ""

# Verify contract using Sourcify verifier
forge verify-contract \
    --chain-id 133717 \
    --compiler-version 0.8.28 \
    --verifier sourcify \
    0xD9BF55E8bC7642AE6931A94ac361559C2F34298e \
    src/Festify.sol:Festify

echo ""
echo "If Sourcify verification didn't work, trying with manual approach..."
echo ""

# Alternative: Try with blockscout again but with different approach
echo "You can also try manual verification by:"
echo "1. Go to: https://hyperion-testnet-explorer.metisdevops.link/address/0xD9BF55E8bC7642AE6931A94ac361559C2F34298e"
echo "2. Click on the 'Contract' tab"
echo "3. Click 'Verify & Publish'"
echo "4. Upload your source code and constructor parameters"

echo ""
echo "✅ Verification command completed!"
echo "Check the block explorer to see if verification was successful:"
echo "https://hyperion-testnet-explorer.metisdevops.link/address/0xD9BF55E8bC7642AE6931A94ac361559C2F34298e" 