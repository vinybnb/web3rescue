// Minimal ERC20 ABI for approval operations
export const ERC20_ABI = [
  // Read functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',

  // Write functions
  'function approve(address spender, uint256 amount) returns (bool)',

  // Events
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

// BSC Network Configuration
export const BSC_MAINNET = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/bsc/0e789f5160ba8bb76d21b4734329cdf7b49801937aa080bd8a8b3454c22ff63c'] },
    public: { http: ['https://rpc.ankr.com/bsc/0e789f5160ba8bb76d21b4734329cdf7b49801937aa080bd8a8b3454c22ff63c'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
};

// Common DEX routers and protocols to check for approvals
export const KNOWN_SPENDERS = {
  // PancakeSwap
  '0x10ED43C718714eb63d5aA57B78B54704E256024E': 'PancakeSwap Router V2',
  '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4': 'PancakeSwap Router V3',
  '0x1b81D678ffb9C0263b24A97847620C99d213eB14': 'PancakeSwap MasterChef',
  '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652': 'PancakeSwap MasterChef V2',

  // Biswap
  '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8': 'Biswap Router',

  // ApeSwap
  '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7': 'ApeSwap Router',

  // BakerySwap
  '0xCDe540d7eAFE93aC5fE6233Bee57E1270D3E330F': 'BakerySwap Router',

  // 1inch
  '0x1111111254EEB25477B68fb85Ed929f73A960582': '1inch V5 Router',

  // Venus Protocol
  '0xfD36E2c2a6789Db23113685031d7F16329158384': 'Venus Comptroller',

  // Alpaca Finance
  '0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F': 'Alpaca Finance',

  // Other contracts
  '0xa5c321806c0b4207cf0b7cf24722e100ab8c3ce8': 'Unknown Contract',
  '0xc6f10cB27358d84643A678f24fB6e6A5e694b72C': 'Unknown Contract',
};

// Common BSC tokens to check
export const COMMON_TOKENS = {
  // Stablecoins
  '0x55d398326f99059fF775485246999027B3197955': 'USDT',
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56': 'BUSD',
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d': 'USDC',
  '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3': 'DAI',

  // Major tokens
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': 'ETH',
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c': 'BTCB',
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82': 'CAKE',
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': 'WBNB',

  // DeFi tokens
  '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47': 'ADA',
  '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE': 'XRP',
  '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD': 'LINK',
  '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94': 'LTC',
};

// BscScan API Configuration
export const BSCSCAN_API = {
  baseUrl: 'https://api.bscscan.com/api',
  endpoints: {
    tokenTx: 'tokentx',
    tokenNftTx: 'tokennfttx',
  }
};
