# EFP Data - API Implementation

A vanilla JavaScript implementation for integrating Ethereum Follow Protocol (EFP) data into your SIWE application.

## Features

- Basic EFP profile statistics (followers/following counts)
- Display recent follows with ENS names and avatars
- Tag system integration
- Clean, responsive UI
- No additional dependencies beyond ethers.js and siwe

## Files

- `index.html` - Main HTML structure with EFP sections
- `styles.css` - Complete styling for EFP components
- `script.js` - JavaScript logic for EFP API integration

## Setup

1. Start a local web server in this directory
2. Ensure your SIWE backend is running on localhost:3000
3. Open index.html in your browser
4. Connect wallet and sign in with Ethereum
5. View your EFP social graph data

## API Endpoints Used

- `https://api.ethfollow.xyz/api/v1/users/{address}/stats` - Get follower/following counts
- `https://api.ethfollow.xyz/api/v1/users/{address}/following` - Get following list
- `https://api.ethfollow.xyz/api/v1/users/{address}/followers` - Get followers list

## Customization

Modify the following variables in `script.js` to customize behavior:

- `limit` in API calls to show more/fewer connections
- CSS classes in `styles.css` for custom styling
- Add additional EFP endpoints for more features

## Error Handling

The implementation includes comprehensive error handling for:
- Network connectivity issues
- Invalid addresses
- Empty social graph data
- API rate limiting
