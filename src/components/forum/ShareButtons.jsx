import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  FaShare,
  FaCopy,
  FaCheck,
  FaFacebook,
  FaTelegram,
  FaLinkedin,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { createPortal } from 'react-dom';

const ShareButtons = ({
  url = window.location.href,
  title = document.title,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const btnRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (showOptions && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuWidth = 230;
      let left = rect.left + window.scrollX;
      if (left + menuWidth > window.innerWidth - 10) {
        left = window.innerWidth - menuWidth - 10;
      }
      setMenuPos({
        top: rect.bottom + window.scrollY + 8,
        left,
      });
    }
  }, [showOptions]);

  const toggleOptions = () => setShowOptions((v) => !v);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    xtwitter: `https://xtwitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const DropdownMenu = (
    <>
      <div
        className="fixed inset-0 z-[1000]"
        onClick={toggleOptions}
        tabIndex={-1}
      />
      <div
        style={{
          position: 'absolute',
          top: menuPos.top,
          left: menuPos.left,
          minWidth: 230,
          zIndex: 1100,
        }}
        className="bg-white rounded-lg shadow-xl p-2 border border-gray-100 "
      >
        <button
          onClick={handleCopyLink}
          className="flex items-center p-2 w-full text-left hover:bg-gray-50 rounded-md "
        >
          {isCopied ? (
            <>
              <FaCheck className="mr-2 text-green-500" size={18} />
              <span className="text-sm">Скопійовано!</span>
            </>
          ) : (
            <>
              <FaCopy className="mr-2 text-gray-600" size={18} />
              <span className="text-sm">Копіювати посилання</span>
            </>
          )}
        </button>

        <div className="my-1.5 border-t border-gray-100"></div>

        <a
          href={socialUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 hover:bg-gray-50 rounded-md "
        >
          <FaFacebook className="mr-2 text-blue-600" size={18} />
          <span className="text-sm">Facebook</span>
        </a>

        <a
          href={socialUrls.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 hover:bg-gray-50 rounded-md "
        >
          <FaTelegram className="mr-2 text-blue-400" size={18} />
          <span className="text-sm">Telegram</span>
        </a>

        <a
          href={socialUrls.xtwitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 hover:bg-gray-50 rounded-md "
        >
          <FaXTwitter className="mr-2 text-gray-700" size={18} />
          <span className="text-sm">X (Twitter)</span>
        </a>

        <a
          href={socialUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 hover:bg-gray-50 rounded-md "
        >
          <FaLinkedin className="mr-2 text-blue-700" size={18} />
          <span className="text-sm">LinkedIn</span>
        </a>
      </div>
    </>
  );

  return (
    <div className="relative z-10">
      <button
        ref={btnRef}
        onClick={toggleOptions}
        className="flex items-center px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 "
        aria-expanded={showOptions}
        aria-haspopup="true"
      >
        <FaShare className="mr-1.5" size={18} />
        <span>Поділитися</span>
      </button>
      {showOptions && createPortal(DropdownMenu, document.body)}
    </div>
  );
};

export default ShareButtons;
