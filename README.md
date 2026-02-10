# BSC Token Approval Manager 🛡️

A modern Web3 application for viewing and revoking token approvals on BNB Smart Chain (BSC). Protect your wallet from malicious contracts and manage your token permissions with ease.

![BSC Token Approval Manager](https://img.shields.io/badge/BSC-Token%20Approval-F9A825?style=for-the-badge)
![Built with React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![ethers.js](https://img.shields.io/badge/ethers.js-6.0-3C3C3D?style=for-the-badge)

## ✨ Features

- 🔗 **Multi-Wallet Support** - Connect with MetaMask, WalletConnect, Rainbow, and more
- 👁️ **View All Approvals** - See every token approval on your BSC wallet
- 🚫 **One-Click Revoke** - Remove unwanted approvals instantly
- 📊 **Smart Formatting** - Human-readable amounts with unlimited approval detection
- 🎨 **Modern UI** - Beautiful dark theme with gradients and animations
- 🔒 **Secure** - No private keys stored, all transactions require user approval

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- A Web3 wallet (MetaMask recommended)
- BscScan API key ([Get one free here](https://bscscan.com/apis))

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your BscScan API key to .env (optional)
# VITE_BSCSCAN_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running!

## 📖 How to Use

1. **Connect Your Wallet**
   - Click "Connect Wallet" button
   - Select your wallet provider
   - Approve the connection

2. **Enter API Key** (if not in .env)
   - Paste your BscScan API key
   - Click "Fetch Approvals"

3. **Review Your Approvals**
   - Browse all active token approvals
   - Check which contracts have access to your tokens
   - See allowance amounts

4. **Revoke Unwanted Approvals**
   - Click "Revoke Approval" on any card
   - Confirm the transaction in your wallet
   - Wait for confirmation

## 🏗️ Tech Stack

- **Frontend**: React 19 + Vite
- **Web3**: ethers.js v6, wagmi, RainbowKit
- **Styling**: Vanilla CSS with modern design
- **API**: BscScan API for transaction history
- **Network**: BNB Smart Chain (BSC)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ApprovalList.jsx
│   └── ApprovalList.css
├── services/           # Business logic
│   ├── approvalService.js
│   └── revokeService.js
├── utils/              # Helper functions
│   └── formatters.js
├── constants/          # Config & ABIs
│   └── contracts.js
├── App.jsx            # Main component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🔐 Security

- ✅ No private keys are stored or transmitted
- ✅ All transactions require explicit user approval
- ✅ Read-only operations use public RPC endpoints
- ✅ Open source - verify the code yourself

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 🌐 Deployment

This app can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package

**Important**: Before deploying, get a WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com) and update it in `src/main.jsx`.

## 📝 Configuration

### Adding Known Spenders

Edit `src/constants/contracts.js`:

```javascript
export const KNOWN_SPENDERS = {
  '0x10ED43C718714eb63d5aA57B78B54704E256024E': 'PancakeSwap Router',
  // Add more here
};
```

### Customizing Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary-color: #F9A825;
  --secondary-color: #3B82F6;
  /* Customize here */
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [BscScan](https://bscscan.com) for the API
- [RainbowKit](https://rainbowkit.com) for wallet connection UI
- [ethers.js](https://docs.ethers.org) for blockchain interactions

## ⚠️ Disclaimer

This tool is provided as-is. Always verify transactions before approving them in your wallet. The developers are not responsible for any loss of funds.

---

**Built with ❤️ for the Web3 community**
