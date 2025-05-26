import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

const CopyCodeButton = ({
  code,
  position = "top-3 right-3",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <button
      className={`absolute ${position} z-10 p-2 rounded-md text-sm font-medium transition-all border border-gray-200
        ${
          copied
            ? "bg-white text-gray-800"
            : "bg-white text-gray-800 hover:bg-gray-50"
        } ${className}`}
      onClick={copyToClipboard}
      aria-label="Copy code"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <FaCheck className="inline mr-1" />
          <span className="hidden sm:inline">Скопійовано!</span>
        </>
      ) : (
        <>
          <FaCopy className="inline mr-1 text-gray-700" />
          <span className="hidden sm:inline">Копіювати</span>
        </>
      )}
    </button>
  );
};

export default CopyCodeButton;
