# EFP Data Integration

This example demonstrates how to integrate Ethereum Follow Protocol (EFP) social graph data into your SIWE application.

## Features

- **API Subfolder**: Basic HTML/CSS/JS implementation with direct EFP API calls
- **Component Library Subfolder**: React components using Ethereum Identity Kit (EIK)

## Structure

```
05_EFP_Data/
├── API/                    # Basic implementation with vanilla JS
│   ├── index.html
│   ├── index.js
│   └── styles.css
└── Component_Library/      # React implementation with EIK
    ├── package.json
    ├── src/
    │   ├── App.js
    │   ├── components/
    │   └── index.js
    └── webpack.config.js
```

## Getting Started

### API Implementation
1. Navigate to the `API/` folder
2. Open `index.html` in your browser
3. Connect your wallet and sign in with Ethereum
4. View your EFP social graph data

### Component Library Implementation
1. Navigate to the `Component_Library/` folder
2. Install dependencies: `yarn install`
3. Start the development server: `yarn start`
4. Open http://localhost:8080 in your browser

## Documentation

For more information about EFP integration, visit:
- [EFP Documentation](https://docs.efp.app)
- [EFP API Reference](https://ethidentitykit.com/docs/api)
- [Ethereum Identity Kit](https://ethidentitykit.com)