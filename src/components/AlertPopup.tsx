/**
 * Alert Popup Component
 * Popup สำหรับจัดการ alert actions (อ่านแล้ว, ยังไม่อ่าน)
 */

import React, { useState, useEffect } from 'react';
import { useAlerts } from '@/hooks/use-alerts';

interface AlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  pondId: number;
  userId: number;
  alertId?: string;
  onMarkAsRead?: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({
  isOpen,
  onClose,
  pondId,
  userId,
  alertId,
  onMarkAsRead
}) => {
  const { 
    getPondUnreadAlerts, 
    markAlertAsRead,
    isLoading 
  } = useAlerts();
  
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(alertId || null);

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen, pondId]);

  const fetchAlerts = async () => {
    try {
      const result = await getPondUnreadAlerts(pondId);
      if (result && result.success) {
        setAlerts(result.alerts || []);
        if (result.alerts && result.alerts.length > 0 && !selectedAlertId) {
          setSelectedAlertId(result.alerts[0].id);
        }
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
    }
  };

  const handleMarkAsRead = async () => {
    if (!selectedAlertId) return;
    
    console.log('🔄 AlertPopup: handleMarkAsRead called for alertId:', selectedAlertId);
    
    try {
      const result = await markAlertAsRead(selectedAlertId);
      console.log('🔄 AlertPopup: markAlertAsRead result:', result);
      if (result.success) {
        // Remove from local state
        setAlerts(prev => prev.filter(alert => alert.id !== selectedAlertId));
        setSelectedAlertId(null);
        
        console.log('🔄 AlertPopup: Calling onMarkAsRead callback');
        // Call parent callback
        onMarkAsRead?.();
        
        // Close if no more alerts
        if (alerts.length <= 1) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };


  const handleClose = () => {
    setSelectedAlertId(null);
    onClose();
  };

  if (!isOpen) return null;

  const selectedAlert = alerts.find(alert => alert.id === selectedAlertId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#fcfaf7] to-yellow-50 rounded-3xl shadow-2xl max-w-lg w-full mx-4 border-2 border-[#f2c245] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#f2c245] to-[#e6b63d] p-6 text-center relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={handleClose}
              className="text-[#1c170d] hover:text-white transition-colors p-2 rounded-full hover:bg-black hover:bg-opacity-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="text-3xl">🚨</div>
            <h3 className="text-2xl font-bold text-[#1c170d]">
              แจ้งเตือนบ่อที่ {pondId}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <p className="text-xl text-[#1c170d] font-medium">ไม่มีแจ้งเตือนที่ยังไม่อ่าน</p>
              <p className="text-sm text-gray-600 mt-2">ทุกอย่างเรียบร้อยดี!</p>
            </div>
          ) : (
            <>
              {/* Alert List */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="text-xl">📋</div>
                  <h4 className="text-lg font-bold text-[#1c170d]">
                    แจ้งเตือนที่ยังไม่อ่าน
                  </h4>
                  <div className="bg-[#f2c245] text-[#1c170d] px-3 py-1 rounded-full text-sm font-bold">
                    {alerts.length}
                  </div>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`
                        p-2 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[0.98]
                        ${selectedAlertId === alert.id 
                          ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-md scale-[0.98]' 
                          : 'border-gray-200 hover:border-red-500 hover:bg-red-50 hover:shadow-sm'
                        }
                      `}
                      onClick={() => setSelectedAlertId(alert.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#1c170d] mb-1">
                            {alert.title}
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed mb-1">
                            {alert.body}
                          </p>
                          {/* Timestamp */}
                          <div className="text-xs text-gray-500 bg-gray-100 border border-black px-2 py-1 rounded-md inline-block">
                            {new Date(alert.created_at).toLocaleString('th-TH', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="ml-2 flex items-center">
                          {selectedAlertId === alert.id && (
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-md"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {alerts.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-yellow-50 p-6 border-t-2 border-[#f2c245]">
            <div className="flex justify-center">
              <button
                onClick={handleMarkAsRead}
                disabled={isLoading || !selectedAlertId}
                className="w-16 h-16 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? '⏳' : '✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPopup;
