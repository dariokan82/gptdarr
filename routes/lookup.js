import express from 'express';
import sonarr from '../modules/sonarr.js';
import radarr from '../modules/radarr.js';
import overseerr from '../modules/overseerr.js'; // Import the Overseerr module

const router = express.Router();

router.post('/', async (req, res) => {
    const items = req.body.items;  // Could be series or movies
    const service = req.query.service || 'sonarr'; // Default to Sonarr if no service is specified

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        let response;
        if (service === 'overseerr') {
            response = await overseerr.bulkAdd(items);
        } else if (service === 'sonarr') {
            response = await sonarr.bulkAdd(items);
        } else if (service === 'radarr') {
            response = await radarr.bulkAdd(items);
        } else {
            return res.status(400).json({ message: 'Unsupported service' });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
