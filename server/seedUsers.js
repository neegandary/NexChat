import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";

// Connect to MongoDB
const MONGO_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/nexchat";

const demoUsers = [
  {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    password: "123456",
    profileSetup: true
  },
  {
    firstName: "Bob",
    lastName: "Smith", 
    email: "bob@example.com",
    password: "123456",
    profileSetup: true
  },
  {
    firstName: "Carol",
    lastName: "Williams",
    email: "carol@example.com", 
    password: "123456",
    profileSetup: true
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david@example.com",
    password: "123456", 
    profileSetup: true
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing demo users
    await User.deleteMany({ 
      email: { $in: demoUsers.map(user => user.email) }
    });
    console.log("Cleared existing demo users");

    // Hash passwords and create users
    for (const userData of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`);
    }

    console.log("\n✅ Demo users created successfully!");
    console.log("You can now search for these users in the app:");
    demoUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
    });

  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

seedUsers();