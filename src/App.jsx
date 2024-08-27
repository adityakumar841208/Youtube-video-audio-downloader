import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const apiHost = import.meta.env.VITE_API_HOST;

const App = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [selectedVideoQuality, setSelectedVideoQuality] = useState('');
  const [selectedAudioQuality, setSelectedAudioQuality] = useState('');
  const [downloadType, setDownloadType] = useState('video');
  const [error,setError] = useState('')

  const inputRef = useRef();
  const extractVideoId = (url) => {     
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch (e) {
      setError('Invalid URL');
      return '';
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, [])
  

  const handleClick = async () => {
    const videoId = extractVideoId(url);
    setLoading(true);
    setError('')

    const options = {
      method: 'GET',
      url: apiUrl,
      params: {
        videoId: `${videoId}`
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    };

    try {
      const response = await axios.request(options);
      setResponse(response.data);
    } catch (error) {
      setError('An error occurred while fetching data. Please try again.');
    }finally{
      setLoading(false)
    }
  };

  const handleDownload = () => {
    if (!response) return;

    const downloadItem = downloadType === 'video'
      ? response.videos.items.find(item => item.quality === selectedVideoQuality)
      : response.audios.items.find(item => item.sizeText === selectedAudioQuality);

    if (downloadItem) {
      const link = document.createElement('a');
      link.href = downloadItem.url;
      link.download = `${response.title}.${downloadType === 'video' ? 'mp4' : 'mp3'}`;
      link.click();
    }
  };


  return (
    <div className="
  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  bg-white shadow-lg rounded-lg border border-red-900
  px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10
  flex flex-col items-center gap-4 sm:gap-6 max-w-xs sm:max-w-md lg:max-w-lg w-full
">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
        Enter the video link below
      </h1>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste the video link here (YouTube)"
        type="text"
        ref={inputRef}
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {response && (
        <div className="w-full flex flex-col gap-4">
          <select
            value={downloadType}
            onChange={(e) => setDownloadType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="video">Download Video</option>
            <option value="audio">Download Audio</option>
          </select>

          {downloadType === 'video' && (
            <select
              value={selectedVideoQuality}
              onChange={(e) => setSelectedVideoQuality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>Select Video Quality</option>
              {response.videos.items.map((video, index) => (
                <option key={index} value={video.quality}>
                  {video.quality} - {video.sizeText}
                </option>
              ))}
            </select>
          )}

          {downloadType === 'audio' && (
            <select
              value={selectedAudioQuality}
              onChange={(e) => setSelectedAudioQuality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>Select Audio Quality</option>
              {response.audios.items.map((audio, index) => (
                <option key={index} value={audio.sizeText}>
                  {audio.sizeText}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {response ? (
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg w-full transition-all duration-300 ease-in-out"
        >
          Download
        </button>
      ) : (
        <button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg w-full transition-all duration-300 ease-in-out"
        >
          {
            loading === false ? ('Submit') : ('Loading...')
          }
        </button>
      )}
    </div>

  );
};

export default App;
