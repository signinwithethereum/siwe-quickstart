// Ethereum and SIWE setup
let provider;
let signer;
let userAddress;
let userChain;

// DOM elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const siweBtn = document.getElementById('siweBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userAddressElm = document.getElementById('userAddress');
const userAvatar = document.getElementById('userAvatar');
const efpProfile = document.getElementById('efpProfile');
const noEFPProfile = document.getElementById('noEFPProfile');
const efpLoader = document.getElementById('efpLoader');
const efpContainer = document.getElementById('efpContainer');
const efpStats = document.getElementById('efpStats');
const efpConnections = document.getElementById('efpConnections');
const errorMessage = document.getElementById('errorMessage');

// Event listeners
connectWalletBtn.addEventListener('click', connectWallet);
siweBtn.addEventListener('click', signInWithEthereum);

// Check if wallet is already connected
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            connectWalletBtn.style.display = 'none';
            siweBtn.classList.remove('hidden');
        }
    } else {
        showError('Please install MetaMask or another Ethereum wallet');
    }
});

// Wallet connection
async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('Please install MetaMask');
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        
        connectWalletBtn.style.display = 'none';
        siweBtn.classList.remove('hidden');
    } catch (error) {
        showError('Failed to connect wallet: ' + error.message);
    }
}

// Sign-In with Ethereum
async function signInWithEthereum() {
    try {
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        userChain = (await provider.getNetwork()).name;
        
        // Create SIWE message
        const domain = window.location.host;
        const origin = window.location.origin;
        const statement = 'Sign in to view your EFP social graph data.';
        
        const message = `${domain} wants you to sign in with your Ethereum account:\n${userAddress}\n\n${statement}\n\nURI: ${origin}\nVersion: 1\nChain ID: 1\nNonce: ${Math.random().toString(36).substring(7)}\nIssued At: ${new Date().toISOString()}`;
        
        // Sign the message
        await signer.signMessage(message);
        
        // Hide SIWE button and show user info
        siweBtn.style.display = 'none';
        await displayUserProfile();
        await displayEFPProfile();
    } catch (error) {
        showError('Failed to sign in: ' + error.message);
    }
}

// Display user profile
async function displayUserProfile() {
    try {
        // Try to get ENS name
        const ensName = await provider.lookupAddress(userAddress);
        
        if (ensName) {
            userName.textContent = ensName;
            
            // Try to get ENS avatar
            try {
                const avatar = await provider.getAvatar(ensName);
                if (avatar) {
                    userAvatar.innerHTML = `<img src="${avatar}" alt="Avatar">`;
                } else {
                    userAvatar.innerHTML = '<div class="placeholder">👤</div>';
                }
            } catch {
                userAvatar.innerHTML = '<div class="placeholder">👤</div>';
            }
        } else {
            userName.textContent = formatAddress(userAddress);
            userAvatar.innerHTML = '<div class="placeholder">👤</div>';
        }
        
        userAddressElm.textContent = userAddress;
        userInfo.classList.remove('hidden');
    } catch (error) {
        console.error('Error displaying user profile:', error);
        userName.textContent = formatAddress(userAddress);
        userAddressElm.textContent = userAddress;
        userAvatar.innerHTML = '<div class="placeholder">👤</div>';
        userInfo.classList.remove('hidden');
    }
}

// EFP API Functions
async function getEFPStats(address) {
    try {
        const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${address}/stats`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stats = await response.json();
        return {
            followers: stats.followers_count || 0,
            following: stats.following_count || 0,
        };
    } catch (error) {
        console.error('Error fetching EFP stats:', error);
        return null;
    }
}

async function getUserFollowing(address, limit = 5) {
    try {
        const response = await fetch(
            `https://api.ethfollow.xyz/api/v1/users/${address}/following?limit=${limit}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.following ? data.following.map(follow => ({
            address: follow.address,
            ens: follow.ens,
            avatar: follow.avatar,
            tags: follow.tags || []
        })) : [];
    } catch (error) {
        console.error('Error fetching following list:', error);
        return [];
    }
}

async function getUserFollowers(address, limit = 5) {
    try {
        const response = await fetch(
            `https://api.ethfollow.xyz/api/v1/users/${address}/followers?limit=${limit}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.followers ? data.followers.map(follower => ({
            address: follower.address,
            ens: follower.ens,
            avatar: follower.avatar
        })) : [];
    } catch (error) {
        console.error('Error fetching followers list:', error);
        return [];
    }
}

// Display EFP Profile
async function displayEFPProfile() {
    try {
        efpProfile.classList.remove('hidden');
        efpLoader.style.display = 'block';
        
        // Get basic EFP stats
        const stats = await getEFPStats(userAddress);
        
        if (stats && (stats.followers > 0 || stats.following > 0)) {
            // Display stats
            efpStats.innerHTML = `
                <div class="stat-item">
                    <span class="stat-number">${stats.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${stats.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            `;
            
            // Get and display recent follows and followers
            let connectionsHTML = '';
            
            if (stats.following > 0) {
                const following = await getUserFollowing(userAddress, 5);
                if (following.length > 0) {
                    connectionsHTML += '<h4>Recent Follows:</h4><div class="connections-list">';
                    following.forEach(follow => {
                        connectionsHTML += `
                            <div class="connection-item">
                                <div class="avatar-small">
                                    ${follow.avatar ? 
                                        `<img src="${follow.avatar}" alt="Avatar">` : 
                                        '<div class="placeholder">👤</div>'
                                    }
                                </div>
                                <span class="connection-name">${follow.ens || formatAddress(follow.address)}</span>
                                ${follow.tags.length > 0 ? 
                                    `<span class="tags">${follow.tags.join(', ')}</span>` : 
                                    ''
                                }
                            </div>
                        `;
                    });
                    connectionsHTML += '</div>';
                }
            }
            
            if (stats.followers > 0) {
                const followers = await getUserFollowers(userAddress, 5);
                if (followers.length > 0) {
                    connectionsHTML += '<h4>Recent Followers:</h4><div class="connections-list">';
                    followers.forEach(follower => {
                        connectionsHTML += `
                            <div class="connection-item">
                                <div class="avatar-small">
                                    ${follower.avatar ? 
                                        `<img src="${follower.avatar}" alt="Avatar">` : 
                                        '<div class="placeholder">👤</div>'
                                    }
                                </div>
                                <span class="connection-name">${follower.ens || formatAddress(follower.address)}</span>
                            </div>
                        `;
                    });
                    connectionsHTML += '</div>';
                }
            }
            
            efpConnections.innerHTML = connectionsHTML;
            efpContainer.classList.remove('hidden');
            
        } else {
            noEFPProfile.classList.remove('hidden');
        }
        
        efpLoader.style.display = 'none';
        
    } catch (error) {
        console.error('Error displaying EFP profile:', error);
        efpLoader.style.display = 'none';
        noEFPProfile.classList.remove('hidden');
    }
}

// Utility functions
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Load ethers.js from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/ethers@6.3.0/dist/ethers.umd.min.js';
script.onload = () => {
    console.log('Ethers.js loaded successfully');
};
document.head.appendChild(script);