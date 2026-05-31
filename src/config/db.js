import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Aap ke .env ke variable 'MONGOURI' ka use kiya hai
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log(`📡 Cloud MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;