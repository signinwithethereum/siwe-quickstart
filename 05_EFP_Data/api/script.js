// Current profile data
let currentAddressOrName = null

// DOM Elements
const profileElm = document.getElementById('profile')
const noProfileElm = document.getElementById('noProfile')
const welcomeElm = document.getElementById('welcome')
const ensLoaderElm = document.getElementById('ensLoader')
const ensContainerElm = document.getElementById('ensContainer')
const ensTableElm = document.getElementById('ensTable')
const addressInput = document.getElementById('addressInput')
const searchBtn = document.getElementById('searchBtn')

// EFP Elements
const efpProfileElm = document.getElementById('efpProfile')
const noEFPProfileElm = document.getElementById('noEFPProfile')
const efpStatsElm = document.getElementById('efpStats')
const efpConnectionsElm = document.getElementById('efpConnections')
const efpLoaderElm = document.getElementById('efpLoader')

// EFP API Functions
async function getEFPStats(addressOrName) {
	try {
		const response = await fetch(
			`https://api.ethfollow.xyz/api/v1/users/${addressOrName}/stats`
		)
		const stats = await response.json()
		return {
			followers: stats.followers_count,
			following: stats.following_count,
		}
	} catch (error) {
		console.error('Error fetching EFP stats:', error)
		return null
	}
}

async function getUserFollowing(addressOrName, limit = 100) {
	try {
		const response = await fetch(
			`https://api.ethfollow.xyz/api/v1/users/${addressOrName}/following?limit=${limit}`
		)
		const data = await response.json()
		return data.following.map(follow => ({
			address: follow.address,
			ens: follow.ens,
			avatar: follow.avatar,
			tags: follow.tags || [],
		}))
	} catch (error) {
		console.error('Error fetching following list:', error)
		return []
	}
}

async function getUserFollowers(addressOrName, limit = 100) {
	try {
		const response = await fetch(
			`https://api.ethfollow.xyz/api/v1/users/${addressOrName}/followers?limit=${limit}`
		)
		const data = await response.json()
		return data.followers.map(follower => ({
			address: follower.address,
			ens: follower.ens,
			avatar: follower.avatar,
		}))
	} catch (error) {
		console.error('Error fetching followers list:', error)
		return []
	}
}

