import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AnalysisApp = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("text");
  const [searchImage, setSearchImage] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [videoFrames, setVideoFrames] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const videoRef = useRef(null);

  // Fetch analysis history on component mount
  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  // Fetch the previously analyzed videos
  const fetchAnalysisHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_analysis_history");
      setAnalysisHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
    }
  };

  // Handle video file upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(URL.createObjectURL(file));
      setUploadedVideo(file);
    } else {
      alert("Please upload a valid video file.");
    }
  };

  // Handle search image upload
  const handleSearchImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSearchImage(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search type change
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  // Upload and analyze video
  const uploadVideo = async () => {
    if (!uploadedVideo) {
      alert("Please select a video file first.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedVideo);
      const response = await axios.post("http://localhost:8000/analyze_video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      setResponseData(response.data);
      setSelectedVideoId(response.data.video_id);
      setVideoFrames(response.data.frames);
      setTranscript(response.data.transcript);
      fetchAnalysisHistory(); // Refresh history
      console.log("Video upload response:", response.data);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Search content
  const searchContent = async () => {
    if (searchType === "text" && !searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }
    
    if (searchType === "image" && !searchImage) {
      alert("Please upload an image to search.");
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("query", searchQuery);
      formData.append("search_type", searchType);
      formData.append("similarity_threshold", 0.7);
      
      if (searchType === "image") {
        formData.append("file", searchImage);
      }
      
      const response = await axios.post("http://localhost:8000/search", formData);
      setSearchResults(response.data.results);
      console.log("Search response:", response.data);
    } catch (error) {
      console.error("Error searching:", error);
      alert("Error searching. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch video frames for a specific video
  const fetchVideoFrames = async (videoId) => {
    try {
      const response = await axios.get(`http://localhost:8000/video_frames/${videoId}`);
      setVideoFrames(response.data.data);
      console.log("Video frames:", response.data.data);
    } catch (error) {
      console.error("Error fetching video frames:", error);
    }
  };

  // Jump to specific timestamp in video
  const jumpToTimestamp = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-36">
      <h1 className="text-3xl font-bold mb-6">Video Analysis Platform</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Left panel - Video upload and display */}
        <div className="w-full md:w-1/2 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload & Analyze Video</h2>
          
          {/* Video upload */}
          <div className="mb-4">
            <label className="block mb-2">Select Video File:</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={uploadVideo}
              disabled={!uploadedVideo || isLoading}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
              {isLoading ? "Uploading & Analyzing..." : "Upload & Analyze Video"}
            </button>
          </div>
          
          {/* Video player */}
          {videoFile && (
            <div className="mb-4">
              <video
                ref={videoRef}
                src={videoFile}
                controls
                width="100%"
                height="auto"
                className="rounded"
              ></video>
            </div>
          )}
          
          {/* Video frames */}
          {videoFrames.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Video Frames:</h3>
              <div className="grid grid-cols-3 gap-2 h-64 overflow-y-auto">
                {videoFrames.map((frame) => (
                  <div 
                    key={frame.frame_id} 
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => jumpToTimestamp(frame.timestamp_seconds)}
                  >
                    <img 
                      src={`http://localhost:8000/get_frame/${selectedVideoId}/${frame.frame_id}`}
                      alt={`Frame at ${frame.timestamp}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-xs text-center mt-1">{frame.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Transcript */}
          {transcript.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Transcript:</h3>
              <div className="h-64 overflow-y-auto">
                {transcript.map((segment, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => jumpToTimestamp(segment.start_seconds)}
                  >
                    <span className="text-sm font-medium text-blue-600">{segment.start} - {segment.end}</span>
                    <p className="text-sm">{segment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right panel - Search and results */}
        <div className="w-full md:w-1/2">
          {/* Tab navigation */}
          <div className="flex mb-4 border-b">
            <button
              onClick={() => setShowSearch(false)}
              className={`py-2 px-4 ${!showSearch ? "border-b-2 border-blue-500 font-semibold" : ""}`}
            >
              Analysis Results
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className={`py-2 px-4 ${showSearch ? "border-b-2 border-blue-500 font-semibold" : ""}`}
            >
              Search
            </button>
          </div>
          
          {/* Analysis results */}
          {!showSearch && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              
              {responseData ? (
                <div>
                  <p><span className="font-semibold">Video:</span> {responseData.filename}</p>
                  <p><span className="font-semibold">Frames:</span> {responseData.frames_count}</p>
                  <p><span className="font-semibold">Transcript Segments:</span> {responseData.transcript_segments_count}</p>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Analysis:</h3>
                    <div className="whitespace-pre-wrap bg-gray-100 p-3 rounded">
                      {responseData.analysis}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No analysis results yet. Upload a video to analyze.</p>
              )}
              
              {/* Analysis History */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Analysis History:</h3>
                {analysisHistory.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {analysisHistory.map((item) => (
                      <div key={item.video_id} className="border-b p-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.filename}</span>
                          <span className="text-xs text-gray-500">{item.timestamp}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <span className="mr-2">Frames: {item.frames_count}</span>
                          <span>Segments: {item.transcript_segments_count}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedVideoId(item.video_id);
                            setVideoFile(`http://localhost:8000/get_video/${item.video_id}`);
                            fetchVideoFrames(item.video_id);
                          }}
                          className="text-sm text-blue-600 hover:underline mt-1"
                        >
                          Load Video
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No analysis history available.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Search panel */}
          {showSearch && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Search Content</h2>
              
              <div className="mb-4">
                <label className="block mb-2">Search Type:</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="text"
                      checked={searchType === "text"}
                      onChange={handleSearchTypeChange}
                      className="mr-2"
                    />
                    Text Search
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="image"
                      checked={searchType === "image"}
                      onChange={handleSearchTypeChange}
                      className="mr-2"
                    />
                    Image Search
                  </label>
                </div>
              </div>
              
              {searchType === "text" && (
                <div className="mb-4">
                  <label className="block mb-2">Search Query:</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter search text..."
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              
              {searchType === "image" && (
                <div className="mb-4">
                  <label className="block mb-2">Upload Image to Search:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSearchImageUpload}
                    className="w-full p-2 border rounded"
                  />
                  {searchImage && (
                    <p className="mt-2 text-sm text-green-600">Image selected for search</p>
                  )}
                </div>
              )}
              
              <button
                onClick={searchContent}
                disabled={isLoading || (searchType === "text" && !searchQuery.trim()) || (searchType === "image" && !searchImage)}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
              
              {/* Search results */}
              {searchResults && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Search Results:</h3>
                  {searchResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <div key={index} className="border-b p-3 hover:bg-gray-100">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">
                              {result.metadata.type === "video_frame" ? "Video Frame" : "Transcript Segment"}
                            </span>
                            <span className="text-sm text-gray-500">
                              Similarity: {(result.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          
                          {result.metadata.type === "video_frame" ? (
                            <div className="flex items-center">
                              <img 
                                src={`http://localhost:8000/get_frame/${result.video_id}/${result.metadata.frame_id}`}
                                alt={`Frame at ${result.timestamp}`}
                                className="w-24 h-16 object-cover rounded mr-4"
                              />
                              <div>
                                <p className="text-sm">Timestamp: {result.timestamp}</p>
                                <button
                                  onClick={() => {
                                    setSelectedVideoId(result.video_id);
                                    setVideoFile(`http://localhost:8000/get_video/${result.video_id}`);
                                    fetchVideoFrames(result.video_id);
                                    jumpToTimestamp(result.timestamp_seconds);
                                    setShowSearch(false);
                                  }}
                                  className="text-sm text-blue-600 hover:underline mt-1"
                                >
                                  Jump to Timestamp
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm">{result.content}</p>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-600">Time: {result.timestamp}</span>
                                <button
                                  onClick={() => {
                                    setSelectedVideoId(result.video_id);
                                    setVideoFile(`http://localhost:8000/get_video/${result.video_id}`);
                                    fetchVideoFrames(result.video_id);
                                    jumpToTimestamp(result.timestamp_seconds);
                                    setShowSearch(false);
                                  }}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Jump to Timestamp
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No matching results found.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisApp;