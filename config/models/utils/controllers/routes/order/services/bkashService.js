// services/bkashService.js
import axios from 'axios';
import crypto from 'crypto-js';

class BkashService {
    constructor() {
        this.baseURL = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
        this.config = {
            appKey: process.env.BKASH_APP_KEY,
            appSecret: process.env.BKASH_APP_SECRET,
            username: process.env.BKASH_USERNAME,
            password: process.env.BKASH_PASSWORD
        };
        this.token = null;
        this.tokenExpires = null;
    }

    // Generate bKash token
    async generateToken() {
        try {
            // Check if token is still valid
            if (this.token && this.tokenExpires && Date.now() < this.tokenExpires) {
                return this.token;
            }

            const response = await axios.post(
                `${this.baseURL}/tokenized/checkout/token/grant`,
                {
                    app_key: this.config.appKey,
                    app_secret: this.config.appSecret
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'username': this.config.username,
                        'password': this.config.password
                    }
                }
            );

            if (response.data && response.data.id_token) {
                this.token = response.data.id_token;
                // Token expires in 1 hour, set expiry 5 minutes earlier for safety
                this.tokenExpires = Date.now() + (55 * 60 * 1000);
                return this.token;
            } else {
                throw new Error('Failed to generate bKash token');
            }
        } catch (error) {
            console.error('bKash token generation error:', error.response?.data || error.message);
            throw new Error(`bKash token generation failed: ${error.message}`);
        }
    }

    // Create bKash payment
    async createPayment(amount, orderId, callbackURL) {
        try {
            const token = await this.generateToken();
            
            const paymentResponse = await axios.post(
                `${this.baseURL}/tokenized/checkout/create`,
                {
                    mode: '0011',
                    payerReference: orderId,
                    callbackURL: callbackURL,
                    amount: amount.toFixed(2),
                    currency: 'BDT',
                    intent: 'sale',
                    merchantInvoiceNumber: orderId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        'X-APP-Key': this.config.appKey
                    }
                }
            );

            if (paymentResponse.data && paymentResponse.data.paymentID) {
                return {
                    success: true,
                    paymentID: paymentResponse.data.paymentID,
                    bkashURL: paymentResponse.data.bkashURL,
                    amount: amount,
                    currency: 'BDT'
                };
            } else {
                throw new Error('Failed to create bKash payment');
            }
        } catch (error) {
            console.error('bKash payment creation error:', error.response?.data || error.message);
            throw new Error(`bKash payment creation failed: ${error.message}`);
        }
    }

    // Execute bKash payment
    async executePayment(paymentID) {
        try {
            const token = await this.generateToken();
            
            const response = await axios.post(
                `${this.baseURL}/tokenized/checkout/execute`,
                { paymentID },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        'X-APP-Key': this.config.appKey
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('bKash payment execution error:', error.response?.data || error.message);
            throw new Error(`bKash payment execution failed: ${error.message}`);
        }
    }

    // Check payment status
    async checkPaymentStatus(paymentID) {
        try {
            const token = await this.generateToken();
            
            const response = await axios.get(
                `${this.baseURL}/tokenized/checkout/payment/status/${paymentID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                        'X-APP-Key': this.config.appKey
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('bKash payment status check error:', error.response?.data || error.message);
            throw new Error(`bKash payment status check failed: ${error.message}`);
        }
    }
}

export default new BkashService();