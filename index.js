const express = require('express');
const {connectToMongoDB} = require('./connect');
const urlRoutes = require('./routes/url');
const app = express();
const port = 8001;

connectToMongoDB('mongodb://localhost:27017/Short-url')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(express.json());
app.use('/',urlRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));