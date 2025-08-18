// Web3 and SIWE setup
let provider;
let address;
let chain;

const scheme = window.location.protocol.slice(0, -1);
const domain = window.location.host;
const origin = window.location.origin;
const BACKEND_ADDR = "http://localhost:3000";

// DOM Elements
const profileElm = document.getElementById('profile');
const noProfileElm = document.getElementById('noProfile');
const welcomeElm = document.getElementById('welcome');
const ensLoaderElm = document.getElementById('ensLoader');
const ensContainerElm = document.getElementById('ensContainer');
const ensTableElm = document.getElementById('ensTable');

// EFP Elements
const efpProfileElm = document.getElementById('efpProfile');
const noEFPProfileElm = document.getElementById('noEFPProfile');
const efpStatsElm = document.getElementById('efpStats');
const efpConnectionsElm = document.getElementById('efpConnections');
const efpLoaderElm = document.getElementById('efpLoader');

// EFP API Functions
async function getEFPStats(address) {
    try {
        const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${address}/stats`);
        const stats = await response.json();
        return {
            followers: stats.followers_count,
            following: stats.following_count,
        };
    } catch (error) {
        console.error('Error fetching EFP stats:', error);
        return null;
    }
}

async function getUserFollowing(address, limit = 100) {
    try {
        const response = await fetch(
            `https://api.ethfollow.xyz/api/v1/users/${address}/following?limit=${limit}`
        );
        const data = await response.json();
        return data.following.map(follow => ({
            address: follow.address,
            ens: follow.ens,
            avatar: follow.avatar,
            tags: follow.tags || []
        }));
    } catch (error) {
        console.error('Error fetching following list:', error);
        return [];
    }
}

async function getUserFollowers(address, limit = 100) {
    try {
        const response = await fetch(
            `https://api.ethfollow.xyz/api/v1/users/${address}/followers?limit=${limit}`
        );
        const data = await response.json();
        return data.followers.map(follower => ({
            address: follower.address,
            ens: follower.ens,
            avatar: follower.avatar
        }));
    } catch (error) {
        console.error('Error fetching followers list:', error);
        return [];
    }
}

// Display EFP Profile Function
async function displayEFPProfile() {
    try {
        efpLoaderElm.style.display = 'block';
        
        // Get basic EFP stats
        const stats = await getEFPStats(address);
        if (stats && (stats.followers > 0 || stats.following > 0)) {
            efpProfileElm.classList.remove('hidden');
            
            // Display stats
            efpStatsElm.innerHTML = `
                <div class="efp-stats">
                    <div class="stat-item">
                        <span class="stat-number">${stats.followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.following}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
            `;
            
            // Get and display some recent follows
            if (stats.following > 0) {
                const following = await getUserFollowing(address, 5);
                let connectionsHTML = '<h4>Recent Follows:</h4><div class="connections-list">';
                following.forEach(follow => {
                    connectionsHTML += `
                        <div class="connection-item">
                            ${follow.avatar ? `<img src="${follow.avatar}" class="avatar-small" />` : ''}
                            <span class="connection-name">${follow.ens || formatAddress(follow.address)}</span>
                            ${follow.tags.length > 0 ? `<span class="tags">${follow.tags.join(', ')}</span>` : ''}
                        </div>
                    `;
                });
                connectionsHTML += '</div>';
                efpConnectionsElm.innerHTML = connectionsHTML;
            }
            
            document.getElementById('efpContainer').classList.remove('hidden');
        } else {
            noEFPProfileElm.classList.remove('hidden');
        }
        
        efpLoaderElm.style.display = 'none';
    } catch (error) {
        console.error('Error displaying EFP profile:', error);
        noEFPProfileElm.classList.remove('hidden');
        efpLoaderElm.style.display = 'none';
    }
}

function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Ethers.js and SIWE Functions
async function initProvider() {
    if (typeof window.ethereum !== 'undefined') {
        const { BrowserProvider } = await import('https://cdn.skypack.dev/ethers@6.3.0');
        provider = new BrowserProvider(window.ethereum);
        return true;
    }
    return false;
}

async function createSiweMessage(address, statement) {
    const { SiweMessage } = await import('https://cdn.skypack.dev/siwe@3.0.0');
    
    chain = (await provider.getNetwork()).name;
    const res = await fetch(`${BACKEND_ADDR}/nonce`, {
        credentials: 'include',
    });
    const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1',
        nonce: await res.text()
    });
    return message.prepareMessage();
}

function connectWallet() {
    if (!provider) {
        alert('Please install MetaMask or another Web3 wallet');
        return;
    }
    provider.send('eth_requestAccounts', [])
        .catch(() => console.log('user rejected request'));
}

async function displayENSProfile() {
    const ensName = await provider.lookupAddress(address);

    if (ensName) {
        profileElm.classList.remove('hidden');

        welcomeElm.innerHTML = `Hello, ${ensName}`;
        let avatar = await provider.getAvatar(ensName);
        if (avatar) {
            welcomeElm.innerHTML += ` <img class="avatar" src="${avatar}"/>`;
        }

        ensLoaderElm.innerHTML = 'Loading...';
        ensTableElm.innerHTML = '<tr><th>ENS Text Key</th><th>Value</th></tr>';
        const resolver = await provider.getResolver(ensName);

        const keys = ["email", "url", "description", "com.twitter"];
        ensTableElm.innerHTML += `<tr><td>name:</td><td>${ensName}</td></tr>`;
        for (const key of keys) {
            const value = await resolver.getText(key);
            ensTableElm.innerHTML += `<tr><td>${key}:</td><td>${value || 'Not set'}</td></tr>`;
        }
        ensLoaderElm.innerHTML = '';
        ensContainerElm.classList.remove('hidden');
    } else {
        welcomeElm.innerHTML = `Hello, ${formatAddress(address)}`;
        noProfileElm.classList.remove('hidden');
    }

    welcomeElm.classList.remove('hidden');
}

async function signInWithEthereum() {
    if (!provider) {
        await initProvider();
    }
    
    const signer = await provider.getSigner();
    profileElm.classList.add('hidden');
    noProfileElm.classList.add('hidden');
    welcomeElm.classList.add('hidden');
    efpProfileElm.classList.add('hidden');
    noEFPProfileElm.classList.add('hidden');

    address = await signer.getAddress();
    const message = await createSiweMessage(
        address,
        'Sign in with Ethereum to the app.'
    );
    const signature = await signer.signMessage(message);

    const res = await fetch(`${BACKEND_ADDR}/verify`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
        credentials: 'include'
    });

    if (!res.ok) {
        console.error(`Failed in sign in: ${res.statusText}`);
        return;
    }
    console.log(await res.text());

    await displayENSProfile();
    await displayEFPProfile();
}

async function getInformation() {
    const res = await fetch(`${BACKEND_ADDR}/personal_information`, {
        credentials: 'include',
    });

    if (!res.ok) {
        console.error(`Failed in getInformation: ${res.statusText}`);
        return;
    }

    let result = await res.text();
    console.log(result);
    address = result.split(" ")[result.split(" ").length - 1];
    await displayENSProfile();
    await displayEFPProfile();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await initProvider();
    
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const siweBtn = document.getElementById('siweBtn');
    const infoBtn = document.getElementById('infoBtn');
    
    connectWalletBtn.onclick = connectWallet;
    siweBtn.onclick = signInWithEthereum;
    infoBtn.onclick = getInformation;
});