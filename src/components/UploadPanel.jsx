import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPanel = ({ onImageChange, onResult }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState('')

  useEffect(() => {
    axios.get(
      "http://localhost:9001/mothafuckin-api/chess",
    ).then((res) => {
      console.log(res.data)
      setToken(res?.data?.token)
    }).catch((err) => {
      console.log(`errorrrr`)
      console.log(err)
    });
  }, [])

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(url);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);


      const response = await axios.post(
        "http://localhost:9001/mothafuckin-api/chess/upload",
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          } 
        }
      );

      console.log({ response })

      if (response.data) {
        console.log(response)

        const id = response.data.recordId;
        const eventSource = new EventSource(`http://localhost:9001/mothafuckin-api/chess/stream/${id}`)

        eventSource.onmessage = (event) => {
          if (event.data === "[DONE]") {
            console.log("Stream complete");
            eventSource.close();
            return;
          }
        
          try {
            const data = JSON.parse(event.data);
            console.log("Stream update:", data);
          } catch {
            console.log("Raw:", event.data);
          }
        };
        
        eventSource.onerror = (err) => {
          console.error("Stream error:", err);
          eventSource.close();
        };
        onResult(response.data);
      } else {
        setError("No data received from server.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload image. Ensure backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onImageChange(null);
    setError("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 font-roboto">
        Upload Chess Position Image
      </h3>

      <div className="space-y-4">
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full
          file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {previewUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-xs max-h-64 object-contain border rounded-lg"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-roboto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              "Analyze Position"
            )}
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-roboto"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;
