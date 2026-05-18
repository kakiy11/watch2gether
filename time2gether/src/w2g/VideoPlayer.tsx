import React, { useState, useEffect } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  videoUrl: string;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onClose }) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Функция для парсинга URL и получения embed ссылки
  const parseVideoUrl = (url: string): string | null => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
    }

    // YouTube Shorts
    const shortsRegex = /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
    const shortsMatch = url.match(shortsRegex);
    
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    // Dailymotion
    const dailymotionRegex = /dailymotion\.com\/video\/([a-zA-Z0-9]+)/;
    const dailymotionMatch = url.match(dailymotionRegex);
    
    if (dailymotionMatch) {
      return `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}?autoplay=1`;
    }

    // Rutube
    const rutubeRegex = /rutube\.ru\/video\/([a-zA-Z0-9]+)/;
    const rutubeMatch = url.match(rutubeRegex);
    
    if (rutubeMatch) {
      return `https://rutube.ru/play/embed/${rutubeMatch[1]}/?autoplay=1`;
    }

    return null;
  };

  useEffect(() => {
    if (videoUrl) {
      const embed = parseVideoUrl(videoUrl);
      if (embed) {
        setEmbedUrl(embed);
        setError('');
      } else {
        setError('Unsupported video platform. Please use YouTube, Vimeo, Dailymotion, or Rutube.');
        setEmbedUrl('');
      }
    }
  }, [videoUrl]);

  if (error) {
    return (
      <div className="video-error">
        <p>{error}</p>
        <button onClick={onClose} className="close-player-btn">Close</button>
      </div>
    );
  }

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <div className="video-header">
          <h3>Watch Together</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        {embedUrl && (
          <iframe
            src={embedUrl}
            title="Video Player"
            className="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;