// Performance optimization script cho MongoDB
// Chạy script này để tạo indexes cần thiết

// Message indexes
db.messages.createIndex({ "conversation": 1, "timestamp": -1 });
db.messages.createIndex({ "sender": 1, "recipient": 1, "timestamp": -1 });
db.messages.createIndex({ "recipient": 1, "isRead": 1 });
db.messages.createIndex({ "timestamp": -1 });

// Conversation indexes
db.conversations.createIndex({ "participants": 1, "isGroup": 1 });
db.conversations.createIndex({ "lastMessageTime": -1 });

// User indexes
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "_id": 1 });

// Compound indexes cho queries phức tạp
db.messages.createIndex({ 
    "sender": 1, 
    "recipient": 1, 
    "conversation": 1, 
    "timestamp": -1 
});

db.messages.createIndex({
    "conversation": 1,
    "isRead": 1,
    "timestamp": -1
});

console.log("Database indexes created successfully!");