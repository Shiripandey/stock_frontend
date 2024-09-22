import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as styles from './styles';

function StockDetails() {
  const [numStocks, setNumStocks] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [showStocks, setShowStocks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await axios.get(`https://stock-backend-1-h43u.onrender.com/api/stocks`); // Updated API URL
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to load stock data. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setNumStocks(value > 0 && value <= 20 ? value : 0);
  };

  const handleButtonClick = () => {
    if (numStocks > 0) {
      setShowStocks(true);
    }
  };

  return (
    <div style={styles.stockListContainerStyle}>
      <div style={styles.inputContainerStyle}>
        <h1 style={styles.headingStyle}>Live Stock Values</h1>
        <label style={styles.labelStyle}>
          Enter the number of stocks (not more than 20):
          <input type="number" value={numStocks} onChange={handleInputChange} style={styles.inputStyle} />
        </label>
        <button 
          onClick={handleButtonClick} 
          style={styles.buttonStyle}>
          Show Stocks
        </button>
      </div>

      {loading && <p>Loading stocks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      {showStocks && numStocks > 0 && stocks.length > 0 ? (
        <div style={styles.stockListStyle}>
          <ul style={{ padding: 0 }}>
            {stocks.slice(0, numStocks).map(stock => (
              <li key={stock.symbol} style={styles.listItemStyle}>
                <strong>{stock.symbol}</strong>: ${stock.openPrice.toFixed(2)} 
                <span style={styles.lastUpdatedStyle}> (Last Updated: {new Date(stock.lastUpdated).toLocaleTimeString()})</span>
                <div style={styles.trendStyle}>
                  <span style={{ color: stock.openPrice > 0 ? 'green' : 'red' }}>
                    {stock.openPrice > 0 ? '↑' : '↓'} Price Trend
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        showStocks && <p>No stocks available to display.</p>
      )}
    </div>
  );
}

export default StockDetails;
