import React from 'react';

const StatusModal = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={onClose} className="text-white ml-4">X</button>
      </div>
    </div>
  );
};

export default StatusModal;
