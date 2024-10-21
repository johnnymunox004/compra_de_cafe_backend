// config/mongodb.js
import { MongoClient, ServerApiVersion } from 'mongodb';  // Usa import en lugar de require

const uri = "mongodb+srv://mr1773393:Pancho12@clusterempresacafe.vwx5p.mongodb.net/nombredetubasededatos?retryWrites=true&w=majority&tls=true&appName=Clusterempresacafe";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,  // Asegura el uso de TLS
  tlsAllowInvalidCertificates: true, // Permite certificados no válidos (usar solo en desarrollo)
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000, // Tiempo de espera para conectar (en milisegundos)
  socketTimeoutMS: 45000,  // Tiempo de espera del socket (en milisegundos)
});

async function connect() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export { connect, client };
