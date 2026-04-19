require('dotenv').config();
const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const URL = require('./models/url');
const staticRoute = require('./routes/staticRouter');
const path = require('path');
const app = express();
const port = process.env.PORT || 8001;

app.set('trust proxy', 1);

if (!process.env.MONGODB_URI) {
    console.error('Missing required environment variable: MONGODB_URI');
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views',path.resolve("./views"));
app.use('/url', urlRoutes);
app.use('/', staticRoute);


app.get('/short/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            {
                shortId,
            },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            }
        );

        if (!entry) {
            return res.status(404).send('Short URL not found');
        }

        return res.redirect(entry.redirectUrl);
    } catch (error) {
        return res.status(503).send('Database is temporarily unavailable. Please try again.');
    }
});











connectToMongoDB(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });