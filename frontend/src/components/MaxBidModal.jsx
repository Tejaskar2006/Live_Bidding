import { useState, useEffect } from 'react';
import socket from '../utils/socket';
import './MaxBidModal.css';

function MaxBidModal({ item, userId, onClose }) {
    const [maxBid, setMaxBid] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSetMaxBid = () => {
        const maxBidAmount = parseInt(maxBid);

        if (isNaN(maxBidAmount) || maxBidAmount <= item.currentBid) {
            setError(`Max bid must be higher than current bid of $${item.currentBid}`);
            return;
        }

        socket.emit('SET_MAX_BID', {
            itemId: item.id,
            maxBid: maxBidAmount,
            bidderId: userId
        });

        setSuccess(`Auto-bid activated! Max: $${maxBidAmount}`);
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Set Auto-Bid for {item.title}</h3>
                <p className="modal-info">Current bid: ${item.currentBid}</p>
                <p className="modal-description">
                    Set your maximum bid. The system will automatically bid for you
                    when others bid, up to your maximum amount.
                </p>

                <div className="input-group">
                    <label>Maximum Bid ($)</label>
                    <input
                        type="number"
                        value={maxBid}
                        onChange={(e) => setMaxBid(e.target.value)}
                        placeholder={`Minimum: $${item.currentBid + 10}`}
                        min={item.currentBid + 10}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="modal-actions">
                    <button onClick={handleSetMaxBid} className="btn-primary">
                        Activate Auto-Bid
                    </button>
                    <button onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MaxBidModal;
