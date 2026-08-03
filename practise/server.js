const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/stk-push', async (req, res) => {
    try {
        const { phoneNumber, amount, email } = req.body;

        if (!phoneNumber || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: phoneNumber or amount."
            });
        }

        const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

        // Standard Payload Structure for Gateways (e.g., Flutterwave, Beyonic)
        const providerPayload = {
            amount: amount,
            currency: "UGX",
            phone_number: cleanPhone,
            email: email,
            reference: `UREMBO-${Date.now()}`
        };

        /* 
        // UNCOMMENT THIS BLOCK TO GO LIVE WITH YOUR API PROVIDER
        const gatewayResponse = await axios.post(process.env.PAYMENT_API_URL, providerPayload, {
            headers: {
                'Authorization': `Bearer ${process.env.PAYMENT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return res.status(200).json({ success: true, message: "Prompt sent." });
        */

        // Local testing simulation fallback
        return res.status(200).json({
            success: true,
            message: "Simulated backend prompt sent successfully."
        });

    } catch (error) {
        console.error("Backend Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || "Internal server gateway error."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Urembo Designs backend running on http://localhost:${PORT}`);
});
