# WalletConnect Setup Instructions

WalletConnect has been temporarily disabled to prevent connection errors. To re-enable it:

## 1. Get a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

## 2. Update App.js

In `src/App.js`, replace the commented WalletConnect connector:

```javascript
// Replace this:
connectors: [
  injected()
  // WalletConnect temporarily disabled to avoid connection errors
  // To enable: get a project ID from https://cloud.walletconnect.com
  // walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' })
],

// With this:
connectors: [
  injected(),
  walletConnect({ 
    projectId: 'YOUR_ACTUAL_PROJECT_ID_HERE',
    metadata: {
      name: 'EFP Data Viewer',
      description: 'View Ethereum profiles using ethereum-identity-kit',
      url: 'http://localhost:3000',
      icons: ['https://avatars.githubusercontent.com/u/37784886']
    }
  })
],
```

## 3. Environment Variable (Optional)

For better security, you can also use an environment variable:

1. Add to `.env`:
```
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

2. Update App.js:
```javascript
walletConnect({ 
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
  // ... metadata
})
```

## Current Setup

Currently only MetaMask/Injected wallet connection is enabled, which should work without any issues.