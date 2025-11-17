const express = require('express');
const {connectToMongoDB} = require('./connect');
const urlRoutes = require('./routes/url');
const URL = require('./models/url');
const app = express();
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/Short-url')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/url',urlRoutes);

app.get('/:shortId',async(req,res)=>{
    const shortId = req.params.shortId;
   const entry = await URL.findOneAndUpdate(
    {
        shortId
    },{ 
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            }
        }
   
    );
    res.redirect(entry.redirectUrl);

    });

 



app.listen(port, () => console.log(`Server running on port ${port}`));