import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEdit, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const AuthorInfo = ({
  authorName,
  authorId,
  joinDate,
  email,
  canEdit = false,
  onEditClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <FaUser size={28} />
        </div>

        <div className="flex-grow text-center md:text-left">
          <div className="font-semibold text-xl text-gray-800 mb-1">
            {authorName}
          </div>

          <div className="text-md text-gray-500 mb-3 flex flex-col gap-1">
            <span className="flex items-center justify-center md:justify-start">
              Учасник спільноти
              {joinDate && ` з ${joinDate}`}
            </span>

            {email && (
              <span className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-2" size={14} />
                {email}
              </span>
            )}
          </div>

          {canEdit && (
            <button
              onClick={onEditClick}
              className="text-amber-600 hover:text-amber-700  flex items-center mx-auto md:mx-0 text-md"
            >
              <FaEdit className="mr-1.5" size={14} />
              <span>Редагувати</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
