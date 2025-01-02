import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './FunctionPage.css';

const FunctionPage = () => {
  const { userEmail, token } = useAuth();
  const [heatmapData, setHeatmapData] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      if (!token) {
        console.error('No token found, please log in.');
        return;
      }

      try {
        const response = await fetch('https://cp.dhytv.com/v1/stats/heatmap', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch heatmap data');
        }

        const data = await response.json();
        console.log(data);

        const processedData = data.map((item) => ({
          date: item.date,
          count: item.count,
        }));

        setHeatmapData(processedData);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchHeatmapData();
  }, [token]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      console.error('No token found, please log in.');
      return;
    }

    try {
      const response = await fetch(`https://cp.dhytv.com/v1/dicts/word/${searchWord}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData.message || 'Failed to fetch word data');
        throw new Error(errorData.message || 'Failed to fetch word data');
      }

      const resultData = await response.json();
      console.log(resultData);
      setSearchResult(resultData);
    } catch (error) {
      console.error('Error fetching word data:', error);
      setSearchResult(null);
    }
  };

  return (
    <div className="function-page main-content">
      <div className="function-page-container">
        <div className="left-panel">
          <section className="section-box">
            <h2 className="artistic-word">Word Search</h2>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Enter a word to search"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            {searchResult && (
              <div>
                <h3>Search Result for "{searchWord}":</h3>
                <p>{JSON.stringify(searchResult)}</p>
              </div>
            )}
          </section>
        </div>

        <div className="right-panel">
          <section className="section-box">
            <h2 className="artistic-word">Current Dictionary</h2>
            <p>English-Chinese</p>
          </section>

          <section className="section-box">
            <h2 className="artistic-word">Learning Progress</h2>
          </section>

          <section className="section-box">
            <h2 className="artistic-word">Learning Heatmap 2024</h2>
            <CalendarHeatmap
              startDate={new Date('2024-01-01')}
              endDate={new Date('2024-12-31')}
              values={heatmapData}
              classForValue={(value) => {
                if (!value) {
                  return 'color-empty';
                }
                return `color-github-${Math.min(value.count, 4)}`;
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default FunctionPage;
