const express = require('express');
const URL = require('../models/url');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allUrls = await URL.find({});

        return res.render('home', { urls: allUrls });
    } catch (error) {
        return res.status(503).render('home', {
            urls: [],
        });
    }

});

router.get('/analytics', (req, res) => {
    return res.render('analytics');
});

module.exports = router;