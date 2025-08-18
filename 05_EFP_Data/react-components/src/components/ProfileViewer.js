import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import {
	ProfileCard,
	FollowButton,
	TransactionModal,
	Avatar,
	ProfileStats,
	ProfileSocials,
	fetchAccount,
} from 'ethereum-identity-kit'
import { useQuery } from '@tanstack/react-query'

function ProfileViewer() {
	const { address, isConnected } = useAccount()
	const { connect, connectors, error: connectError } = useConnect()
	const { disconnect } = useDisconnect()
	const [searchAddress, setSearchAddress] = useState('')
	const [viewAddress, setViewAddress] = useState('')
	const [connectionError, setConnectionError] = useState('')

	const handleSearch = e => {
		e.preventDefault()
		if (searchAddress) {
			setViewAddress(searchAddress)
		}
	}

	const handleViewProfile = addressOrEns => {
		setViewAddress(addressOrEns)
		setSearchAddress(addressOrEns)
	}

	const { data: ensData } = useQuery({
		queryKey: ['ensData', viewAddress],
		queryFn: async () => await fetchAccount(viewAddress),
	})

	return (
		<div className='profile-viewer'>
			{/* Connection Status */}
			<div className='connection-section'>
				{!isConnected ? (
					<div className='connect-buttons'>
						<h3>Connect your wallet</h3>
						{connectors.map(connector => (
							<button
								key={connector.id}
								onClick={() => {
									setConnectionError('')
									try {
										connect({ connector })
									} catch (error) {
										setConnectionError('Connection failed. Please try again.')
									}
								}}
								className='btn btn-primary'
							>
								Connect with {connector.name}
							</button>
						))}
						{(connectError || connectionError) && (
							<div className='error-message'>
								{connectError?.message || connectionError || 'Connection failed'}
							</div>
						)}
					</div>
				) : (
					<div className='connected-info'>
						<p>Connected as: {address}</p>
						<button
							onClick={() => disconnect()}
							className='btn btn-secondary'
						>
							Disconnect
						</button>
						<button
							onClick={() => handleViewProfile(address)}
							className='btn btn-primary'
						>
							View My Profile
						</button>
					</div>
				)}
			</div>

			{/* Search Section */}
			<div className='search-section'>
				<h3>Search for a profile</h3>
				<form onSubmit={handleSearch}>
					<input
						type='text'
						value={searchAddress}
						onChange={e => setSearchAddress(e.target.value)}
						placeholder='ENS or address'
						className='search-input'
					/>
					<button type='submit' className='btn btn-primary'>
						Search
					</button>
				</form>
			</div>

			{/* Profile Display Section */}
			{viewAddress && (
				<div className='profile-display'>
					<h2>Profile Details</h2>

					{/* Main ProfileCard component */}
					<div className='profile-card-container'>
						<ProfileCard addressOrName={viewAddress} />
					</div>

					{/* Individual Components Section */}
					<div className='individual-components'>
						<h3>Individual Components</h3>

						{/* Avatar Component */}
						<div className='component-section'>
							<h4>Avatar</h4>
							<Avatar
								address={viewAddress}
								name={ensData?.ens.name}
								src={ensData?.ens.avatar}
								key={ensData?.ens.avatar}
								style={{ width: '100px', height: '100px' }}
							/>
						</div>

						{/* ProfileStats Component */}
						<div className='component-section'>
							<h4>Profile Stats</h4>
							<ProfileStats addressOrName={viewAddress} />
						</div>

						{/* ProfileSocials Component */}
						<div className='component-section'>
							<h4>Profile Socials</h4>
							<ProfileSocials addressOrName={viewAddress} />
						</div>

						{/* Follow Button (only show if user is connected and viewing someone else) */}
						{isConnected &&
							address &&
							viewAddress.toLowerCase() !==
								address.toLowerCase() && (
								<div className='component-section'>
									<h4>Follow Action</h4>
									{ensData && ensData.address && (
										<FollowButton
											lookupAddress={ensData.address}
											connectedAddress={address}
										/>
									)}
								</div>
							)}
					</div>
				</div>
			)}

			{/* Transaction Modal - automatically handles transaction states */}
			<TransactionModal />

			{/* Example profiles to explore */}
			<div className='example-profiles'>
				<h3>Try these profiles:</h3>
				<div className='example-list'>
					<button
						onClick={() => handleViewProfile('vitalik.eth')}
						className='example-btn'
					>
						vitalik.eth
					</button>
					<button
						onClick={() => handleViewProfile('hayden.eth')}
						className='example-btn'
					>
						hayden.eth
					</button>
					<button
						onClick={() => handleViewProfile('sassal.eth')}
						className='example-btn'
					>
						sassal.eth
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProfileViewer
