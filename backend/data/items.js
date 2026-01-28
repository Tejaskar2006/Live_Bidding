const items = [
    {
        id: '1',
        title: 'Vintage Camera',
        description: 'Classic 35mm film camera in excellent condition',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
        startingPrice: 50,
        currentBid: 50,
        currentBidder: null,
        auctionEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        bidHistory: [],
        maxBids: {},
        analytics: {
            totalBids: 0,
            uniqueBidders: new Set(),
            bidTimeline: []
        }
    },
    {
        id: '2',
        title: 'Mechanical Keyboard',
        description: 'RGB mechanical gaming keyboard with cherry MX switches',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        startingPrice: 80,
        currentBid: 80,
        currentBidder: null,
        auctionEndTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        bidHistory: [],
        maxBids: {},
        analytics: { totalBids: 0, uniqueBidders: new Set(), bidTimeline: [] }
    },
    {
        id: '3',
        title: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        startingPrice: 120,
        currentBid: 120,
        currentBidder: null,
        auctionEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        bidHistory: [],
        maxBids: {},
        analytics: { totalBids: 0, uniqueBidders: new Set(), bidTimeline: [] }
    },
    {
        id: '4',
        title: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        startingPrice: 150,
        currentBid: 150,
        currentBidder: null,
        auctionEndTime: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(),
        bidHistory: [],
        maxBids: {},
        analytics: { totalBids: 0, uniqueBidders: new Set(), bidTimeline: [] }
    },
    {
        id: '5',
        title: 'Portable Speaker',
        description: 'Waterproof Bluetooth speaker with 12-hour battery',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        startingPrice: 60,
        currentBid: 60,
        currentBidder: null,
        auctionEndTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        bidHistory: [],
        maxBids: {},
        analytics: { totalBids: 0, uniqueBidders: new Set(), bidTimeline: [] }
    },
    {
        id: '6',
        title: 'Gaming Mouse',
        description: 'High-precision gaming mouse with programmable buttons',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
        startingPrice: 40,
        currentBid: 40,
        currentBidder: null,
        auctionEndTime: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
        bidHistory: [],
        maxBids: {},
        analytics: { totalBids: 0, uniqueBidders: new Set(), bidTimeline: [] }
    }
];

function getAllItems() {
    return items;
}

function getItemById(itemId) {
    return items.find(item => item.id === itemId) || null;
}


function updateItemBid(itemId, newBid, bidderId) {
    const item = getItemById(itemId);
    if (!item) return false;

    item.bidHistory.push({
        amount: newBid,
        bidderId: bidderId,
        timestamp: new Date().toISOString()
    });

    item.currentBid = newBid;
    item.currentBidder = bidderId;

    item.analytics.totalBids++;
    item.analytics.uniqueBidders.add(bidderId);
    item.analytics.bidTimeline.push({
        time: new Date().toISOString(),
        amount: newBid
    });

    return true;
}

function setMaxBid(itemId, bidderId, maxBid) {
    const item = getItemById(itemId);
    if (!item) return false;

    item.maxBids[bidderId] = maxBid;
    return true;
}

function getMaxBid(itemId, bidderId) {
    const item = getItemById(itemId);
    if (!item) return null;

    return item.maxBids[bidderId] || null;
}

function removeMaxBid(itemId, bidderId) {
    const item = getItemById(itemId);
    if (!item) return false;

    delete item.maxBids[bidderId];
    return true;
}

function getGlobalAnalytics() {
    const totalBids = items.reduce((sum, item) => sum + item.analytics.totalBids, 0);
    const allBidders = new Set();
    items.forEach(item => {
        item.analytics.uniqueBidders.forEach(bidder => allBidders.add(bidder));
    });

    const recentActivity = [];
    items.forEach(item => {
        item.bidHistory.slice(-5).forEach(bid => {
            recentActivity.push({
                itemId: item.id,
                itemTitle: item.title,
                amount: bid.amount,
                bidderId: bid.bidderId,
                timestamp: bid.timestamp
            });
        });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
        totalBids,
        totalBidders: allBidders.size,
        activeAuctions: items.filter(item => new Date(item.auctionEndTime) > new Date()).length,
        recentActivity: recentActivity.slice(0, 10)
    };
}

module.exports = {
    getAllItems,
    getItemById,
    updateItemBid,
    setMaxBid,
    getMaxBid,
    removeMaxBid,
    getGlobalAnalytics
};
