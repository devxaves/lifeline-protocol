// MongoDB setup script
// Run this in MongoDB shell or MongoDB Compass

const db = db.getSiblingDB("lifeline_protocol")

// Create vaults collection with indexes
db.createCollection("vaults")

// Create indexes for better performance
db.vaults.createIndex({ ownerWallet: 1 })
db.vaults.createIndex({ nomineeWallet: 1 })
db.vaults.createIndex({ trustees: 1 })
db.vaults.createIndex({ status: 1 })
db.vaults.createIndex({ lastHeartbeat: 1 })

// Sample data for testing
db.vaults.insertOne({
  ownerWallet: "0x1234567890abcdef1234567890abcdef12345678",
  nomineeWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
  trustees: ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"],
  heartbeatInterval: 30,
  cooldownPeriod: 15,
  assetType: "APT",
  amount: 100.5,
  status: "active",
  lastHeartbeat: new Date(),
  createdAt: new Date(),
  votes: [],
})

console.log("Database setup complete!")
