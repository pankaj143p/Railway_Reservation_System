import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  show 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for animation to complete
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ⓘ';
    }
  };

  return (
    <ToastContainer className={`toast toast-${type} ${isVisible ? 'show' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={() => {
          setIsVisible(false);
          if (onClose) {
            setTimeout(onClose, 300);
          }
        }}
      >
        ×
      </button>
    </ToastContainer>
  );
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${slideIn} 0.3s ease-out;
  backdrop-filter: blur(10px);

  &.toast-success {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }

  &.toast-error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
  }

  &.toast-warning {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }

  &.toast-info {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }

  .toast-icon {
    font-size: 18px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  }

  .toast-message {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
  }

  .toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &:not(.show) {
    animation: ${slideOut} 0.3s ease-in;
  }
`;

export default Toast;
