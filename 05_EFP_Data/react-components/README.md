# EFP Data - React Components

A comprehensive React implementation for integrating Ethereum Follow Protocol (EFP) data into your SIWE application using modern React patterns and the Ethereum Identity Kit.

## Features

- Complete EFP profile integration with stats, followers, and following
- ENS profile resolution with avatar support
- Tabbed interface for better user experience
- Responsive design for mobile and desktop
- Error handling and loading states
- Modern React hooks and patterns
- TypeScript-ready (can be easily converted)

## Components

### `App.js`
Main application component that handles:
- Wallet connection and authentication
- SIWE message creation and verification
- State management for user sessions
- ENS name resolution

### `EFPProfile.js`
Comprehensive EFP integration component featuring:
- Social graph statistics display
- Tabbed interface for followers/following
- Connection lists with avatars and tags
- Real-time data fetching from EFP API

### `ENSProfile.js`
ENS profile component that displays:
- ENS name and avatar
- ENS text records (email, url, description, twitter)
- Fallback for addresses without ENS

### `AuthButtons.js`
Reusable authentication button component with:
- Wallet connection
- SIWE authentication
- Session restoration
- Loading states

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd 05_EFP_Data/react-components
   yarn install
   ```

2. **Start Development Server**
   ```bash
   yarn start
   ```
   This will start the development server on `http://localhost:8081`

3. **Backend Requirements**
   Ensure your SIWE backend is running on `http://localhost:3000` with the following endpoints:
   - `GET /nonce` - Generate authentication nonce
   - `POST /verify` - Verify SIWE message
   - `GET /personal_information` - Get session info

## Configuration

### Environment Variables
Create a `.env` file in the react-components directory:
```
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_EFP_API_URL=https://api.ethfollow.xyz/api/v1
```

### Customization Options

**EFP Data Limits:**
Modify the limit parameters in `EFPProfile.js`:
```javascript
const getUserFollowing = async (address, limit = 10) => {
  // Increase limit to show more connections
}
```

**Styling:**
Customize the appearance by modifying `styles.css`:
- Color scheme variables
- Component spacing and layout
- Responsive breakpoints
- Animation timings

## EFP API Integration

The component uses the following EFP API endpoints:

| Endpoint | Purpose |
|----------|----------|
| `/users/{address}/stats` | Get follower/following counts |
| `/users/{address}/following` | Get accounts user follows |
| `/users/{address}/followers` | Get user's followers |

## Advanced Features

### Adding More EFP Functionality
To extend the EFP integration, you can add:

1. **Mutual Connections**
   ```javascript
   const getMutualConnections = async (address1, address2) => {
     // Implementation for finding mutual follows
   }
   ```

2. **Search Functionality**
   ```javascript
   const searchEFPUsers = async (searchTerm) => {
     const response = await fetch(
       `https://api.ethfollow.xyz/api/v1/leaderboard/search?term=${searchTerm}`
     );
     return response.json();
   }
   ```

3. **Leaderboard Integration**
   ```javascript
   const getEFPLeaderboard = async (sort = 'followers', limit = 10) => {
     const response = await fetch(
       `https://api.ethfollow.xyz/api/v1/leaderboard/ranked?sort=${sort}&limit=${limit}`
     );
     return response.json();
   }
   ```

### Using Ethereum Identity Kit

For a more robust integration, consider using the Ethereum Identity Kit:

```javascript
import { useEFPProfile } from '@ethereum-identity-kit/core';

function EFPProfileWithEIK({ address }) {
  const { data: efpData, loading, error } = useEFPProfile(address);
  
  if (loading) return <div>Loading EFP data...</div>;
  if (error) return <div>Error loading social graph</div>;
  
  return (
    <div>
      <h3>Social Graph</h3>
      <div>Followers: {efpData.followers}</div>
      <div>Following: {efpData.following}</div>
    </div>
  );
}
```

## Production Build

To create a production build:

```bash
yarn build
```

This will create an optimized build in the `dist/` directory ready for deployment.

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with Web3 wallet support

## Troubleshooting

**Common Issues:**

1. **CORS Errors**: Ensure your backend has proper CORS configuration
2. **Web3 Not Detected**: User needs MetaMask or compatible wallet
3. **EFP API Rate Limits**: Implement request throttling for production
4. **Missing ENS Data**: Handle cases where ENS records are not set

**Debug Mode:**
Enable detailed logging by setting:
```javascript
console.log('Debug mode enabled');
// Add detailed logging in component methods
```
