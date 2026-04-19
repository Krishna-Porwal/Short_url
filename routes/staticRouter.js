const express = require('express');
const URL = require('../models/url');

const router = express.Router();

function getBaseUrl(req) {
    if (process.env.PUBLIC_BASE_URL) {
        return process.env.PUBLIC_BASE_URL.replace(/\/$/, '');
    }
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = forwardedProto ? forwardedProto.split(',')[0] : req.protocol;
    const forwardedHost = req.headers['x-forwarded-host'];
    const host = forwardedHost ? forwardedHost.split(',')[0] : req.get('host');
    return `${protocol}://${host}`;
}

router.get('/', async (req, res) => {
    try {
        const allUrls = await URL.find({});

        return res.render('home', {
            urls: allUrls,
            baseUrl: getBaseUrl(req),
        });
    } catch (error) {
        return res.status(503).render('home', {
            urls: [],
            baseUrl: getBaseUrl(req),
        });
    }

});

router.get('/analytics', (req, res) => {
    return res.render('analytics');
});

module.exports = router;