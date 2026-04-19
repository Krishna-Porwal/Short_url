const {nanoid} = require('nanoid');
const URL = require('../models/url');
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
        return res.render ('home',{
            id: shortId,
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
