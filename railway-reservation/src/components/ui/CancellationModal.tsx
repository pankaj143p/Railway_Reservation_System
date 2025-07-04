import React from 'react';
import { CancellationResponse } from '../../services/api/cancellationService';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  ticketNumber?: string;
  trainName?: string;
  amount?: number;
  isLoading?: boolean;
  cancellationResult?: CancellationResponse | null;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ticketNumber,
  trainName,
  amount,
  isLoading = false,
  cancellationResult
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mx-4 border border-white/40">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close"
          disabled={isLoading}
        >
          &times;
        </button>

        {!cancellationResult ? (
          // Confirmation Step
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Ticket?</h3>
              <p className="text-gray-600 text-sm">This action cannot be undone</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket Number:</span>
                <span className="font-medium">{ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Train:</span>
                <span className="font-medium">{trainName}</span>
              </div>
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-green-600">₹{amount}</span>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Cancellation Policy:</strong> A 20% cancellation fee will be deducted from your refund amount. 
                You will receive 80% of the original payment. Refund will be processed automatically 
                and credited to your original payment method within 5-7 business days.
              </p>
              {amount && (
                <div className="mt-2 text-xs text-yellow-700">
                  <div className="flex justify-between">
                    <span>Original Amount:</span>
                    <span>₹{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation Fee (20%):</span>
                    <span>-₹{(amount * 0.20).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                    <span>Refund Amount:</span>
                    <span>₹{(amount * 0.80).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition disabled:opacity-50"
              >
                Keep Ticket
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Cancel Ticket'
                )}
              </button>
            </div>
          </div>
        ) : (
          // Result Step
          <div className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              cancellationResult.refundProcessed ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {cancellationResult.refundProcessed ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {cancellationResult.refundProcessed ? 'Ticket Cancelled' : 'Cancellation Complete'}
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3 text-sm text-left">
              <p className="text-gray-700">{cancellationResult.message}</p>
              
              {cancellationResult.refundProcessed && (
                <>
                  <div className="border-t pt-3 space-y-2">
                    {cancellationResult.originalAmount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Amount:</span>
                        <span className="font-medium">₹{cancellationResult.originalAmount}</span>
                      </div>
                    )}
                    {cancellationResult.cancellationFee && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cancellation Fee (20%):</span>
                        <span className="font-medium text-red-600">-₹{cancellationResult.cancellationFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-semibold">Refund Amount:</span>
                      <span className="font-bold text-green-600">₹{cancellationResult.refundAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refund Status:</span>
                      <span className={`font-medium ${
                        cancellationResult.refundStatus === 'INITIATED' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {cancellationResult.refundStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Time:</span>
                      <span className="font-medium">{cancellationResult.expectedRefundTime}</span>
                    </div>
                    {cancellationResult.refundId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Refund ID:</span>
                        <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                          {cancellationResult.refundId}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {cancellationResult.refundProcessed && cancellationResult.refundStatus === 'INITIATED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm">
                  ✅ Your refund has been initiated and will be credited to your original payment method.
                </p>
              </div>
            )}

            {cancellationResult.refundStatus === 'FAILED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">
                  ❌ Refund processing failed. Please contact our support team for assistance.
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationModal;
