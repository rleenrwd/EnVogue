if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const Service = require('../models/Service');

const seedServices = [
    {
    name: 'The En Vogue Finish',
    description:
      'Our most refined grooming experience. Includes bath, deep-conditioning, precision coat styling or breed-specific cut, paw/pad care, ear cleansing, and finishing spritz.',
    image: 'https://images.pexels.com/photos/6816860/pexels-photo-6816860.jpeg',
    price: 130,
    durationMins: 180,
    },
    {
    name: 'The Luxe Lather',
    description:
      'Professional bathing service with gentle shampoos and nourishing conditioners for a soft, fresh coat and spa-like finish.',
    image:
      'https://images.unsplash.com/photo-1611173622933-91942d394b04?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 85,
    durationMins: 60,
  },
  {
    name: 'Reluxe and Play',
    description: 'Professional daycare services.',
    image: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 100,
    durationMins: 120
  }
]

const runSeed = async () => {
    const URI = process.env.MONGO_URI;

    if (!URI) {
        console.error('MONGO_URI not set. Check your .env file.');
        process.exit(1);
    }

    try {
        await mongoose.connect(URI);

        const deleteServices = await Service.deleteMany({});
        console.log('All services removed from collection.');

        const insertServices = await Service.insertMany(seedServices);
        console.log('New services inserted into collection.');

    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exitCode = 1;
    } finally {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (_) {}
    }

};

runSeed();