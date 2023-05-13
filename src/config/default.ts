export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    number: process.env.TWILIO_NUMBER,
  },
});
