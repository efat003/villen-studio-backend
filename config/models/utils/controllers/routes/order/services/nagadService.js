// services/nagadService.js
import axios from 'axios';
import CryptoJS from 'crypto-js';

class NagadService {
    constructor() {
        this.baseURL = process.env.NAGAD_BASE_URL || 'https://api.mynagad.com';
        this.merchantId = process.env.NAGAD_MERCHANT_ID;
        this.merchantNumber = process.env.NAGAD_MERCHANT_NUMBER;
        this.privateKey = process.env.NAGAD_PRIVATE_KEY;
    }

    // Generate Nagad payment
    async createPayment(amount, orderId, callbackURL) {
        try {
            const datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
            
            const sensitiveData = {
                merchantId: this.merchantId,
                datetime: datetime,
                orderId: orderId,
                amount: amount.toFixed(2),
                callbackUrl: callbackURL
            };

            // Encrypt sensitive data
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(sensitiveData), 
                this.privateKey
            ).toString();

            // Generate signature
            const signature = CryptoJS.HmacSHA256(encryptedData, this.privateKey).toString();

            // Initialize payment
            const initResponse = await axios.post(
                `${this.baseURL}/api/dfs/check-out/initialize/${this.merchantId}/${orderId}`,
                {
                    accountNumber: this.merchantNumber,
                    dateTime: datetime,
                    sensitiveData: encryptedData,
                    signature: signature
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-KM-IP-V4': '127.0.0.1',
                        'X-KM-Client-Type': 'PC_WEB'
                    }
                }
            );

            if (initResponse.data && initResponse.data.callbackUrl) {
                return {
                    success: true,
                    paymentURL: initResponse.data.callbackUrl,
                    amount: amount,
                    currency: 'BDT',
                    orderId: orderId
                };
            } else {
                throw new Error('Failed to create Nagad payment');
            }
        } catch (error) {
            console.error('Nagad payment creation error:', error.response?.data || error.message);
            throw new Error(`Nagad payment creation failed: ${error.message}`);
        }
    }

    // Verify Nagad payment
    async verifyPayment(paymentReferenceId) {
        try {
            const response = await axios.get(
                `${this.baseURL}/api/dfs/verify/payment/${paymentReferenceId}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Nagad payment verification error:', error.response?.data || error.message);
            throw new Error(`Nagad payment verification failed: ${error.message}`);
        }
    }
}

export default new NagadService();