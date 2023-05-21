const express = require('express');
const cors = require('cors');
const app =express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;


//MIDDLE WARE 
app.use(cors());
app.use(express.json());

//console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwmpqqv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const clientsCollection = client.db("DBinsert").collection('clients');

    app.get('/clients', async(req, res) => {
      const cursor = clientsCollection.find()
      const result = await cursor.toArray()
      res.send(result); 
    })

    app.post('/clients' , async(req, res)=>{
        const clients = req.body;
        console.log(clients);
        const result = await clientsCollection.insertOne(clients);
        res.send(result);
    }),



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("lego-MArket is Running")
})

app.listen(port, ()=>{
    console.log(`Lego-Market running port is ${port}`);
})