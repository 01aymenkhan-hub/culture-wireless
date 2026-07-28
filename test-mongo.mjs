import mongoose from "mongoose";
import dns from "node:dns";

dns.promises.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const uri =
  "mongodb+srv://ashrafcc202:Hamira123%40%23@cluster0.ziucbb3.mongodb.net/culture-wireless?appName=Cluster0";

console.log("URI exists:", Boolean(uri));

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("✅ MongoDB connected successfully");
  console.log("Database:", mongoose.connection.name);

  await mongoose.disconnect();

  console.log("Disconnected");
} catch (error) {
  console.error("❌ MongoDB FAILED");
  console.error(error);
}