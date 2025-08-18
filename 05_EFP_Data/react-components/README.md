# EFP Data React Components with ethereum-identity-kit

This directory contains a React application that uses the ethereum-identity-kit library to display Ethereum profiles and social data.

## Features

- Connect wallet functionality using Wagmi
- Display comprehensive Ethereum profiles using ProfileCard component
- Individual components: Avatar, ProfileStats, ProfileSocials
- Follow/unfollow functionality with FollowButton
- Transaction handling with TransactionProvider and TransactionModal
- Search for any ENS name or Ethereum address

## Installation

```bash
npm install
```

## Configuration

1. Update the WalletConnect project ID in `src/App.js`:
```javascript
walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' })
```

## Running the Application

```bash
npm start
```

The app will run on http://localhost:3000

## Components Used from ethereum-identity-kit

- **ProfileCard**: Main component displaying comprehensive profile information
- **FollowButton**: Manages follow/unfollow interactions
- **Avatar**: Displays user avatar
- **ProfileStats**: Shows follower/following statistics
- **ProfileSocials**: Displays social links
- **TransactionProvider**: Handles transaction state management
- **TransactionModal**: Shows transaction status and confirmations

## Project Structure

```
src/
├── App.js              # Main app with providers setup
├── App.css             # Application styles
├── index.js            # React entry point
├── index.css           # Global styles
└── components/
    ├── ProfileViewer.js # Main profile viewing component
    ├── ENSProfile.js   # Legacy ENS profile component (kept for reference)
    └── EFPProfile.js   # Legacy EFP profile component (kept for reference)
```

## Usage

The application is ready to use out of the box. Simply:

1. Connect your wallet using MetaMask or WalletConnect
2. View your own profile or search for others using ENS names or addresses
3. Follow/unfollow users directly from their profiles
4. All transactions are handled seamlessly with the TransactionModal

## Customization

The ethereum-identity-kit library provides extensive customization options through CSS variables and component props. Refer to the [official documentation](https://ethidentitykit.com) for detailed customization guides.
