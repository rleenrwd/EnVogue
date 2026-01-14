const mongoose = require('mongoose');

const connectDb = async () => {
    const URI = process.env.MONGO_URI;

    if (!URI) {
        console.error('MONGO_URI is not set. Check your .env file.');
        process.exit(1);
    }

    mongoose.connection.on('connected', () => console.log('MongoDB succesfully connected!'));
    mongoose.connection.on('disconnected', () => console.log('MongoDB is now disconnected.'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

    try {
        await mongoose.connect(URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Succesfully connected to MongoDB database!');
    } catch (err) {
        console.error('There was an error connecting to the database:', err);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed (SIGINT).');
        process.exit(0);
    } catch (err) {
        console.error('There was an error closing the MongoDB connection:', err);
        process.exit(1);
    }
})

module.exports = connectDb;