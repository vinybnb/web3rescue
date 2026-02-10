/**
 * Format wallet address to shortened version
 * @param {string} address - Full wallet address
 * @returns {string} Formatted address (0x1234...5678)
 */
export function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format allowance amount from wei to human-readable
 * @param {bigint|string} amount - Amount in wei
 * @param {number} decimals - Token decimals
 * @returns {string} Formatted amount
 */
export function formatAllowance(amount, decimals = 18) {
    if (!amount) return '0';

    const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;

    // Check for unlimited approval (common pattern)
    const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    if (amountBigInt >= maxUint256 / BigInt(2)) {
        return 'Unlimited';
    }

    // Convert to decimal
    const divisor = BigInt(10 ** decimals);
    const wholePart = amountBigInt / divisor;
    const fractionalPart = amountBigInt % divisor;

    if (fractionalPart === BigInt(0)) {
        return wholePart.toString();
    }

    // Format with up to 4 decimal places
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, '');

    if (trimmedFractional === '') {
        return wholePart.toString();
    }

    return `${wholePart}.${trimmedFractional}`;
}

/**
 * Format token amount with symbol
 * @param {bigint|string} amount - Amount in wei
 * @param {number} decimals - Token decimals
 * @param {string} symbol - Token symbol
 * @returns {string} Formatted token amount with symbol
 */
export function formatTokenAmount(amount, decimals, symbol) {
    const formatted = formatAllowance(amount, decimals);
    return `${formatted} ${symbol}`;
}

/**
 * Format transaction hash
 * @param {string} hash - Transaction hash
 * @returns {string} Shortened hash
 */
export function formatTxHash(hash) {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
