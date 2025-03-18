import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaSpinner, FaDownload, FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioDuration, setAudioDuration] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const handleDataAvailable = (event) => {
    audioChunksRef.current.push(event.data);
  };

  const handleStop = () => {
    const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    setAudioURL(url);
    setAudioBlob(blob);
    setAudioDuration(formatDuration(blob.size / 16000)); // Assuming 16kHz sample rate
    audioChunksRef.current = [];
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sendAudioToServer = async () => {
    if (!audioBlob) return;
    setIsSending(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      const response = await fetch('http://localhost:8000/upload_audio', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error uploading audio');
      }
      const data = await response.json();
      setServerResponse(data);
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setIsSending(false);
    }
  };

  const downloadPrescription = () => {
    if (!serverResponse) return;
    const prescriptionText =
      `--- Prescription ---\n\n` +
      `Doctor's Notes:\n${serverResponse.doctor_notes}\n\n` +
      `Structured Prescription:\n${serverResponse.structured_prescription}\n\n` +
      `--- End of Prescription ---`;
    const blob = new Blob([prescriptionText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prescription.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Headline Section */}
      <div className="py-40 bg-black text-center text-white px-4">
        <h2 className="text-5xl lg:text-6xl leading-snug font-bold mt-6">Your Prescription Portal</h2>
      </div>
      {/* Main Audio Recorder Section */}
      <div className="flex flex-col items-center py-8 px-4 space-y-6">
        <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Audio Recorder</h2>
          <div className="mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full flex items-center justify-center py-3 text-white ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } rounded-full shadow-lg transition duration-300`}
            >
              {isRecording ? (
                <>
                  <FaStop className="mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <FaMicrophone className="mr-2" />
                  Start Recording
                </>
              )}
            </button>
          </div>
          {audioURL && (
            <div className="flex flex-col items-center">
              <audio controls src={audioURL} className="mb-4 rounded-md shadow-md" />
              <p className="text-gray-700">Duration: {audioDuration}</p>
              <div className="flex space-x-4 mt-4 z-0">
                <a
                  href={audioURL}
                  download="recording.wav"
                  className="flex items-center z-0 text-blue-500 hover:underline transition"
                >
                  <FaDownload className="mr-1" />
                  Download Recording
                </a>
                <button
                  onClick={sendAudioToServer}
                  disabled={isSending}
                  className={`flex items-center px-4 py-2 rounded-full text-white transition duration-300 ${
                    isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSending ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      Generate Prescription
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          {serverResponse && (
            <div className="mt-8 bg-gray-50 p-6 rounded-2xl shadow-xl border-t-4 border-green-500">
              {serverResponse.error ? (
                <p className="text-red-500 text-center">{serverResponse.error}</p>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">Prescription</h3>
                  <div className="border-t border-gray-300 pt-4">
                    <p className="mb-2 font-semibold text-gray-700">Doctor's Notes:</p>
                    <p className="mb-4 text-gray-800 whitespace-pre-wrap">{serverResponse.doctor_notes}</p>
                    <p className="mb-2 font-semibold text-gray-700">Structured Prescription:</p>
                    <div className="bg-white p-4 rounded shadow text-sm whitespace-pre-wrap font-serif text-gray-700">
                      {serverResponse.structured_prescription}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={downloadPrescription}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
                    >
                      <FaDownload className="mr-2" />
                      Download Prescription
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
