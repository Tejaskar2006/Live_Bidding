const lockManager = require('../utils/lockManager');
const { getItemById, updateItemBid, setMaxBid, getMaxBid, removeMaxBid, getGlobalAnalytics } = require('../data/items');

function setupBidHandlers(io) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Send server time to client for synchronization
        socket.emit('SERVER_TIME', {
            serverTime: new Date().toISOString()
        });

        socket.on('BID_PLACED', async (data) => {
            const { itemId, bidAmount, bidderId } = data;

            console.log(`Bid received: Item ${itemId}, Amount $${bidAmount}, Bidder ${bidderId || socket.id}`);

            try {
                await lockManager.acquireLock(itemId);

                const item = getItemById(itemId);

                if (!item) {
                    socket.emit('BID_ERROR', {
                        itemId,
                        error: 'Item not found'
                    });
                    return;
                }

                // Check if auction has ended
                const now = new Date();
                const endTime = new Date(item.auctionEndTime);
                if (now >= endTime) {
                    socket.emit('BID_ERROR', {
                        itemId,
                        error: 'Auction has ended'
                    });
                    return;
                }

                // Validate bid amount (must be higher than current bid)
                if (bidAmount <= item.currentBid) {
                    // Check if this is a race condition scenario (same bid amount)
                    const isOutbid = bidAmount === item.currentBid;

                    socket.emit('BID_ERROR', {
                        itemId,
                        error: isOutbid
                            ? `Outbid! Another user placed the same bid first. Current bid is $${item.currentBid}`
                            : `Bid must be higher than current bid of $${item.currentBid}`,
                        currentBid: item.currentBid,
                        isOutbid: isOutbid
                    });

                    console.log(`Bid rejected: Item ${itemId}, Attempted $${bidAmount}, Current $${item.currentBid} ${isOutbid ? '(OUTBID - Race condition)' : ''}`);
                    return;
                }

                const actualBidderId = bidderId || socket.id;
                const success = updateItemBid(itemId, bidAmount, actualBidderId);

                if (success) {
                    io.emit('UPDATE_BID', {
                        itemId,
                        newBid: bidAmount,
                        bidderId: actualBidderId,
                        timestamp: new Date().toISOString()
                    });

                    console.log(`Bid accepted: Item ${itemId}, New price $${bidAmount}`);

                    await processAutoBids(io, itemId, bidAmount, actualBidderId);

                    io.emit('ANALYTICS_UPDATE', getGlobalAnalytics());
                } else {
                    socket.emit('BID_ERROR', {
                        itemId,
                        error: 'Failed to update bid'
                    });
                }

            } catch (error) {
                console.error('Error processing bid:', error);
                socket.emit('BID_ERROR', {
                    itemId,
                    error: 'Server error processing bid'
                });
            } finally {
                lockManager.releaseLock(itemId);
            }
        });

        socket.on('SET_MAX_BID', async (data) => {
            const { itemId, maxBid, bidderId } = data;
            const actualBidderId = bidderId || socket.id;

            console.log(`Max bid set: Item ${itemId}, Max $${maxBid}, Bidder ${actualBidderId}`);

            const item = getItemById(itemId);
            if (!item) {
                socket.emit('MAX_BID_ERROR', { itemId, error: 'Item not found' });
                return;
            }

            if (maxBid <= item.currentBid) {
                socket.emit('MAX_BID_ERROR', {
                    itemId,
                    error: `Max bid must be higher than current bid of $${item.currentBid}`
                });
                return;
            }

            setMaxBid(itemId, actualBidderId, maxBid);

            socket.emit('MAX_BID_SET', {
                itemId,
                maxBid,
                message: `Auto-bid activated with max $${maxBid}`
            });

            await processAutoBids(io, itemId, item.currentBid, actualBidderId);
        });

        socket.on('CANCEL_MAX_BID', (data) => {
            const { itemId, bidderId } = data;
            const actualBidderId = bidderId || socket.id;

            removeMaxBid(itemId, actualBidderId);


            socket.emit('MAX_BID_CANCELLED', {
                itemId,
                message: 'Auto-bid cancelled'
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

async function processAutoBids(io, itemId, currentBid, excludeBidderId) {
    const item = getItemById(itemId);
    if (!item) return;

    const maxBidders = Object.entries(item.maxBids)
        .filter(([bidderId]) => bidderId !== excludeBidderId)
        .sort(([, maxA], [, maxB]) => maxB - maxA);

    if (maxBidders.length === 0) return;

    const [highestBidderId, highestMaxBid] = maxBidders[0];

    if (highestMaxBid > currentBid) {
        const newBid = currentBid + 10;

        if (newBid <= highestMaxBid) {
            await lockManager.acquireLock(itemId);

            try {
                updateItemBid(itemId, newBid, highestBidderId);

                io.emit('UPDATE_BID', {
                    itemId,
                    newBid,
                    bidderId: highestBidderId,
                    timestamp: new Date().toISOString(),
                    isAutoBid: true
                });

                io.to(highestBidderId).emit('AUTO_BID_PLACED', {
                    itemId,
                    bidAmount: newBid,
                    maxBid: highestMaxBid,
                    message: `Auto-bid placed: $${newBid}`
                });

                console.log(`Auto-bid placed: Item ${itemId}, $${newBid} by ${highestBidderId}`);

                io.emit('ANALYTICS_UPDATE', getGlobalAnalytics());
            } finally {
                lockManager.releaseLock(itemId);
            }
        } else {
            io.to(highestBidderId).emit('MAX_BID_REACHED', {
                itemId,
                maxBid: highestMaxBid,
                currentBid,
                message: `Auto-bid stopped - max bid of $${highestMaxBid} reached`
            });

            removeMaxBid(itemId, highestBidderId);
        }
    }
}

module.exports = setupBidHandlers;
