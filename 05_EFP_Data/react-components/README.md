# EFP Data - React Components

A React implementation using modern hooks and components for integrating Ethereum Follow Protocol (EFP) data into your SIWE application.

## Features

- **React Hooks**: Modern React patterns with useState and useEffect
- **Component Architecture**: Modular, reusable components
- **EFP Integration**: Complete social graph data display
- **ENS Support**: Automatic ENS name resolution and metadata
- **Responsive Design**: Mobile-first responsive layout
- **Error Handling**: Comprehensive error states and loading indicators

## Components

### `App.js`
Main application component handling authentication and state management.

### `AuthButtons.js`
Reusable authentication button component with loading states.

### `ENSProfile.js`
Displays ENS profile information including avatar and metadata.

### `EFPProfile.js`
Shows EFP social graph data including follower/following counts and recent connections.

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

## Dependencies

- **React 18**: Latest React with concurrent features
- **ethers.js**: Ethereum provider and utilities
- **siwe**: Sign-in with Ethereum library
- **@ethereum-identity-kit/core**: EFP React hooks and components

## Usage Patterns

### Basic EFP Integration
```jsx
import EFPProfile from './components/EFPProfile';

function MyApp() {
  return (
    <EFPProfile address="0x..." />
  );
}
```

### With ENS Support
```jsx
import { ENSProfile, EFPProfile } from './components';

function ProfileView({ address, provider }) {
  return (
    <div>
      <ENSProfile address={address} provider={provider} />
      <EFPProfile address={address} />
    </div>
  );
}
```

## Customization

### Styling
Modify `src/styles.css` to customize the appearance. The CSS uses CSS custom properties for easy theming.

### API Endpoints
The EFP API calls in `EFPProfile.js` can be customized to show different data or use different endpoints.

### Component Props
Each component accepts props for customization:

- `EFPProfile`: `address`, `limit` (for connection count)
- `ENSProfile`: `address`, `ensName`, `provider`
- `AuthButtons`: `onConnect`, `onSignIn`, `onGetInfo`, `loading`

## Build for Production

```bash
yarn build
```

This creates a `dist/` folder with optimized production files.

## Advanced Features

### Custom Hooks
Create custom hooks for EFP data:

```jsx
function useEFPProfile(address) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Implementation...
  
  return { data, loading };
}
```

### Error Boundaries
Add React Error Boundaries for better error handling in production.

### State Management
For larger applications, consider integrating with Redux or Zustand for global state management.
