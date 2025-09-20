import React, { useState, useEffect } from 'react';
import { getTrainSeatOverview } from '../../../services/api/trainservice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faChartBar, faCog, faTrainSubway } from '@fortawesome/free-solid-svg-icons';

interface TrainSeatOverview {
    trainId: number;
    trainName: string;
    source: string;
    destination: string;
    totalSeats: number;
    sleeperSeats: number;
    ac2Seats: number;
    ac1Seats: number;
    sleeperPrice: number;
    ac2Price: number;
    ac1Price: number;
    isConfigured: boolean;
    sleeperRatio: number;
    ac2Ratio: number;
    ac1Ratio: number;
    maxSleeperRevenue: number;
    maxAc2Revenue: number;
    maxAc1Revenue: number;
    maxTotalRevenue: number;
}

const SeatOverviewDashboard: React.FC = () => {
    const [trainOverview, setTrainOverview] = useState<TrainSeatOverview[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<keyof TrainSeatOverview>('trainId');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterConfigured, setFilterConfigured] = useState<'all' | 'configured' | 'unconfigured'>('all');

    useEffect(() => {
        loadOverview();
    }, []);

    const loadOverview = async () => {
        setLoading(true);
        try {
            const data = await getTrainSeatOverview();
            setTrainOverview(data);
        } catch (error) {
            console.error('Failed to load train seat overview:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field: keyof TrainSeatOverview) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const filteredAndSortedData = React.useMemo(() => {
        let filtered = trainOverview;

        // Apply filter
        if (filterConfigured === 'configured') {
            filtered = filtered.filter(train => train.isConfigured);
        } else if (filterConfigured === 'unconfigured') {
            filtered = filtered.filter(train => !train.isConfigured);
        }

        // Apply sort
        return filtered.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc' 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            return 0;
        });
    }, [trainOverview, sortBy, sortOrder, filterConfigured]);

    const statistics = React.useMemo(() => {
        const configured = trainOverview.filter(t => t.isConfigured).length;
        const unconfigured = trainOverview.length - configured;
        const totalRevenuePotential = trainOverview.reduce((sum, train) => sum + (train.maxTotalRevenue || 0), 0);
        const avgSeatsPerTrain = trainOverview.length > 0 
            ? trainOverview.reduce((sum, train) => sum + train.totalSeats, 0) / trainOverview.length 
            : 0;

        return {
            totalTrains: trainOverview.length,
            configured,
            unconfigured,
            configurationPercentage: trainOverview.length > 0 ? (configured / trainOverview.length * 100).toFixed(1) : 0,
            totalRevenuePotential,
            avgSeatsPerTrain: Math.round(avgSeatsPerTrain)
        };
    }, [trainOverview]);

    const SortableHeader: React.FC<{ field: keyof TrainSeatOverview; children: React.ReactNode }> = ({ field, children }) => (
        <th 
            className="p-3 text-left cursor-pointer hover:bg-blue-100 transition"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-2">
                {children}
                {sortBy === field && (
                    <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                )}
            </div>
        </th>
    );

    if (loading && trainOverview.length === 0) {
        return (
            <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen flex items-center justify-center">
                <div className="text-blue-900 text-lg">Loading seat overview...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
                            <FontAwesomeIcon icon={faTrainSubway} />
                            Seat Configuration Overview
                        </h1>
                        <p className="text-blue-700 mt-2">Manage seat classes and pricing across all trains</p>
                    </div>
                    <button
                        onClick={loadOverview}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white/70 backdrop-blur-lg p-4 rounded-xl border border-white/40">
                        <h3 className="text-sm font-medium text-gray-600">Total Trains</h3>
                        <p className="text-2xl font-bold text-blue-600">{statistics.totalTrains}</p>
                    </div>
                    <div className="bg-green-50/70 backdrop-blur-lg p-4 rounded-xl border border-white/40">
                        <h3 className="text-sm font-medium text-green-700">Configured</h3>
                        <p className="text-2xl font-bold text-green-600">{statistics.configured}</p>
                        <p className="text-xs text-green-500">{statistics.configurationPercentage}% of total</p>
                    </div>
                    <div className="bg-yellow-50/70 backdrop-blur-lg p-4 rounded-xl border border-white/40">
                        <h3 className="text-sm font-medium text-yellow-700">Unconfigured</h3>
                        <p className="text-2xl font-bold text-yellow-600">{statistics.unconfigured}</p>
                    </div>
                    <div className="bg-purple-50/70 backdrop-blur-lg p-4 rounded-xl border border-white/40">
                        <h3 className="text-sm font-medium text-purple-700">Avg Seats/Train</h3>
                        <p className="text-2xl font-bold text-purple-600">{statistics.avgSeatsPerTrain}</p>
                    </div>
                    <div className="bg-indigo-50/70 backdrop-blur-lg p-4 rounded-xl border border-white/40">
                        <h3 className="text-sm font-medium text-indigo-700">Revenue Potential</h3>
                        <p className="text-xl font-bold text-indigo-600">₹{statistics.totalRevenuePotential.toLocaleString()}</p>
                        <p className="text-xs text-indigo-500">Maximum per day</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center">
                    <label className="text-sm font-medium text-blue-900">Filter:</label>
                    <select
                        value={filterConfigured}
                        onChange={(e) => setFilterConfigured(e.target.value as any)}
                        className="px-3 py-2 border rounded-lg bg-white/70 backdrop-blur-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Trains</option>
                        <option value="configured">Configured Only</option>
                        <option value="unconfigured">Unconfigured Only</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white/70 backdrop-blur-lg rounded-xl border border-white/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-50/80">
                            <tr>
                                <SortableHeader field="trainId">ID</SortableHeader>
                                <SortableHeader field="trainName">Train Name</SortableHeader>
                                <SortableHeader field="source">Route</SortableHeader>
                                <SortableHeader field="totalSeats">Total Seats</SortableHeader>
                                <th className="p-3 text-left">Seat Distribution</th>
                                <th className="p-3 text-left">Pricing</th>
                                <SortableHeader field="maxTotalRevenue">Max Revenue</SortableHeader>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedData.map((train, idx) => (
                                <tr key={train.trainId} className={`hover:bg-blue-50/50 transition ${idx % 2 === 0 ? 'bg-white/20' : 'bg-blue-50/20'}`}>
                                    <td className="p-3 font-medium text-blue-900">{train.trainId}</td>
                                    <td className="p-3">
                                        <div className="font-medium">{train.trainName}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-sm">
                                            <div>{train.source} → {train.destination}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium">{train.totalSeats}</td>
                                    <td className="p-3">
                                        {train.isConfigured ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs">
                                                    <span className="w-16">Sleeper:</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${train.sleeperRatio}%` }}></div>
                                                    </div>
                                                    <span className="w-8 text-right">{train.sleeperSeats}</span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <span className="w-16">AC2:</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${train.ac2Ratio}%` }}></div>
                                                    </div>
                                                    <span className="w-8 text-right">{train.ac2Seats}</span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <span className="w-16">AC1:</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${train.ac1Ratio}%` }}></div>
                                                    </div>
                                                    <span className="w-8 text-right">{train.ac1Seats}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Not configured</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {train.isConfigured ? (
                                            <div className="text-xs space-y-1">
                                                <div className="text-green-600">S: ₹{train.sleeperPrice}</div>
                                                <div className="text-yellow-600">AC2: ₹{train.ac2Price}</div>
                                                <div className="text-purple-600">AC1: ₹{train.ac1Price}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {train.isConfigured ? (
                                            <div className="font-medium text-blue-600">
                                                ₹{train.maxTotalRevenue?.toLocaleString() || 0}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            train.isConfigured 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {train.isConfigured ? 'Configured' : 'Needs Setup'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAndSortedData.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <FontAwesomeIcon icon={faChartBar} className="w-12 h-12 mb-4 opacity-50" />
                        <p>No trains found matching the current filter.</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-blue-50/70 backdrop-blur-lg rounded-xl border border-white/40">
                <h3 className="font-medium text-blue-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <FontAwesomeIcon icon={faCog} />
                        Bulk Configure Unconfigured Trains
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        Export Configuration Report
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                        Revenue Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatOverviewDashboard;
