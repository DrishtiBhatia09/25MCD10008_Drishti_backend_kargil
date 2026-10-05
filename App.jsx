import { useState, useEffect } from 'react';

export default function App() {
  
  // 1. STATE INITIALIZATION
  const [rawUsers, setRawUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');

  const [stats, setStats] = useState({
    totalCount: 0,
    orgDomainCount: 0,
    otherDomainCount: 0,
  }); 

  // 2. FETCH USERS FROM API

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        setRawUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 3. SEARCH + DOMAIN FILTER

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = rawUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query);

      const matchesDomain =
        domainFilter === 'ALL' ||
        user.website.toLowerCase().endsWith('.org');

      return matchesSearch && matchesDomain;
    });

    setFilteredUsers(filtered);
  }, [rawUsers, searchQuery, domainFilter]);


  // 4. CALCULATE STATISTICS
  useEffect(() => {
    let orgCount = 0;
    let otherCount = 0;

    filteredUsers.forEach((user) => {
      if (user.website.toLowerCase().endsWith('.org')) {
        orgCount++;
      } else {
        otherCount++;
      }
    });

    setStats({
      totalCount: filteredUsers.length,
      orgDomainCount: orgCount,
      otherDomainCount: otherCount,
    });
  }, [filteredUsers]);

  
  // 5. UI
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '20px auto',
        fontFamily: 'sans-serif',
        padding: '0 15px',
      }}
    >
      <h2>User Directory Analytics</h2>

      {/* Control Bar */}
      <div
        style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '6px',
        }}
      >
        {/* Search */}
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '14px',
          }}
        />

        {/* Domain Filter */}
        <select
          data-testid="domain-filter-select"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '14px',
          }}
        >
          <option value="ALL">All Domains</option>
          <option value="ORG">.org Domains Only</option>
        </select>
      </div>

      {/* Summary Metrics */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          background: '#e3f2fd',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
        }}
      >
        <div>
          Total Matching:{' '}
          <strong data-testid="total-count">
            {stats.totalCount}
          </strong>
        </div>

        <div>
          .org Websites:{' '}
          <strong data-testid="org-count">
            {stats.orgDomainCount}
          </strong>
        </div>

        <div>
          Other Websites:{' '}
          <strong data-testid="other-count">
            {stats.otherDomainCount}
          </strong>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p data-testid="loading-indicator">
          Loading user profiles from API...
        </p>
      )}

      {/* Error */}
      {error && (
        <div
          data-testid="error-message"
          style={{
            color: 'red',
            background: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          Error loading users: {error}
        </div>
      )}

      {/* User Cards */}
      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '15px',
          }}
        >
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              data-testid="user-card"
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '12px',
                background: '#fff',
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>
                {user.name}
              </h4>

              <p
                style={{
                  margin: '0 0 5px 0',
                  fontSize: '13px',
                  color: '#666',
                }}
              >
                @{user.username}
              </p>

              <p
                style={{
                  margin: '0 0 5px 0',
                  fontSize: '13px',
                }}
              >
                📧 {user.email}
              </p>

              <p
                style={{
                  margin: '0',
                  fontSize: '13px',
                  color: '#1976d2',
                }}
              >
                🌐 {user.website}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


