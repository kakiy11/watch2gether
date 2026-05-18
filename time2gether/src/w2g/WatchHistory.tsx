import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WatchHistory.css';

interface WatchHistoryItem {
  id: string;
  videoUrl: string;
  videoTitle: string;
  thumbnail?: string;
  watchedAt: string;
  duration?: string;
}

const WatchHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<WatchHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load watch history from localStorage
    const storedHistory = localStorage.getItem('watchHistory');
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      setHistory(parsed);
      setFilteredHistory(parsed);
    }
  }, []);

  useEffect(() => {
    // Filter history based on search term
    if (searchTerm) {
      const filtered = history.filter(item =>
        item.videoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.videoUrl.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  }, [searchTerm, history]);

  const handleWatchAgain = (videoUrl: string) => {
    // Store current video to watch
    localStorage.setItem('currentVideo', videoUrl);
    navigate('/Main');
  };

  const handleRemoveFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    setFilteredHistory(updatedHistory);
    localStorage.setItem('watchHistory', JSON.stringify(updatedHistory));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all watch history?')) {
      setHistory([]);
      setFilteredHistory([]);
      localStorage.removeItem('watchHistory');
    }
  };

  const extractVideoTitle = (url: string): string => {
    // Extract video title from URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube Video';
    } else if (url.includes('vimeo.com')) {
      return 'Vimeo Video';
    } else if (url.includes('dailymotion.com')) {
      return 'Dailymotion Video';
    }
    return 'Watch Together Video';
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <button className="back-btn" onClick={() => navigate('/Main')}>
            ← Back to Main
          </button>
          <h1>Watch History</h1>
          {history.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAllHistory}>
              Clear All
            </button>
          )}
        </div>

        <div className="history-search">
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="history-stats">
          Total watched: <strong>{filteredHistory.length}</strong> videos
        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📺</div>
            <h3>No watch history yet</h3>
            <p>Videos you watch together will appear here</p>
            <button className="start-watching-btn" onClick={() => navigate('/Main')}>
              Start Watching
            </button>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-item-thumbnail">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.videoTitle} />
                  ) : (
                    <div className="thumbnail-placeholder">🎬</div>
                  )}
                </div>
                <div className="history-item-info">
                  <h3 className="history-item-title">
                    {item.videoTitle || extractVideoTitle(item.videoUrl)}
                  </h3>
                  <div className="history-item-url">{item.videoUrl}</div>
                  <div className="history-item-date">
                    Watched: {new Date(item.watchedAt).toLocaleString()}
                  </div>
                </div>
                <div className="history-item-actions">
                  <button
                    className="watch-again-btn"
                    onClick={() => handleWatchAgain(item.videoUrl)}
                  >
                    Watch Again
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromHistory(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;