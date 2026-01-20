const twilio = require('twilio');

const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_PHONE,
    TWILIO_MESSAGING_SERVICE_SID
} = process.env;

const hasCreds = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN);

const client = hasCreds ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN): null;

const sendSms = async ({to, body}) => {
    if (!client) throw new Error('Twilio client not configured (missing SID/Auth Token).');
    if (!to) throw new Error('Missing "to" phone number.');
    if (!body) throw new Error('Missing SMS body.');

    const payload = {to, body};

    if (TWILIO_MESSAGING_SERVICE_SID) {
        payload.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
    } else if (TWILIO_FROM_PHONE) {
        payload.from = TWILIO_FROM_PHONE;
    } else {
        throw new Error('Twilio sender not configured (missing Messaging Service or "from" phone number).');
    }

    
    try {
        const msg = await client.messages.create(payload);
        return msg;
    } catch (err) {
        throw new Error(err.message || 'Twilio SMS send failed.');
    }
}

module.exports = {sendSms};