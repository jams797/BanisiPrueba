// src/utils/smsService.js
require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSms(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    console.log('SMS enviado. SID:', message.sid);
    return message;
  } catch (err) {
    console.error('Error enviando SMS con Twilio:', err.message);
    throw err;
  }
}

module.exports = {
  sendSms
};