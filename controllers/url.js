const {shortid} = require('shortid');
const URL = require('../models/url');
async function handleGenerateShortUrl(req,res){
    const body = req.body;
    if(!body.url){
        return res.status(400).json({error: 'URL is required'});
    }
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: [],
    });
    return res.json({id: shortId});
}
module.exports = {handleGenerateShortUrl};
