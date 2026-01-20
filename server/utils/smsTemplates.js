const buildBookingConfirmationSms = ({customerName, serviceName, date, time}) => {
    const safeName = customerName || 'there';
    return `Hi ${safeName}, thank you for booking with En Vogue Grooming, we appreciate your business! Here are the details of your upcoming booking: Your ${serviceName} booking is confirmed for ${date} at ${time}. See you soon!`;
}

module.exports = {buildBookingConfirmationSms};