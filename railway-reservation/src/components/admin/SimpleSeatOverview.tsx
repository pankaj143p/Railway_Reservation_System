import React, { useState, useEffect } from 'react';

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

const SimpleSeatOverview: React.FC = () => {
    const [trainOverview, setTrainOverview] = useState<TrainSeatOverview[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simple mock data for testing
        setTrainOverview([
            {
                trainId: 1,
                trainName: "Test Train",
                source: "Delhi",
                destination: "Mumbai",
                totalSeats: 100,
                sleeperSeats: 50,
                ac2Seats: 30,
                ac1Seats: 20,
                sleeperPrice: 300,
                ac2Price: 700,
                ac1Price: 1300,
                isConfigured: true,
                sleeperRatio: 50,
                ac2Ratio: 30,
                ac1Ratio: 20,
                maxSleeperRevenue: 15000,
                maxAc2Revenue: 21000,
                maxAc1Revenue: 26000,
                maxTotalRevenue: 62000
            }
        ]);
    }, []);

    if (loading) {
        return (
            <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen flex items-center justify-center">
                <div className="text-blue-900 text-lg">Loading seat overview...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-blue-200 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-4">
                    🚆 Seat Configuration Overview
                </h1>
                <p className="text-blue-700">Manage seat classes and pricing across all trains</p>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-xl border border-white/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-50/80">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Train Name</th>
                                <th className="p-3 text-left">Route</th>
                                <th className="p-3 text-left">Total Seats</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainOverview.map((train, idx) => (
                                <tr key={train.trainId} className={`hover:bg-blue-50/50 transition ${idx % 2 === 0 ? 'bg-white/20' : 'bg-blue-50/20'}`}>
                                    <td className="p-3 font-medium text-blue-900">{train.trainId}</td>
                                    <td className="p-3">
                                        <div className="font-medium">{train.trainName}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-sm">
                                            {train.source} → {train.destination}
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium">{train.totalSeats}</td>
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
            </div>

            <div className="mt-6 p-4 bg-blue-50/70 backdrop-blur-lg rounded-xl border border-white/40">
                <h3 className="font-medium text-blue-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        ⚙️ Configure Trains
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                        📊 Export Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleSeatOverview;
