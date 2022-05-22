const express=require('express');
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
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

    // get station
    app.get('/stations',async(req,res)=>{
        const result=await stationCollection.find({}).toArray();
        res.send(result);

    });
    app.get('/stations/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await stationCollection.findOne(query);
        res.send(result);

    });

    //add station
    app.post('/stations',async(req,res)=>{
        const station=req.body;
        const result=await stationCollection.insertOne(station);
        res.json(result);

    });

    //delete station
    app.delete('/stations/:id',async(req,res)=>{
        const id=req.params.id;
        
        const query={_id:ObjectId(id)};
        const result=await stationCollection.deleteOne(query);
        res.json(result);

    });

    // update station
    app.put('/stations/:id',async(req,res)=>{
        const station=req.body;
        const id=req.params.id;
        const filter={_id:ObjectId(id)};
        const options = { upsert: true };   
        const updateDoc={$set:{
            name:station.name,
            frequency:station.frequency

        }};
        const result=await stationCollection.updateOne(filter,updateDoc,options);
        
        res.json(result);
               
    });


    console.log("Connected successfully to server");

  } finally {

    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })