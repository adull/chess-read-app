import React, { useState } from "react";

const CopyPgnButton = ({ text, label = "Copy PGN to Clipboard", className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative flex justify-center">
      <button
        onClick={handleCopy}
        className={`bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors ${className}`}
      >
        {label}
      </button>

      {copied && (
        <span
          className="absolute text-green-700 text-sm font-semibold animate-bounce-fade"
          style={{ top: "-1.5rem" }}
        >
          Copied!
        </span>
      )}
    </div>
  );
};



export default CopyPgnButton;
