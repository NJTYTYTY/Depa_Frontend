import { useState, useEffect, useCallback } from 'react';

interface PondStatus {
  pondId: number;
  status: number;
  message: string;
  timestamp: string;
  source: string;
}

interface UsePondStatusProps {
  pondId: number;
  onStatusUpdate?: (status: number) => void;
  onStatusComplete?: () => void;
}

export const usePondStatus = ({ pondId, onStatusUpdate, onStatusComplete }: UsePondStatusProps) => {
  const [currentStatus, setCurrentStatus] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Status messages mapping
  const statusMessages = {
    1: 'กำลังเริ่มยกยอขึ้น....',
    2: 'กำลังเตรียมกล้องถ่ายรูป....',
    3: 'ถ่ายสำเร็จ...',
    4: 'กรุณารอข้อมูลสักครู่...',
    5: 'สำเร็จ!!....'
  };

  // Start the lift process
  const startLiftProcess = useCallback(async () => {
    if (isProcessing) {
      console.log('Process already running');
      return;
    }

    console.log('🚀 Starting lift process for pond:', pondId);
    setIsProcessing(true);
    setCurrentStatus(0);
    setShowPopup(true);
    setError(null);

    try {
      console.log('📡 Starting polling for status updates...');
      
      // Start polling for status updates from API
      startStatusPolling();
      
    } catch (err) {
      console.error('Error starting lift process:', err);
      setError('เกิดข้อผิดพลาดในการเริ่มกระบวนการยกยอ');
      setIsProcessing(false);
      setShowPopup(false);
    }
  }, [pondId, isProcessing]);

  // Poll for status updates from API
  const startStatusPolling = useCallback(() => {
    console.log('🔄 Starting status polling for pond:', pondId);
    const pollInterval = setInterval(async () => {
      try {
        // Check if we have a status update from the API
        // We'll use a simple approach: check if there's a new status
        const response = await fetch(`/api/pond-status/${pondId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Polling response:', data);
          if (data.data && data.data.status && data.data.status !== currentStatus) {
            console.log(`🔄 Status updated from ${currentStatus} to ${data.data.status}`);
            setCurrentStatus(data.data.status);
            onStatusUpdate?.(data.data.status);
            
            if (data.data.status === 5) {
              console.log('✅ Process completed!');
              setIsProcessing(false);
              onStatusComplete?.();
              clearInterval(pollInterval);
            }
          }
        } else {
          console.log('❌ Polling failed:', response.status);
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    }, 1000); // Poll every 1 second

    // Stop polling after 5 minutes to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isProcessing) {
        setError('หมดเวลารอการอัปเดตสถานะ');
        setIsProcessing(false);
      }
    }, 300000); // 5 minutes
  }, [pondId, currentStatus, onStatusUpdate, onStatusComplete, isProcessing]);

  // Handle status update from external source (e.g., WebSocket, polling)
  const handleStatusUpdate = useCallback((status: number) => {
    setCurrentStatus(status);
    onStatusUpdate?.(status);
    
    if (status === 5) {
      setIsProcessing(false);
      onStatusComplete?.();
    }
  }, [onStatusUpdate, onStatusComplete]);

  // Close popup
  const closePopup = useCallback(() => {
    setShowPopup(false);
    if (currentStatus === 5) {
      setIsProcessing(false);
    }
  }, [currentStatus]);

  // Reset status
  const resetStatus = useCallback(() => {
    setCurrentStatus(0);
    setIsProcessing(false);
    setShowPopup(false);
    setError(null);
  }, []);

  // Check if process is completed
  const isCompleted = currentStatus === 5;

  // Get current status message
  const getStatusMessage = useCallback((status: number) => {
    return statusMessages[status as keyof typeof statusMessages] || 'ไม่ทราบสถานะ';
  }, []);

  return {
    currentStatus,
    isProcessing,
    showPopup,
    error,
    isCompleted,
    startLiftProcess,
    handleStatusUpdate,
    closePopup,
    resetStatus,
    getStatusMessage
  };
};
