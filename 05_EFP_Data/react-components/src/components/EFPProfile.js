import React, { useState, useEffect } from 'react';

function EFPProfile({ address }) {
  const [efpData, setEfpData] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address) {
      loadEFPData();
    }
  }, [address]);

  const loadEFPData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get basic EFP stats
      const statsResponse = await fetch(`https://api.ethfollow.xyz/api/v1/users/${address}/stats`);
      const stats = await statsResponse.json();
      
      const efpStats = {
        followers: stats.followers_count,
        following: stats.following_count,
      };
      
      setEfpData(efpStats);
      
      // Get following list if user follows anyone
      if (efpStats.following > 0) {
        const followingResponse = await fetch(
          `https://api.ethfollow.xyz/api/v1/users/${address}/following?limit=5`
        );
        const followingData = await followingResponse.json();
        
        const followingList = followingData.following.map(follow => ({
          address: follow.address,
          ens: follow.ens,
          avatar: follow.avatar,
          tags: follow.tags || []
        }));
        
        setFollowing(followingList);
      }
    } catch (error) {
      console.error('Error loading EFP data:', error);
      setError('Failed to load EFP data');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="efp-section">
        <h3>EFP Social Graph</h3>
        <div className="loader">Loading EFP data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="efp-section">
        <h3>EFP Social Graph</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!efpData || (efpData.followers === 0 && efpData.following === 0)) {
    return (
      <div className="efp-section">
        <h3>EFP Social Graph</h3>
        <div className="no-data">No EFP Profile detected.</div>
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

      {following.length > 0 && (
        <div className="efp-connections">
          <h4>Recent Follows:</h4>
          <div className="connections-list">
            {following.map((follow, index) => (
              <div key={index} className="connection-item">
                {follow.avatar && (
                  <img 
                    src={follow.avatar} 
                    alt={follow.ens || follow.address}
                    className="avatar-small" 
                  />
                )}
                <span className="connection-name">
                  {follow.ens || formatAddress(follow.address)}
                </span>
                {follow.tags.length > 0 && (
                  <span className="tags">
                    {follow.tags.join(', ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EFPProfile;