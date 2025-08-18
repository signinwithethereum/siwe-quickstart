import React, { useState, useEffect } from 'react';

function ENSProfile({ address, ensName, provider }) {
  const [ensData, setEnsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (ensName && provider) {
      loadENSData();
    }
  }, [ensName, provider]);

  const loadENSData = async () => {
    setLoading(true);
    try {
      const resolver = await provider.getResolver(ensName);
      const avatar = await provider.getAvatar(ensName);
      
      const keys = ['email', 'url', 'description', 'com.twitter'];
      const data = { name: ensName };
      
      for (const key of keys) {
        try {
          data[key] = await resolver.getText(key);
        } catch (error) {
          data[key] = '';
        }
      }
      
      setEnsData(data);
      setAvatar(avatar);
    } catch (error) {
      console.error('Error loading ENS data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!ensName) {
    return (
      <div className="ens-section">
        <div className="no-data">
          No ENS Profile Found for {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </div>
      </div>
    );
  }

  return (
    <div className="ens-section">
      <h3>ENS Profile</h3>
      {loading ? (
        <div className="loader">Loading ENS data...</div>
      ) : (
        <div className="ens-content">
          <div className="ens-header">
            {avatar && <img src={avatar} alt="ENS Avatar" className="ens-avatar" />}
            <h4>{ensName}</h4>
          </div>
          
          <div className="ens-data">
            {Object.entries(ensData).map(([key, value]) => (
              <div key={key} className="ens-item">
                <span className="ens-key">{key}:</span>
                <span className="ens-value">{value || 'Not set'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ENSProfile;