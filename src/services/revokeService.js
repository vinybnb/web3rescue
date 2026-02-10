import { ethers } from 'ethers';
import { ERC20_ABI } from '../constants/contracts.js';

/**
 * Revoke token approval by setting allowance to 0
 * @param {string} tokenAddress - Token contract address
 * @param {string} spender - Spender address to revoke
 * @param {object} signer - Ethers signer (connected wallet)
 * @returns {Promise<object>} Transaction object
 */
export async function revokeApproval(tokenAddress, spender, signer) {
    try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

        // Call approve with amount = 0 to revoke
        const tx = await contract.approve(spender, 0);

        console.log(`Revoke transaction sent: ${tx.hash}`);
        return tx;
    } catch (error) {
        console.error('Error revoking approval:', error);

        // Provide user-friendly error messages
        if (error.code === 'ACTION_REJECTED') {
            throw new Error('Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            throw new Error('Insufficient BNB for gas fees');
        } else {
            throw new Error(`Failed to revoke approval: ${error.message}`);
        }
    }
}

/**
 * Wait for revoke transaction to be confirmed
 * @param {object} transaction - Transaction object from revokeApproval
 * @returns {Promise<object>} Transaction receipt
 */
export async function waitForRevoke(transaction) {
    try {
        console.log('Waiting for transaction confirmation...');
        const receipt = await transaction.wait();

        if (receipt.status === 1) {
            console.log('Transaction confirmed successfully');
        } else {
            console.error('Transaction failed');
        }

        return receipt;
    } catch (error) {
        console.error('Error waiting for transaction:', error);
        throw new Error(`Transaction failed: ${error.message}`);
    }
}
