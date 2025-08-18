# EFP Data - React Components

A React implementation for integrating Ethereum Follow Protocol (EFP) data into your SIWE application using modern React patterns and the Ethereum Identity Kit.

## Features

- React hooks for EFP data fetching
- Reusable components for ENS and EFP profiles
- Modern React patterns with functional components
- Responsive design with CSS Grid and Flexbox
- Error handling and loading states
- Integration with Ethereum Identity Kit (optional)

## Components

### Core Components
- `App.js` - Main application component with SIWE authentication
- `AuthButtons.js` - Authentication button group
- `ENSProfile.js` - ENS profile display component
- `EFPProfile.js` - EFP social graph component

### Styling
- `styles.css` - Complete CSS styling for all components
- Responsive design with mobile-first approach
- Modern glassmorphism effects and animations

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn start
   ```

3. Ensure your SIWE backend is running on localhost:3000

4. Open http://localhost:8081 in your browser

## Usage

### Basic Integration

```jsx
import EFPProfile from './components/EFPProfile';

function MyApp() {
  const [userAddress, setUserAddress] = useState(null);
  
  return (
    <div>
      {userAddress && <EFPProfile address={userAddress} />}
    </div>
  );
}
```

### With Ethereum Identity Kit

```jsx
import { useEFPProfile } from '@ethereum-identity-kit/core';

function EFPComponent({ address }) {
  const { data: efpData, loading, error } = useEFPProfile(address);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <div>Followers: {efpData.followers}</div>
      <div>Following: {efpData.following}</div>
    </div>
  );
}
```

## API Integration

The components use the following EFP API endpoints:

- `GET /api/v1/users/{address}/stats` - Get follower/following counts
- `GET /api/v1/users/{address}/following` - Get following list
- `GET /api/v1/users/{address}/followers` - Get followers list

## Customization

### Styling
Modify `styles.css` to customize the appearance:
- Color schemes in CSS variables
- Component-specific styling
- Responsive breakpoints

### Components
Extend components with additional features:
- Add more EFP endpoints
- Implement search and filtering
- Add user interaction features

### Configuration
Update the following constants in `App.js`:
- `BACKEND_ADDR` - Your SIWE backend URL
- API limits and pagination
- Error handling strategies

## Dependencies

- React 18.2+
- ethers.js 6.3+
- siwe 3.0+
- @ethereum-identity-kit/core (optional)

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Performance

- Components use React.memo for optimal re-rendering
- API calls are debounced and cached
- Images are lazy-loaded
- CSS animations use GPU acceleration
