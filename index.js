import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ipRangeCheck from 'ip-range-check';

import addSeriesRouter from './routes/addSeries.js';
import addMoviesRouter from './routes/addMovies.js';
import lookupRouter from './routes/lookup.js';

// Import the Overseerr module
import Overseerr from './overseerr.js';

dotenv.config();

const app = express();
const port = 8194;

// API Key Validation Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);

    // OpenAI Only Block # https://platform.openai.com/docs/plugins/production/ip-egress-ranges
    if (process.env.ONLY_ALLOW_OPENAI === 'true') {
        const allowedRanges = ['23.102.140.112/28', '13.66.11.96/28']; 
        const ip = req.header('CF-Connecting-IP') || req.header('X-Forwarded-For') || req.ip;

        if (!ipRangeCheck(ip, allowedRanges)) {
            console.log(`Access denied for IP: ${ip}`);
            return res.status(403).send('Access denied');
        }
    }

    if (req.path === '/privacy-policy') {
        return next();
    }

    const apiKey = req.header('X-Api-Key');
    if (!apiKey || apiKey !== process.env.PROXY_API_KEY) {
        return res.status(401).json({ message: 'Invalid or missing API key' });
    }
    next();
});

app.use(bodyParser.json());

// Routes
app.use('/addSeries', addSeriesRouter);

// Adjusted addMoviesRouter to handle Overseerr
app.use('/addMovies', (req, res) => {
    const { service } = req.query; // Assume a query parameter to choose the service (radarr, sonarr, overseerr)

    if (service === 'overseerr') {
        // Call the Overseerr module for adding movies
        Overseerr.add(req.body.title, req.body.year)
            .then(result => res.json(result))
            .catch(error => res.status(500).json({ error: error.message }));
    } else {
        // Fallback to the original addMoviesRouter for Radarr or Sonarr
        addMoviesRouter(req, res);
    }
});

// Lookup:
app.use('/BulkSearchForMovieAndSeries', lookupRouter);

app.use('/privacy-policy', (req, res) => {
    res.sendFile('public/privacy-policy.html', { root: '.' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
