const express=require('express');
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port=process.env.PORT || 5000;

//midleware
app.use(express.json());
app.use(cors());


// Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r4ki1.mongodb.net/?retryWrites=true&w=majority`;

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const database =await client.db("radio");
    const stationCollection= database.collection('radio-station');


    console.log("Connected successfully to server");

  } finally {

    
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })