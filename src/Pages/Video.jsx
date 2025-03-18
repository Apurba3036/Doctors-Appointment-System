import React, { useState, useRef } from "react";
import axios from "axios";

const Video = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [userText, setUserText] = useState("");
  const [responseData, setResponseData] = useState(null); // State to store API response
  const videoRef = useRef(null);

  // Handle video file upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid video file.");
    }
  };

  // Capture a screenshot from the video
  const captureScreenshot = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setScreenshot(canvas.toDataURL("image/png"));
  };

  // Handle user input text change
  const handleTextChange = (e) => {
    setUserText(e.target.value);
  };

  // Send the user input text and video/screenshot to the API
  const sendToAPI = async (data, type) => {
    try {
      const formData = new FormData();

      // If sending text, add it to formData
      if (type === "text") {
        formData.append("text", data);
      }

      // If sending image (screenshot), add it to formData
      if (type === "image") {
        const imageBlob = await fetch(data).then((res) => res.blob());
        formData.append("file", imageBlob, "screenshot.png");
      }

      // Send request
      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Store the response data in state
      setResponseData(response.data);

      console.log("API response:", response.data);
    } catch (error) {
      console.error("Error sending data to API:", error);
    }
  };

  return (
    <div className="max-w-7xl mt-36 mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Upload Section */}
        <div className="flex-1">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="mb-4 border p-2 rounded-lg"
          />
          {videoFile && (
            <div className="bg-black rounded-lg">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                controls
                src={videoFile}
              ></video>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-4 max-w-xs w-full">
          <div className="bg-gray-800 p-4 rounded-lg text-white">
            <button
              onClick={captureScreenshot}
              className="w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
            >
              Capture Screenshot
            </button>
          </div>

          {/* Text Input Section */}
          <div className="mt-4">
            <label className="block text-white font-semibold">Your Text</label>
            <textarea
              value={userText}
              onChange={handleTextChange}
              className="w-full mt-2 p-2 rounded-lg bg-gray-700 text-white"
              placeholder="Enter text related to the video..."
            />
          </div>

          {/* Display Screenshot */}
          {screenshot && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Captured Screenshot</p>
              <img
                src={screenshot}
                alt="Screenshot"
                className="rounded-lg mt-2"
              />
              <button
                onClick={() => sendToAPI(screenshot, "image")}
                className="mt-4 w-full text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg"
              >
                Send Screenshot to API
              </button>
            </div>
          )}

          {/* Send Text and Video/Screenshot to API */}
          {userText && (
            <div className="mt-4">
              <button
                onClick={() => sendToAPI(userText, "text")}
                className="w-full text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                Send Text to API
              </button>
            </div>
          )}

          {/* Display API Response */}
          {responseData && (
            <div className="mt-6 bg-gray-700 p-4 rounded-lg text-white">
              <h3 className="text-xl font-semibold">API Response</h3>
              <p className="mt-2">
                <strong>Content Type:</strong> {responseData.content_type}
              </p>
              <p className="mt-2">
                <strong>Analysis:</strong>
              </p>
              <div
                className="mt-2 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: responseData.analysis }}
              />
              <p className="mt-4">
                <strong>Document ID:</strong> {responseData.document_id}
              </p>
            </div>
          )}
        </div>
     
      </div>
    </div>
  );
};

export default Video;

