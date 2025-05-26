import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";

const YouTubeEmbed = ({ videoId, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadVideo = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      {!isLoaded ? (
        <div
          className="absolute inset-0 cursor-pointer bg-black"
          onClick={loadVideo}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      )}
    </div>
  );
};

export default YouTubeEmbed;
