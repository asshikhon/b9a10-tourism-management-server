const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
  origin: ["http://localhost:5173", "https://tourism-management-ce48d.web.app"],
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ola8x0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();

    const spotCollection = client.db('spotDB').collection('spot');
    const countryCollection = client.db('spotDB').collection('countries');

    app.get('/spot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/countries', async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/countries/:countryName', async (req, res) => {
      const countryName = req.params.countryName;
      const query = { countryName: countryName }; 
      const cursor = spotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });



    app.get('/myList/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await spotCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    })

    app.get('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await spotCollection.findOne(query);
      res.send(user);

    })


    app.post('/spot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })


    app.put('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedUser = {
        $set: {
name: user.name,
country: user.country,
location: user.location,
travel: user.travel,
photoURL: user.photoURL,
average: user.average,
seasonality: user.seasonality,
total: user.total,
description: user.description,
        }
      }
      const result = await spotCollection.updateOne(filter, updatedUser, options);
      res.send(result);
    })

    app.delete('/spot/:id', async (req, res) => {
      const id = req.params.id;
      console.log('object deleted', id);
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Tourism Management is running');

})

app.listen(port, () => {
  console.log(`Tourism Management Server running on port : ${port}`)

});