// Display EFP Profile Function
async function displayEFPProfile(addressOrName) {
	try {
		efpLoaderElm.style.display = 'block'

		// Get basic EFP stats
		const stats = await getEFPStats(addressOrName)
		if (stats && (stats.followers > 0 || stats.following > 0)) {
			efpProfileElm.classList.remove('hidden')

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
            `

			// Get and display some recent follows
			if (stats.following > 0) {
				const following = await getUserFollowing(addressOrName, 5)
				let connectionsHTML =
					'<h4>Recent Follows:</h4><div class="connections-list">'
				following.forEach(follow => {
					connectionsHTML += `
                        <div class="connection-item">
                            ${
								follow.avatar
									? `<img src="${follow.avatar}" class="avatar-small" />`
									: ''
							}
                            <span class="connection-name">${
								follow.ens || formatAddress(follow.address)
							}</span>
                            ${
								follow.tags.length > 0
									? `<span class="tags">${follow.tags.join(
											', '
									  )}</span>`
									: ''
							}
                        </div>
                    `
				})
				connectionsHTML += '</div>'
				efpConnectionsElm.innerHTML = connectionsHTML
			}

			document.getElementById('efpContainer').classList.remove('hidden')
		} else {
			noEFPProfileElm.classList.remove('hidden')
		}

		efpLoaderElm.style.display = 'none'
	} catch (error) {
		console.error('Error displaying EFP profile:', error)
		noEFPProfileElm.classList.remove('hidden')
		efpLoaderElm.style.display = 'none'
	}
}

function formatAddress(address) {
	return `${address.substring(0, 6)}...${address.substring(
		address.length - 4
	)}`
}

// EFP Account API Function
async function getAccountInfo(addressOrName) {
	try {
		const response = await fetch(
			`https://api.ethfollow.xyz/api/v1/users/${addressOrName}/account`
		)
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`)
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching account info:', error)
		return null
	}
}

async function displayENSProfile(addressOrName) {
	// Clear previous results
	profileElm.classList.add('hidden')
	noProfileElm.classList.add('hidden')
	ensContainerElm.classList.add('hidden')

	try {
		ensLoaderElm.innerHTML = 'Loading account data...'

		// Get account info from EFP API
		const accountData = await getAccountInfo(addressOrName)

		if (accountData && accountData.ens && accountData.ens.name) {
			profileElm.classList.remove('hidden')

			const ensName = accountData.ens.name
			const address = accountData.address

			welcomeElm.innerHTML = `Profile: ${ensName}`

			// Add avatar if available
			if (accountData.ens.avatar) {
				welcomeElm.innerHTML += ` <img class="avatar" src="${accountData.ens.avatar}"/>`
			}

			ensTableElm.innerHTML = '<tr><th>Record</th><th>Value</th></tr>'
			ensTableElm.innerHTML += `<tr><td>ENS Name:</td><td>${ensName}</td></tr>`
			ensTableElm.innerHTML += `<tr><td>Address:</td><td>${address}</td></tr>`

			// Add ENS records if available
			if (accountData.ens.records) {
				const records = accountData.ens.records

				// Common ENS text records
				const recordKeys = {
					description: 'Description',
					email: 'Email',
					url: 'Website',
					'com.twitter': 'Twitter',
					'com.discord': 'Discord',
					'com.github': 'GitHub',
				}

				for (const [key, label] of Object.entries(recordKeys)) {
					if (records[key]) {
						let value = records[key]
						// Format social media handles
						if (key === 'com.twitter' && !value.startsWith('@')) {
							value = `@${value}`
						}
						ensTableElm.innerHTML += `<tr><td>${label}:</td><td>${value}</td></tr>`
					}
				}
			}

			ensLoaderElm.innerHTML = ''
			ensContainerElm.classList.remove('hidden')
		} else {
			// No ENS data available, show address only
			welcomeElm.innerHTML = `Profile: ${formatAddress(addressOrName)}`
			noProfileElm.classList.remove('hidden')
		}

		welcomeElm.classList.remove('hidden')
	} catch (error) {
		console.error('Error displaying profile:', error)
		welcomeElm.innerHTML = `Profile: ${addressOrName}`
		welcomeElm.classList.remove('hidden')
		noProfileElm.classList.remove('hidden')
		ensLoaderElm.innerHTML = ''
	}
}

async function searchProfile() {
	const addressOrName = addressInput.value.trim()

	if (!addressOrName) {
		alert('Please enter an ENS name or Ethereum address')
		return
	}

	// Basic validation - allow addresses and ENS names
	const isAddress = /^0x[a-fA-F0-9]{40}$/.test(addressOrName)
	const isENS = addressOrName.includes('.') && addressOrName.length > 3

	if (!isAddress && !isENS) {
		alert(
			'Please enter a valid ENS name (e.g., vitalik.eth) or Ethereum address (0x...)'
		)
		return
	}

	currentAddressOrName = addressOrName

	// Clear previous results
	efpProfileElm.classList.add('hidden')
	noEFPProfileElm.classList.add('hidden')
	document.getElementById('efpContainer').classList.add('hidden')

	// Load both profile and EFP data using EFP API
	await displayENSProfile(addressOrName)
	await displayEFPProfile(addressOrName)
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
	// Search button click
	searchBtn.addEventListener('click', searchProfile)

	// Enter key in input field
	addressInput.addEventListener('keypress', e => {
		if (e.key === 'Enter') {
			searchProfile()
		}
	})

	// Example buttons
	document.querySelectorAll('.example-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			const address = btn.getAttribute('data-address')
			addressInput.value = address
			searchProfile()
		})
	})
})
