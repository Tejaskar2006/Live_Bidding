import { useState, useEffect } from 'react';
import socket from '../utils/socket';
import './Analytics.css';

function Analytics({ userId }) {
    const [analytics, setAnalytics] = useState({
        totalBids: 0,
        totalBidders: 0,
        activeAuctions: 0,
        recentActivity: []
    });

    useEffect(() => {
        socket.on('ANALYTICS_UPDATE', (data) => {
            setAnalytics(data);
        });

        return () => {
            socket.off('ANALYTICS_UPDATE');
        };
    }, []);

    return (
        <div className="analytics-panel">
            <h2>Live Analytics</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{analytics.totalBids}</div>
                    <div className="stat-label">Total Bids</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{analytics.totalBidders}</div>
                    <div className="stat-label">Active Bidders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{analytics.activeAuctions}</div>
                    <div className="stat-label">Active Auctions</div>
                </div>
            </div>

            <div className="activity-feed">
                <h3>Recent Activity</h3>
                {analytics.recentActivity.length === 0 ? (
                    <p className="no-activity">No bids yet. Be the first!</p>
                ) : (
                    <div className="activity-list">
                        {analytics.recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <span className="activity-icon">💰</span>
                                <div className="activity-details">
                                    <span className="activity-text">
                                        <strong>{activity.bidderId === userId ? 'You' : `User ${activity.bidderId.slice(0, 6)}`}</strong>
                                        {' '}bid <strong>${activity.amount}</strong> on{' '}
                                        <strong>{activity.itemTitle}</strong>
                                    </span>
                                    <span className="activity-time">
                                        {new Date(activity.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics;
