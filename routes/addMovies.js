import express from 'express';
import radarr from '../modules/radarr.js';
import overseerr from '../modules/overseerr.js'; // Import the Overseerr module

const router = express.Router();

router.post('/', async (req, res) => {
    const movies = req.body.items;
    const service = req.query.service || 'radarr'; // Default to Radarr if no service is specified
    
    if (!movies || movies.length === 0) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        let response;
        if (service === 'overseerr') {
            response = await overseerr.bulkAdd(movies);
        } else {
            response = await radarr.bulkAdd(movies);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
