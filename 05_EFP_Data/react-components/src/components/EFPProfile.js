import React, { useState, useEffect } from 'react';

function EFPProfile({ address }) {
  const [efpData, setEfpData] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (address) {
      loadEFPData();
    }
  }, [address]);

  const getEFPStats = async (address) => {
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
  };

  const getUserFollowing = async (address, limit = 10) => {
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
  };

  const getUserFollowers = async (address, limit = 10) => {
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
  };

  const loadEFPData = async () => {
    setLoading(true);
    try {
      const stats = await getEFPStats(address);
      if (stats && (stats.followers > 0 || stats.following > 0)) {
        setEfpData(stats);
        
        if (stats.following > 0) {
          const followingList = await getUserFollowing(address, 5);
          setFollowing(followingList);
        }
        
        if (stats.followers > 0) {
          const followersList = await getUserFollowers(address, 5);
          setFollowers(followersList);
        }
      }
    } catch (error) {
      console.error('Error loading EFP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="efp-section">
        <h3>EFP Social Graph</h3>
        <div className="loader">Loading EFP data...</div>
      </div>
    );
  }

  if (!efpData || (efpData.followers === 0 && efpData.following === 0)) {
    return (
      <div className="efp-section">
        <h3>EFP Social Graph</h3>
        <div className="no-data">
          No EFP Profile detected for this address.
        </div>
      </div>
    );
  }

  return (
    <div className="efp-section">
      <h3>EFP Social Graph</h3>
      
      <div className="efp-stats">
        <div className="stat-item">
          <span className="stat-number">{efpData.followers}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{efpData.following}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <div className="efp-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
          disabled={following.length === 0}
        >
          Following ({following.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
          disabled={followers.length === 0}
        >
          Followers ({followers.length})
        </button>
      </div>

      <div className="efp-content">
        {activeTab === 'stats' && (
          <div className="stats-content">
            <p>This address has an active EFP social graph with {efpData.followers} followers and {efpData.following} following.</p>
          </div>
        )}
        
        {activeTab === 'following' && (
          <div className="connections-list">
            <h4>Recent Follows:</h4>
            {following.map((follow, index) => (
              <div key={index} className="connection-item">
                {follow.avatar && (
                  <img src={follow.avatar} alt="Avatar" className="avatar-small" />
                )}
                <span className="connection-name">
                  {follow.ens || formatAddress(follow.address)}
                </span>
                {follow.tags.length > 0 && (
                  <span className="tags">{follow.tags.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'followers' && (
          <div className="connections-list">
            <h4>Recent Followers:</h4>
            {followers.map((follower, index) => (
              <div key={index} className="connection-item">
                {follower.avatar && (
                  <img src={follower.avatar} alt="Avatar" className="avatar-small" />
                )}
                <span className="connection-name">
                  {follower.ens || formatAddress(follower.address)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EFPProfile;