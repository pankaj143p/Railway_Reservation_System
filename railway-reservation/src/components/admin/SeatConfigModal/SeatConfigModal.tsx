import React, { useState, useEffect } from 'react';
import { Train, SeatClassConfig } from '../../../interfaces/Train';
import { 
    getSeatConfiguration, 
    updateSeatConfiguration, 
    resetSeatConfiguration,
    getSeatClassAnalytics
} from '../../../services/api/trainservice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSync, faSave, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Alert from '@mui/material/Alert';

interface SeatConfigModalProps {
    open: boolean;
    train: Train | null;
    onClose: () => void;
    onUpdate: () => void;
}

interface SeatAnalytics {
    trainId: number;
    trainName: string;
    date: string;
    totalSeats: number;
    sleeperSeats: number;
    ac2Seats: number;
    ac1Seats: number;
    sleeperPrice: number;
    ac2Price: number;
    ac1Price: number;
    sleeperRatio: number;
    ac2Ratio: number;
    ac1Ratio: number;
    maxSleeperRevenue: number;
    maxAc2Revenue: number;
    maxAc1Revenue: number;
}

const SeatConfigModal: React.FC<SeatConfigModalProps> = ({ open, train, onClose, onUpdate }) => {
    const [config, setConfig] = useState<SeatClassConfig>({
        sleeperSeats: 0,
        ac2Seats: 0,
        ac1Seats: 0,
        sleeperPrice: 300,
        ac2Price: 700,
        ac1Price: 1300
    });
    const [analytics, setAnalytics] = useState<SeatAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (open && train) {
            loadSeatConfiguration();
        }
    }, [open, train]);

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    const loadSeatConfiguration = async () => {
        if (!train) return;
        
        setLoading(true);
        try {
            const seatConfig = await getSeatConfiguration(train.trainId);
            setConfig({
                sleeperSeats: seatConfig.sleeperSeats || 0,
                ac2Seats: seatConfig.ac2Seats || 0,
                ac1Seats: seatConfig.ac1Seats || 0,
                sleeperPrice: seatConfig.sleeperPrice || 300,
                ac2Price: seatConfig.ac2Price || 700,
                ac1Price: seatConfig.ac1Price || 1300
            });
        } catch (error) {
            console.error('Failed to load seat configuration:', error);
            showAlert('error', 'Failed to load seat configuration');
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        if (!train) return;
        
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const analyticsData = await getSeatClassAnalytics(train.trainId, today);
            setAnalytics(analyticsData);
            setShowAnalytics(true);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            showAlert('error', 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!train) return;
        
        // Validate configuration
        const total = config.sleeperSeats + config.ac2Seats + config.ac1Seats;
        if (total === 0) {
            showAlert('error', 'Total seats cannot be zero');
            return;
        }

        setLoading(true);
        try {
            await updateSeatConfiguration(train.trainId, config);
            showAlert('success', 'Seat configuration updated successfully');
            onUpdate();
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error('Failed to update seat configuration:', error);
            showAlert('error', 'Failed to update seat configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!train) return;
        
        const totalSeats = train.totalSeats || 100;
        setLoading(true);
        try {
            const updatedTrain = await resetSeatConfiguration(train.trainId, totalSeats);
            setConfig({
                sleeperSeats: updatedTrain.sleeperSeats || Math.round(totalSeats * 0.5),
                ac2Seats: updatedTrain.ac2Seats || Math.round(totalSeats * 0.2),
                ac1Seats: updatedTrain.ac1Seats || Math.round(totalSeats * 0.3),
                sleeperPrice: 300,
                ac2Price: 700,
                ac1Price: 1300
            });
            showAlert('success', 'Reset to default configuration (50:20:30 ratio)');
        } catch (error) {
            console.error('Failed to reset configuration:', error);
            showAlert('error', 'Failed to reset configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleConfigChange = (field: keyof SeatClassConfig, value: number) => {
        setConfig(prev => ({
            ...prev,
            [field]: Math.max(0, value)
        }));
    };

    const calculateRatios = () => {
        const total = config.sleeperSeats + config.ac2Seats + config.ac1Seats;
        if (total === 0) return { sleeper: 0, ac2: 0, ac1: 0 };
        
        return {
            sleeper: (config.sleeperSeats / total * 100).toFixed(1),
            ac2: (config.ac2Seats / total * 100).toFixed(1),
            ac1: (config.ac1Seats / total * 100).toFixed(1)
        };
    };

    const calculateRevenue = () => {
        return {
            sleeper: config.sleeperSeats * config.sleeperPrice,
            ac2: config.ac2Seats * config.ac2Price,
            ac1: config.ac1Seats * config.ac1Price,
            total: (config.sleeperSeats * config.sleeperPrice) + 
                   (config.ac2Seats * config.ac2Price) + 
                   (config.ac1Seats * config.ac1Price)
        };
    };

    if (!open || !train) return null;

    const ratios = calculateRatios();
    const revenue = calculateRevenue();
    const totalSeats = config.sleeperSeats + config.ac2Seats + config.ac1Seats;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Seat Configuration</h2>
                            <p className="text-blue-100">
                                {train.trainName} (ID: {train.trainId}) • {train.source} → {train.destination}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/20 transition"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className="p-4 border-b">
                        <Alert severity={alert.type} onClose={() => setAlert(null)}>
                            {alert.message}
                        </Alert>
                    </div>
                )}

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {!showAnalytics ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Configuration Form */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Seat Configuration</h3>
                                
                                {/* Sleeper Class */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-green-800 mb-2">
                                        Sleeper Class ({ratios.sleeper}%)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={config.sleeperSeats}
                                                onChange={(e) => handleConfigChange('sleeperSeats', parseInt(e.target.value) || 0)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="Seats"
                                            />
                                            <span className="text-xs text-green-600">Seats</span>
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={config.sleeperPrice}
                                                onChange={(e) => handleConfigChange('sleeperPrice', parseInt(e.target.value) || 0)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="Price"
                                            />
                                            <span className="text-xs text-green-600">₹ per seat</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AC 2-Tier */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                                        AC 2-Tier ({ratios.ac2}%)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={config.ac2Seats}
                                                onChange={(e) => handleConfigChange('ac2Seats', parseInt(e.target.value) || 0)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                                                placeholder="Seats"
                                            />
                                            <span className="text-xs text-yellow-600">Seats</span>
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={config.ac2Price}
                                                onChange={(e) => handleConfigChange('ac2Price', parseInt(e.target.value) || 0)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                                                placeholder="Price"
                                            />
                                            <span className="text-xs text-yellow-600">₹ per seat</span>
                                        </div>
                                    </div>
                                </div>

                                {/* AC 1-Tier */}
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-purple-800 mb-2">
                                        AC 1-Tier ({ratios.ac1}%)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={config.ac1Seats}
                                                onChange={(e) => handleConfigChange('ac1Seats', parseInt(e.target.value) || 0)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="Seats"
                                            />
                                            <span className="text-xs text-purple-600">Seats</span>
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={config.ac1Price}
                                                onChange={(e) => handleConfigChange('ac1Price', parseInt(e.target.value) || 0)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                                placeholder="Price"
                                            />
                                            <span className="text-xs text-purple-600">₹ per seat</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuration Summary</h3>
                                
                                {/* Total Seats */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-2">Total Seats</h4>
                                    <p className="text-3xl font-bold text-blue-600">{totalSeats}</p>
                                </div>

                                {/* Revenue Potential */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-800 mb-3">Maximum Revenue Potential</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Sleeper:</span>
                                            <span className="font-medium">₹{revenue.sleeper.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-yellow-600">AC 2-Tier:</span>
                                            <span className="font-medium">₹{revenue.ac2.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-purple-600">AC 1-Tier:</span>
                                            <span className="font-medium">₹{revenue.ac1.toLocaleString()}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-blue-600">₹{revenue.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ratio Indicator */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-800 mb-3">Current Ratio</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-16 text-sm">Sleeper:</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full" 
                                                    style={{ width: `${ratios.sleeper}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-sm text-right">{ratios.sleeper}%</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-16 text-sm">AC2:</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                                <div 
                                                    className="bg-yellow-500 h-2 rounded-full" 
                                                    style={{ width: `${ratios.ac2}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-sm text-right">{ratios.ac2}%</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-16 text-sm">AC1:</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                                <div 
                                                    className="bg-purple-500 h-2 rounded-full" 
                                                    style={{ width: `${ratios.ac1}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-sm text-right">{ratios.ac1}%</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Recommended ratio: Sleeper 50%, AC2 20%, AC1 30%
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Analytics View
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-800">Seat Class Analytics</h3>
                                <button
                                    onClick={() => setShowAnalytics(false)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Back to Configuration
                                </button>
                            </div>
                            
                            {analytics && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-green-800">Sleeper Class</h4>
                                        <p className="text-2xl font-bold text-green-600">{analytics.sleeperSeats} seats</p>
                                        <p className="text-sm text-green-600">₹{analytics.sleeperPrice} per seat</p>
                                        <p className="text-sm text-green-600">Max Revenue: ₹{analytics.maxSleeperRevenue}</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-yellow-800">AC 2-Tier</h4>
                                        <p className="text-2xl font-bold text-yellow-600">{analytics.ac2Seats} seats</p>
                                        <p className="text-sm text-yellow-600">₹{analytics.ac2Price} per seat</p>
                                        <p className="text-sm text-yellow-600">Max Revenue: ₹{analytics.maxAc2Revenue}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-purple-800">AC 1-Tier</h4>
                                        <p className="text-2xl font-bold text-purple-600">{analytics.ac1Seats} seats</p>
                                        <p className="text-sm text-purple-600">₹{analytics.ac1Price} per seat</p>
                                        <p className="text-sm text-purple-600">Max Revenue: ₹{analytics.maxAc1Revenue}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 border-t flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={loadAnalytics}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faChartBar} />
                            Analytics
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSync} />
                            Reset to Default
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || totalSeats === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            {loading ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatConfigModal;
