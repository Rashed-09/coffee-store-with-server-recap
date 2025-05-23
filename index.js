const express = require("express")
const cors = require('cors')
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epxaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollectionRecap = client.db("coffeeStor").collection("coffeeCollection")
    
    app.get("/coffee", async(req, res) => {
      const cursor = coffeeCollectionRecap.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await coffeeCollectionRecap.findOne(filter)
      res.send(result)
    })

    app.post("/coffee", async(req, res) => {
      const data = req.body;
      // console.log(data)
      const result = await coffeeCollectionRecap.insertOne(data)
      res.send(result)
    })

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert : true }
      console.log(data)
      const updateDoc = {
        $set: {
          name: data.name,
          chef: data.chef,
          supplier: data.supplier,
          teste: data.teste,
          category: data.category,
          details: data.details,
          photourl: data.photourl,
        },
      };
      const result = await coffeeCollectionRecap.updateOne(filter, updateDoc, options)
      res.send(result)
    }) 

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollectionRecap.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("coffee server is running properly today")
})

app.listen(port, () => {
    console.log(`server is running on port number: ${port}`)
})