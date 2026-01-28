import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import MaxBidModal from './MaxBidModal';
import socket from '../utils/socket';
import { getTimeRemaining } from '../utils/timeSync';

function AuctionCard({ item, userId }) {
    const [isMyBid, setIsMyBid] = useState(false);
    const [wasOutbid, setWasOutbid] = useState(false);
    const [showMaxBidModal, setShowMaxBidModal] = useState(false);
    const [autoBidActive, setAutoBidActive] = useState(false);
    const [maxBidAmount, setMaxBidAmount] = useState(null);

    useEffect(() => {
        socket.on('MAX_BID_SET', (data) => {
            if (data.itemId === item.id) {
                setAutoBidActive(true);
                setMaxBidAmount(data.maxBid);
            }
        });

        socket.on('AUTO_BID_PLACED', (data) => {
            if (data.itemId === item.id) {
                console.log('Auto-bid placed:', data.message);
            }
        });

        socket.on('MAX_BID_REACHED', (data) => {
            if (data.itemId === item.id) {
                setAutoBidActive(false);
                alert(data.message);
            }
        });

        socket.on('MAX_BID_CANCELLED', (data) => {
            if (data.itemId === item.id) {
                setAutoBidActive(false);
                setMaxBidAmount(null);
            }
        });

        return () => {
            socket.off('MAX_BID_SET');
            socket.off('AUTO_BID_PLACED');
            socket.off('MAX_BID_REACHED');
            socket.off('MAX_BID_CANCELLED');
        };
    }, [item.id]);

    const handleBid = () => {
        const remaining = getTimeRemaining(item.auctionEndTime);
        if (remaining <= 0) {
            alert('Auction has ended!');
            return;
        }

        const newBidAmount = item.currentBid + 10;

        socket.emit('BID_PLACED', {
            itemId: item.id,
            bidAmount: newBidAmount,
            bidderId: userId
        });

        setIsMyBid(true);
        setWasOutbid(false);
    };

    const handleCancelMaxBid = () => {
        socket.emit('CANCEL_MAX_BID', {
            itemId: item.id,
            bidderId: userId
        });
        setAutoBidActive(false);
        setMaxBidAmount(null);
    };

    const isWinning = item.currentBidder === userId;

    if (isMyBid && !isWinning && item.currentBidder !== null) {
        setWasOutbid(true);
        setIsMyBid(false);
    }

    return (
        <div className="auction-card">
            <img src={item.image} alt={item.title} className="item-image" />

            <div className="item-info">
                <h3>{item.title}</h3>
                <p className="description">{item.description}</p>

                <div className="price-section">
                    <div className="current-price">
                        <span className="label">Current Bid:</span>
                        <span className="price">${item.currentBid}</span>
                    </div>

                    <CountdownTimer endTime={item.auctionEndTime} />
                </div>

                {isWinning && (
                    <div className="status-badge winning">
                        ✓ You are winning!
                    </div>
                )}

                {wasOutbid && (
                    <div className="status-badge outbid">
                        Outbid
                    </div>
                )}

                {autoBidActive && (
                    <div className="status-badge auto-bid">
                        🤖 Auto-bid active (Max: ${maxBidAmount})
                    </div>
                )}

                <div className="button-group">
                    <button
                        className="bid-button"
                        onClick={handleBid}
                        disabled={getTimeRemaining(item.auctionEndTime) <= 0}
                    >
                        Bid +$10
                    </button>

                    {!autoBidActive ? (
                        <button
                            className="max-bid-button"
                            onClick={() => setShowMaxBidModal(true)}
                            disabled={getTimeRemaining(item.auctionEndTime) <= 0}
                        >
                            Set Max Bid
                        </button>
                    ) : (
                        <button
                            className="cancel-max-bid-button"
                            onClick={handleCancelMaxBid}
                        >
                            Cancel Auto-Bid
                        </button>
                    )}
                </div>
            </div>

            {showMaxBidModal && (
                <MaxBidModal
                    item={item}
                    userId={userId}
                    onClose={() => setShowMaxBidModal(false)}
                />
            )}
        </div>
    );
}

export default AuctionCard;
