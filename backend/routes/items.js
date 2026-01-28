const express = require('express');
const { getAllItems } = require('../data/items');

const router = express.Router();

router.get('/items', (req, res) => {
    try {
        const items = getAllItems();
        res.json({
            success: true,
            data: items,
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch items'
        });
    }
});

module.exports = router;
