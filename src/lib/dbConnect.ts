import mongoose from 'mongoose';

const db: string = 'mongodb://127.0.0.1:27017/bluemove';

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected', db);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;