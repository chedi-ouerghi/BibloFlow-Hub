const mongoose = require("mongoose");
require("dotenv").config();

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const uri = process.env.MONGODB_URI;

// 🔧 Plus besoin de useNewUrlParser ou useUnifiedTopology
const options = {
  retryWrites: true,
  w: "majority"
};

mongoose.connect(uri, options)
  .then(() => console.log("✅ Connexion MongoDB réussie"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));
