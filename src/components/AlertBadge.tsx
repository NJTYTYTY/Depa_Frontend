/**
 * Alert Badge Component
 * แสดงเครื่องหมายตกใจสีแดงสำหรับ alert notifications
 */

import React, { useState, useEffect } from 'react';
import { useAlerts } from '@/hooks/use-alerts';

interface AlertBadgeProps {
  pondId: number;
  userId: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  onClick?: () => void;
}

const AlertBadge: React.FC<AlertBadgeProps> = ({
  pondId,
  userId,
  className = '',
  size = 'md',
  showCount = true,
  onClick
}) => {
  const { getPondBadgeCount, isLoading } = useAlerts();
  const [badgeCount, setBadgeCount] = useState(0);
  const [hasAlerts, setHasAlerts] = useState(false);

  useEffect(() => {
    const fetchBadgeCount = async () => {
      try {
        const result = await getPondBadgeCount(pondId);
        if (result && result.success) {
          setBadgeCount(result.unread_count || 0);
          setHasAlerts(result.has_alerts || false);
        }
      } catch (error) {
        console.error('Error fetching badge count:', error);
        // Set default values on error
        setBadgeCount(0);
        setHasAlerts(false);
      }
    };

    // Only fetch if pondId is valid
    if (pondId && pondId > 0) {
      fetchBadgeCount();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchBadgeCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [pondId, getPondBadgeCount]);

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base'
  };

  // Don't render if no alerts or still loading
  if (isLoading || !hasAlerts || badgeCount === 0) {
    return null;
  }

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        bg-red-500 text-white rounded-full
        ${sizeClasses[size]}
        ${className}
        ${onClick ? 'cursor-pointer hover:bg-red-600 transition-colors' : ''}
        animate-pulse
      `}
      onClick={onClick}
      title={`มี ${badgeCount} แจ้งเตือนที่ยังไม่อ่าน`}
    >
      {showCount && badgeCount > 0 && (
        <span className="font-bold">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
      
      {!showCount && (
        <span className="text-lg">⚠️</span>
      )}
      
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
    </div>
  );
};

export default AlertBadge;
