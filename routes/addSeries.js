import express from 'express';
import sonarr from '../modules/sonarr.js';
import overseerr from '../modules/overseerr.js'; // Import the Overseerr module

const router = express.Router();

router.post('/', async (req, res) => {
    const series = req.body.items;
    const service = req.query.service || 'sonarr'; // Default to Sonarr if no service is specified

    if (!series || series.length === 0) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        let response;
        if (service === 'overseerr') {
            response = await overseerr.bulkAdd(series);
        } else {
            response = await sonarr.bulkAdd(series);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
