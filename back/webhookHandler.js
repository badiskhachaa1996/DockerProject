// webhookHandler.js
const express = require('express');
const router = express.Router();

const secretKey = 'M8axEdfG07tyzPlUhGEkx4y8RxJfdIqM8m3R9J0dQUWmmU1NhqvuBWEHKeG3cSf9'; // Replace with your chosen secret key
router.post('/webhook', (req, res) => {
    console.log('req:', req.hostname);
// Verify the secret key
    const providedKey = req.get('Secret-Key');
    if (providedKey !== secretKey) {
        return res.status(401).send('Unauthorized');
    }

    // Extract data from the request
    const response = req.body;

    // Process the data as needed
    console.log('Received webhook data:', response);

    // Send a response back to Support Board
    res.status(200).send('Webhook received successfully');
});

module.exports = router;
