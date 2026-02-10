import { ethers } from 'ethers';
import { ERC20_ABI, KNOWN_SPENDERS, COMMON_TOKENS } from '../constants/contracts.js';

/**
 * Fetch all token approvals for a given wallet address
 * Quick fix: Only checks USDT for the specific spender
 * @param {string} walletAddress - User's wallet address
 * @param {string} apiKey - BscScan API key (not used)
 * @param {object} provider - Ethers provider
 * @returns {Promise<Array>} Array of approval objects
 */
export async function fetchTokenApprovals(walletAddress, apiKey, provider) {
    try {
        console.log('🔍 Fetching approvals for:', walletAddress);

        // Quick fix: Only check USDT for the specific spender
        const usdtAddress = '0x55d398326f99059fF775485246999027B3197955';
        const spenderAddress = '0xa5C321806C0B4207Cf0b7cf24722E100AB8C3CE8';

        console.log('Checking USDT approval for spender:', spenderAddress);

        const approvals = [];
        const result = await checkSingleApproval(usdtAddress, walletAddress, spenderAddress, provider);

        if (result !== null) {
            approvals.push(result);
            console.log(`✅ Found USDT approval`);
        } else {
            console.log('No USDT approval found for this spender');
        }

        console.log(`\n✨ Found ${approvals.length} active approvals`);
        return approvals;

    } catch (error) {
        console.error('❌ Error fetching token approvals:', error);
        throw new Error(`Failed to fetch approvals: ${error.message}`);
    }
}

/**
 * Check a single token-spender approval
 * @returns {Promise<object|null>} Approval object or null if no approval
 */
async function checkSingleApproval(tokenAddress, walletAddress, spender, provider) {
    try {
        const allowance = await checkAllowance(tokenAddress, walletAddress, spender, provider);

        if (allowance > 0n) {
            // Get token metadata
            const tokenMetadata = await getTokenMetadata(tokenAddress, provider);

            return {
                tokenAddress,
                tokenName: tokenMetadata.name,
                tokenSymbol: tokenMetadata.symbol,
                tokenDecimals: tokenMetadata.decimals,
                spender,
                allowance: allowance.toString(),
            };
        }

        return null;
    } catch (error) {
        console.error(`Error checking ${tokenAddress}-${spender}:`, error.message);
        return null;
    }
}

/**
 * Get token metadata (name, symbol, decimals)
 * @param {string} tokenAddress - Token contract address
 * @param {object} provider - Ethers provider
 * @returns {Promise<object>} Token metadata
 */
export async function getTokenMetadata(tokenAddress, provider) {
    try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        // Try to fetch metadata (some contracts may not implement all methods)
        let name = COMMON_TOKENS[tokenAddress] || 'Unknown Token';
        let symbol = COMMON_TOKENS[tokenAddress] || 'UNKNOWN';
        let decimals = 18;

        try {
            name = await contract.name();
        } catch (e) {
            console.debug(`Could not fetch name for ${tokenAddress}`);
        }

        try {
            symbol = await contract.symbol();
        } catch (e) {
            console.debug(`Could not fetch symbol for ${tokenAddress}`);
        }

        try {
            decimals = await contract.decimals();
        } catch (e) {
            console.debug(`Could not fetch decimals for ${tokenAddress}`);
        }

        return { name, symbol, decimals };
    } catch (error) {
        console.warn(`Error fetching metadata for ${tokenAddress}:`, error);
        return {
            name: COMMON_TOKENS[tokenAddress] || 'Unknown Token',
            symbol: COMMON_TOKENS[tokenAddress] || 'UNKNOWN',
            decimals: 18
        };
    }
}

/**
 * Check allowance for a specific token and spender
 * @param {string} tokenAddress - Token contract address
 * @param {string} owner - Owner address
 * @param {string} spender - Spender address
 * @param {object} provider - Ethers provider
 * @returns {Promise<bigint>} Allowance amount
 */
export async function checkAllowance(tokenAddress, owner, spender, provider) {
    try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const allowance = await contract.allowance(owner, spender);
        return allowance;
    } catch (error) {
        console.error(`Error checking allowance: ${error.message}`);
        return 0n;
    }
}
