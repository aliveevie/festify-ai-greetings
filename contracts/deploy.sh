#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Festify Contract Deployment Script${NC}"
echo "============================================"

# Check if .env file exists in parent directory
if [ -f "../.env" ]; then
    echo -e "${GREEN}✅ Found .env file in root directory${NC}"
    
    # Read and export environment variables more safely
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ $key =~ ^[[:space:]]*# ]] || [[ -z $key ]]; then
            continue
        fi
        
        # Remove any surrounding quotes from value
        value="${value%\"}"
        value="${value#\"}"
        value="${value%\'}"
        value="${value#\'}"
        
        # Export the variable
        export "$key"="$value"
    done < "../.env"
    
else
    echo -e "${RED}❌ .env file not found in root directory${NC}"
    echo "Please create a .env file in the root directory with:"
    echo "PRIVATE_KEY=your_private_key_here"
    echo "RPC_URL=https://hyperion-testnet.metisdevops.link"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ PRIVATE_KEY not found in environment variables${NC}"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo -e "${RED}❌ RPC_URL not found in environment variables${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo "🔗 RPC URL: $RPC_URL"
echo "🔑 Private Key: ${PRIVATE_KEY:0:10}...${PRIVATE_KEY: -4}"

# Build the contracts
echo -e "${YELLOW}📦 Building contracts...${NC}"
forge build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Deploy the contract
echo -e "${YELLOW}🚀 Deploying Festify contract...${NC}"
forge script script/Festify.s.sol:FestifyScript \
    --rpc-url "$RPC_URL" \
    --broadcast \
    -vvvv

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo "============================================"
    
    # Extract contract address from broadcast logs
    if [ -d "broadcast/Festify.s.sol" ]; then
        echo -e "${YELLOW}📋 Deployment Details:${NC}"
        LATEST_RUN=$(ls -t broadcast/Festify.s.sol/*/run-latest.json 2>/dev/null | head -n1)
        if [ -f "$LATEST_RUN" ]; then
            CONTRACT_ADDRESS=$(cat "$LATEST_RUN" | grep -o '"contractAddress":"0x[^"]*"' | cut -d'"' -f4 | head -n1)
            if [ ! -z "$CONTRACT_ADDRESS" ]; then
                echo "🏠 Contract Address: $CONTRACT_ADDRESS"
                echo ""
                echo -e "${YELLOW}📝 Next Steps:${NC}"
                echo "1. Update CONTRACT_ADDRESS in src/components/AIGreetingCreator.tsx"
                echo "2. Replace: const CONTRACT_ADDRESS = \"0xD9BF55E8bC7642AE6931A94ac361559C2F34298e\";"
                echo "3. With: const CONTRACT_ADDRESS = \"$CONTRACT_ADDRESS\";"
                echo ""
                echo -e "${GREEN}🔍 View on Explorer:${NC}"
                echo "https://hyperion-testnet-explorer.metisdevops.link/address/$CONTRACT_ADDRESS"
            fi
        fi
    fi
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi 