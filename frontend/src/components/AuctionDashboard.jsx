import { useState, useEffect } from 'react';
import AuctionCard from './AuctionCard';
import socket from '../utils/socket';
import { getTimeRemaining } from '../utils/timeSync';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AuctionDashboard({ userId }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial items from API
    useEffect(() => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setItems(data.data);
                } else {
                    setError('Failed to load items');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching items:', err);
                setError('Failed to connect to server');
                setLoading(false);
            });
    }, []);

    // Listen for real-time bid updates
    useEffect(() => {
        const handleBidUpdate = (data) => {
            console.log('Bid update received:', data);

            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === data.itemId
                        ? { ...item, currentBid: data.newBid, currentBidder: data.bidderId }
                        : item
                )
            );
        };

        const handleBidError = (data) => {
            console.error('Bid error:', data);
            alert(`Bid failed: ${data.error}`);
        };

        socket.on('UPDATE_BID', handleBidUpdate);
        socket.on('BID_ERROR', handleBidError);

        return () => {
            socket.off('UPDATE_BID', handleBidUpdate);
            socket.off('BID_ERROR', handleBidError);
        };
    }, []);

    if (loading) {
        return <div className="loading">Loading auctions...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="auction-dashboard">
            <h1>Live Auction Platform</h1>
            <p className="subtitle">Place your bids in real-time!</p>

            <div className="items-grid">
                {items.map(item => (
                    <AuctionCard
                        key={item.id}
                        item={item}
                        userId={userId}
                    />
                ))}
            </div>
        </div>
    );
}

export default AuctionDashboard;
