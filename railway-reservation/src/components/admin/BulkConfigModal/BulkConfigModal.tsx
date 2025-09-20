import React, { useState } from 'react';
import { bulkConfigureUnconfiguredTrains } from '../../../services/api/trainservice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCog, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface BulkConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    unconfiguredCount: number;
}

const BulkConfigModal: React.FC<BulkConfigModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    unconfiguredCount 
}) => {
    const [formData, setFormData] = useState({
        totalSeats: 100,
        sleeperRatio: 50,
        ac2Ratio: 30,
        ac1Ratio: 20
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseInt(value) || 0;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: numValue };
            
            // Auto-adjust ratios to maintain 100% total
            if (name.includes('Ratio')) {
                const totalRatio = newData.sleeperRatio + newData.ac2Ratio + newData.ac1Ratio;
                if (totalRatio !== 100) {
                    // Proportionally adjust other ratios
                    if (name !== 'sleeperRatio') {
                        const remaining = 100 - numValue;
                        const otherTotal = (name === 'ac2Ratio' ? newData.ac1Ratio : newData.ac2Ratio) + 
                                         (name === 'ac1Ratio' ? newData.ac2Ratio : newData.ac1Ratio);
                        if (otherTotal > 0) {
                            if (name === 'ac2Ratio') {
                                newData.sleeperRatio = Math.round(remaining * (newData.sleeperRatio / (newData.sleeperRatio + newData.ac1Ratio)));
                                newData.ac1Ratio = remaining - newData.sleeperRatio;
                            } else if (name === 'ac1Ratio') {
                                newData.sleeperRatio = Math.round(remaining * (newData.sleeperRatio / (newData.sleeperRatio + newData.ac2Ratio)));
                                newData.ac2Ratio = remaining - newData.sleeperRatio;
                            } else {
                                newData.ac2Ratio = Math.round(remaining * (newData.ac2Ratio / (newData.ac2Ratio + newData.ac1Ratio)));
                                newData.ac1Ratio = remaining - newData.ac2Ratio;
                            }
                        }
                    } else {
                        const remaining = 100 - numValue;
                        const otherTotal = newData.ac2Ratio + newData.ac1Ratio;
                        if (otherTotal > 0) {
                            newData.ac2Ratio = Math.round(remaining * (newData.ac2Ratio / otherTotal));
                            newData.ac1Ratio = remaining - newData.ac2Ratio;
                        }
                    }
                }
            }
            
            return newData;
        });
    };

    const calculateSeats = () => {
        const sleeperSeats = Math.floor((formData.totalSeats * formData.sleeperRatio) / 100);
        const ac2Seats = Math.floor((formData.totalSeats * formData.ac2Ratio) / 100);
        const ac1Seats = Math.floor((formData.totalSeats * formData.ac1Ratio) / 100);
        const remaining = formData.totalSeats - (sleeperSeats + ac2Seats + ac1Seats);
        
        return {
            sleeper: sleeperSeats + remaining, // Add remaining to sleeper
            ac2: ac2Seats,
            ac1: ac1Seats
        };
    };

    const isValidRatio = () => {
        const total = formData.sleeperRatio + formData.ac2Ratio + formData.ac1Ratio;
        return total === 100;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isValidRatio()) {
            setError('Seat class ratios must sum to 100%');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const result = await bulkConfigureUnconfiguredTrains(
                formData.totalSeats,
                formData.sleeperRatio,
                formData.ac2Ratio,
                formData.ac1Ratio
            );
            setResult(result);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (error: any) {
            setError(error.response?.data || 'Failed to configure trains');
        } finally {
            setLoading(false);
        }
    };

    const seats = calculateSeats();
    const totalRatio = formData.sleeperRatio + formData.ac2Ratio + formData.ac1Ratio;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                                <FontAwesomeIcon icon={faCog} />
                                Bulk Configure Trains
                            </h2>
                            <p className="text-blue-700 mt-1">
                                Configure seat classes for {unconfiguredCount} unconfigured trains
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {result ? (
                        <div className="text-center p-8">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-16 h-16 text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-green-700 mb-2">Configuration Complete!</h3>
                            <p className="text-gray-600">{result}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Total Seats */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Seats per Train
                                </label>
                                <input
                                    type="number"
                                    name="totalSeats"
                                    value={formData.totalSeats}
                                    onChange={handleInputChange}
                                    min="10"
                                    max="500"
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Seat Class Ratios */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Seat Class Distribution
                                </label>
                                
                                <div className="space-y-4">
                                    {/* Sleeper Class */}
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-green-800">Sleeper Class</span>
                                            <span className="text-sm text-green-600">{seats.sleeper} seats</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                name="sleeperRatio"
                                                value={formData.sleeperRatio}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                className="w-20 px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-600">%</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="bg-green-500 h-3 rounded-full transition-all"
                                                    style={{ width: `${formData.sleeperRatio}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-green-600">
                                            Default Price: ₹300
                                        </div>
                                    </div>

                                    {/* AC2 Class */}
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-yellow-800">AC 2-Tier</span>
                                            <span className="text-sm text-yellow-600">{seats.ac2} seats</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                name="ac2Ratio"
                                                value={formData.ac2Ratio}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                className="w-20 px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                                            />
                                            <span className="text-sm text-gray-600">%</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="bg-yellow-500 h-3 rounded-full transition-all"
                                                    style={{ width: `${formData.ac2Ratio}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-yellow-600">
                                            Default Price: ₹700
                                        </div>
                                    </div>

                                    {/* AC1 Class */}
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-purple-800">AC 1-Tier</span>
                                            <span className="text-sm text-purple-600">{seats.ac1} seats</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                name="ac1Ratio"
                                                value={formData.ac1Ratio}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="100"
                                                className="w-20 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-gray-600">%</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                <div 
                                                    className="bg-purple-500 h-3 rounded-full transition-all"
                                                    style={{ width: `${formData.ac1Ratio}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-purple-600">
                                            Default Price: ₹1,300
                                        </div>
                                    </div>
                                </div>

                                {/* Ratio Validation */}
                                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                                    totalRatio === 100 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-red-50 text-red-700'
                                }`}>
                                    <FontAwesomeIcon icon={
                                        totalRatio === 100 ? faCheckCircle : faExclamationTriangle
                                    } />
                                    <span>
                                        Total ratio: {totalRatio}% 
                                        {totalRatio === 100 ? ' ✓' : ' (Must be 100%)'}
                                    </span>
                                </div>
                            </div>

                            {/* Revenue Estimate */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2">Revenue Estimate per Train</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-green-600">Sleeper: </span>
                                        ₹{(seats.sleeper * 300).toLocaleString()}
                                    </div>
                                    <div>
                                        <span className="text-yellow-600">AC2: </span>
                                        ₹{(seats.ac2 * 700).toLocaleString()}
                                    </div>
                                    <div>
                                        <span className="text-purple-600">AC1: </span>
                                        ₹{(seats.ac1 * 1300).toLocaleString()}
                                    </div>
                                </div>
                                <div className="mt-2 font-bold text-blue-700">
                                    Total: ₹{((seats.sleeper * 300) + (seats.ac2 * 700) + (seats.ac1 * 1300)).toLocaleString()}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !isValidRatio()}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Configuring...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faCog} />
                                            Configure {unconfiguredCount} Trains
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkConfigModal;
