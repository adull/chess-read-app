import React, { useState } from 'react';
import axios from 'axios';
import ChessBoard from './ChessBoard';

const Body = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pgn, setPgn] = useState('[Event "Third Rosenwald Trophy"]\n[Site "New York, NY USA"]\n[Date "1956.10.17"]\n[Round "8"]\n[White "Donald Byrne"]\n[Black "Robert James Fischer"]\n[Result "0-1"]\n[ECO "D92"]\n[PlyCount "74"]\n\n1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. Ne5 Kg7 34. Kg1 Bc5+ 35. Kf1 Ng3+ 36. Ke1 Bb4+ 37. Kd1 Bb3+ 0-1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPgn(''); // Clear previous PGN when new file is selected
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:9001/mothafuckin-api/chess', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.pgn) {
        console.log({ response })
        setPgn(response.data.pgn);
      } else {
        setError('No PGN data received from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to upload image. Please check if the server is running on localhost:9001'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPgn('');
    setError('');
    // Clear the file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="container mx-auto pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 font-roboto">Chess Position Analyzer</h2>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 font-roboto">Upload Chess Position Image</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                Select Image File
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {previewUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                  Image Preview
                </label>
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-xs max-h-64 object-contain border rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-roboto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Position'
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

        {/* Chess Board Section */}
        {pgn && <ChessBoard pgn={pgn} />}
      </div>
    </div>
  );
};

export default Body;
