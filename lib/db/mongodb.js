import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "../config/env.js";

// Use reliable public DNS servers for MongoDB Atlas SRV lookup
dns.promises.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  const uri = env.mongodb?.uri || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;

    console.log("✅ MongoDB connected successfully");
    console.log("Database:", cached.conn.connection.name);

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("❌ MongoDB connection failed:");
    console.error(error);

    throw error;
  }
}

