const {nanoid} = require('nanoid');
const URL = require('../models/url');

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

async function handleGenerateShortUrl(req,res){
    try {
        const body = req.body;
        if(!body.url){
            return res.status(400).json({error: 'URL is required'});
        }
        const shortId = nanoid(2);
        await URL.create({
            shortId: shortId,
            redirectUrl: body.url,
            visitHistory: [],
        });
        const allUrls = await URL.find({});
        const shortUrl = `${getBaseUrl(req)}/short/${shortId}`;
        return res.render ('home',{
            urls: allUrls,
            id: shortId,
            shortUrl,
            baseUrl: getBaseUrl(req),
        });
    } catch (error) {
        return res.status(503).json({ error: 'Database is temporarily unavailable' });
    }
}

async function handleGetAnalytics(req,res){
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({shortId});
        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        return res.json({
            totalClicks: result.visitHistory.length,
            visitHistory: result.visitHistory,
        });
    } catch (error) {
        return res.status(503).json({ error: 'Database is temporarily unavailable' });
    }
}
module.exports = {handleGenerateShortUrl,handleGetAnalytics};
