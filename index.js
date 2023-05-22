const express = require('express');
const categoryData = require('./data/data.json');
const cors = require('cors');
const app =express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;


//MIDDLE WARE 
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig));
app.options("" , cors(corsConfig));

app.use(cors());
app.use(express.json());

app.get('/category', (req ,res)=>{
  res.send(categoryData);
})

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
    //await client.connect();

    const clientsCollection = client.db("DBinsert").collection('clients');

    app.get('/clients', async(req, res) => {
      const cursor = clientsCollection.find()
      const result = await cursor.toArray()
      res.send(result); 
    })

    app.get('/clients/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await clientsCollection.findOne(query)
      res.send(result);
    })

    app.post('/clients' , async(req, res)=>{
        const clients = req.body;
        console.log(clients);
        const result = await clientsCollection.insertOne(clients);
        res.send(result);
    }),

    app.put('/clients/:id', async(req, res)=>{
      const id = req.params.id;
      const updated= req.body;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updateData = {
        $set : {
          name : updated.name,
          email : updated.email,
          url: updated.url,
          price : updated.price,
          rating : updated.rating,
          quantity: updated.quantity,
          description: updated.description,
        }
      }
    const result = await clientsCollection.updateOne(filter, updateData, options);
      res.send(result);
    })


    app.delete('/clients/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await clientsCollection.deleteOne(query);
      res.send(result);
    })


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