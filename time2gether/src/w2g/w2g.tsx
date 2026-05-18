import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { translations, Language } from "../translations";
import "./main.css";

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomLink, setRoomLink] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [videoInputUrl, setVideoInputUrl] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'English';
  });

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.username || userData.email || 'User';
  const t = translations[currentLanguage];

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoParam = params.get('video');
    const roomParam = window.location.pathname.split('/').pop();
    
    if (videoParam && videoParam !== '') {
      setCurrentVideoUrl(decodeURIComponent(videoParam));
      setShowPlayer(true);
    }
    
    if (roomParam && roomParam !== 'Main' && roomParam !== 'room') {
      setRoomId(roomParam);
      setRoomCreated(true);
      const savedVideo = localStorage.getItem(`room_${roomParam}_video`);
      if (savedVideo) {
        setVideoInputUrl(savedVideo);
      }
    }
  }, []);

  const generateRoomId = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleCreateRoom = (): void => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    const newLink = `${window.location.origin}/room/${newRoomId}`;
    setRoomLink(newLink);
    setRoomCreated(true);
    console.log("Room created:", newLink);
  };

  const handleStartWatching = () => {
    if (videoInputUrl && videoInputUrl.trim() !== '') {
      setCurrentVideoUrl(videoInputUrl);
      setShowPlayer(true);
      
      if (roomId) {
        localStorage.setItem(`room_${roomId}_video`, videoInputUrl);
      }
      
      const watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const newHistoryItem = {
        id: Date.now().toString(),
        videoUrl: videoInputUrl,
        videoTitle: extractVideoTitle(videoInputUrl),
        watchedAt: new Date().toISOString(),
        roomId: roomId,
      };
      watchHistory.unshift(newHistoryItem);
      const limitedHistory = watchHistory.slice(0, 50);
      localStorage.setItem('watchHistory', JSON.stringify(limitedHistory));
      
      const newUrl = `${window.location.origin}/room/${roomId}?video=${encodeURIComponent(videoInputUrl)}`;
      window.history.pushState({}, '', newUrl);
    } else {
      alert("Please enter a video URL first!");
    }
  };

  const extractVideoTitle = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube Video';
    } else if (url.includes('vimeo.com')) {
      return 'Vimeo Video';
    } else if (url.includes('dailymotion.com')) {
      return 'Dailymotion Video';
    } else if (url.includes('rutube.ru')) {
      return 'Rutube Video';
    }
    return 'Watch Together Video';
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const generateFullLink = (): string => {
    if (!roomId) return '';
    if (videoInputUrl && videoInputUrl.trim() !== '') {
      return `${window.location.origin}/room/${roomId}?video=${encodeURIComponent(videoInputUrl)}`;
    }
    return `${window.location.origin}/room/${roomId}`;
  };

  const handleCopyLink = async (): Promise<void> => {
    const fullLink = generateFullLink();
    if (!fullLink) {
      alert("Please create a room first!");
      return;
    }
    try {
      await navigator.clipboard.writeText(fullLink);
      alert(t.roomLinkCopied);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert(t.failedToCopy);
    }
  };

  const handleShareLink = async (): Promise<void> => {
    const fullLink = generateFullLink();
    if (!fullLink) {
      alert("Please create a room first!");
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Watch Together Room",
          text: "Join my Watch Together room!",
          url: fullLink,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      handleCopyLink();
    }
  };

  const handleLanguageChange = (lang: Language): void => {
    setCurrentLanguage(lang);
    setShowLanguageMenu(false);
    alert(`${t.languageChanged} ${lang}`);
  };

  const handleProfileClick = (): void => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const handleHistoryClick = (): void => {
    setShowUserMenu(false);
    navigate('/history');
  };

  const handleCreateAnotherRoom = (): void => {
    setRoomCreated(false);
    setRoomId("");
    setRoomLink("");
    setVideoInputUrl("");
    setCurrentVideoUrl("");
    setShowPlayer(false);
  };

  return (
    <div className="app-container">
      {showPlayer && (
        <VideoPlayer 
          videoUrl={currentVideoUrl} 
          onClose={() => setShowPlayer(false)} 
        />
      )}

      <header className="header">
        <div className="logo">
          <h1 className="logo-text">
            Watch<br />2gether
          </h1>
        </div>

        <nav className="nav">
          <a href="#home" className="nav-link" onClick={(e) => e.preventDefault()}>
            {t.home}
          </a>
          
          <div className="nav-dropdown">
            <a href="#language" className="nav-link" onClick={(e) => {
                e.preventDefault();
                setShowLanguageMenu(!showLanguageMenu);
                setShowUserMenu(false);
              }}>
              {t.language}
            </a>
            {showLanguageMenu && (
              <div className="dropdown-menu">
                <button onClick={() => handleLanguageChange("English")}>English 🇬🇧</button>
                <button onClick={() => handleLanguageChange("Spanish")}>Español 🇪🇸</button>
                <button onClick={() => handleLanguageChange("French")}>Français 🇫🇷</button>
                <button onClick={() => handleLanguageChange("German")}>Deutsch 🇩🇪</button>
                <button onClick={() => handleLanguageChange("Russian")}>Русский 🇷🇺</button>
              </div>
            )}
          </div>
        </nav>

        <div className="auth">
          <div className="user-dropdown">
            <button 
              className="user-menu-btn"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowLanguageMenu(false);
              }}
            >
              👤 {userName} ▼
            </button>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <div className="user-info">
                  <strong>{userName}</strong>
                  <small>{userData.email || ''}</small>
                </div>
                <hr />
                <button onClick={handleProfileClick}>
                  📱 {t.profileSettings}
                </button>
                <button onClick={handleHistoryClick}>
                  📜 {t.watchHistory}
                </button>
                <hr />
                <button onClick={handleLogout} className="logout-menu-item">
                  🚪 {t.signOut}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {!roomCreated ? (
          <button className="create-room-btn" onClick={handleCreateRoom}>
            {t.createYourRoom}
          </button>
        ) : (
          <div className="room-created">
            <h2 className="room-title">{t.roomCreated}</h2>
            <p className="room-id-info">Room ID: <strong>{roomId}</strong></p>
            
            <div className="video-url-input-container">
              <input
                type="text"
                className="video-url-input"
                placeholder="Paste YouTube or other video URL here..."
                value={videoInputUrl}
                onChange={(e) => setVideoInputUrl(e.target.value)}
              />
              <button className="watch-btn" onClick={handleStartWatching}>
                Watch Together 🎬
              </button>
            </div>

            <div className="room-link-container">
              <input 
                type="text" 
                className="room-link-input" 
                value={generateFullLink()} 
                readOnly 
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button className="copy-btn" onClick={handleCopyLink}>
                {t.copy}
              </button>
            </div>
            <div className="room-buttons">
              <button className="share-btn" onClick={handleShareLink}>
                {t.shareLink}
              </button>
              <button 
                className="create-another-btn" 
                onClick={handleCreateAnotherRoom}
              >
                {t.createAnotherRoom}
              </button>
            </div>
          </div>
        )}
      </main>

      <section className="steps-section">
        <div className="step-card">
          <span className="step-number">1.</span> {t.step1}
        </div>
        <div className="step-card">
          <span className="step-number">2.</span> {t.step2}
        </div>
        <div className="step-card">
          <span className="step-number">3.</span> {t.step3}
        </div>
      </section>
    </div>
  );
};

export default Main;