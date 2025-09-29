/**
 * Status Popup Component
 * Popup สำหรับแสดง status ของการยกยอ
 */

import React, { useState, useEffect } from 'react';

interface StatusPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pondId: number;
  currentStatus: number;
  onStatusComplete?: () => void;
}

const StatusPopup: React.FC<StatusPopupProps> = ({
  isOpen,
  onClose,
  pondId,
  currentStatus,
  onStatusComplete
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [isCompleted, setIsCompleted] = useState(false);

  // Status messages mapping
  const statusMessages = {
    1: 'กำลังเริ่มยกยอขึ้น....',
    2: 'กำลังเตรียมกล้องถ่ายรูป....',
    3: 'ถ่ายสำเร็จ...',
    4: 'กรุณารอข้อมูลสักครู่...',
    5: 'สำเร็จ!!....'
  };

  // Status icons mapping
  const statusIcons = {
    1: '🔄',
    2: '📷',
    3: '✅',
    4: '⏳',
    5: '🎉'
  };

  // Status colors mapping
  const statusColors = {
    1: 'from-blue-500 to-blue-600',
    2: 'from-purple-500 to-purple-600',
    3: 'from-green-500 to-green-600',
    4: 'from-yellow-500 to-yellow-600',
    5: 'from-emerald-500 to-emerald-600'
  };

  useEffect(() => {
    setStatus(currentStatus);
    
    // Check if status is completed
    if (currentStatus === 5) {
      setIsCompleted(true);
      // Auto close after 3 seconds when completed
      setTimeout(() => {
        onStatusComplete?.();
        onClose();
      }, 3000);
    }
  }, [currentStatus, onClose, onStatusComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#fcfaf7] to-yellow-50 rounded-3xl shadow-2xl max-w-md w-full mx-4 border-2 border-[#f2c245] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${statusColors[status as keyof typeof statusColors]} p-6 text-center relative`}>
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-black hover:bg-opacity-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="text-4xl">{statusIcons[status as keyof typeof statusIcons]}</div>
            <h3 className="text-2xl font-bold text-white">
              สถานะบ่อที่ {pondId}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            {/* Status Message */}
            <div className="mb-6">
              <p className="text-xl font-bold text-[#1c170d] mb-2">
                {statusMessages[status as keyof typeof statusMessages]}
              </p>
              <p className="text-sm text-gray-600">
                สถานะปัจจุบัน: {status}/5
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    status === 1 ? 'bg-blue-500' :
                    status === 2 ? 'bg-purple-500' :
                    status === 3 ? 'bg-green-500' :
                    status === 4 ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${(status / 5) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            {/* Status Steps */}
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
                    step <= status 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step <= status 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step <= status ? '✓' : step}
                  </div>
                  <span className={`text-sm ${
                    step <= status ? 'text-green-700 font-medium' : 'text-gray-500'
                  }`}>
                    {statusMessages[step as keyof typeof statusMessages]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-yellow-50 p-4 border-t-2 border-[#f2c245]">
          <div className="text-center">
            {isCompleted ? (
              <div className="text-green-600 font-bold">
                🎉 กระบวนการยกยอเสร็จสิ้น!
              </div>
            ) : (
              <div className="text-gray-600">
                ⏳ กรุณารอสักครู่...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPopup;
