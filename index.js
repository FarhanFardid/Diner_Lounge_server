const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
// middleware

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
res.send("Bistro Boss server is running...")
})




const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.joz6qi9.mongodb.net/?retryWrites=true&w=majority`;

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
       client.connect();
        
       const menuCollection = client.db("bistroDB").collection("menu");
       const reviewsCollection = client.db("bistroDB").collection("reviews");
       const cartCollection = client.db("bistroDB").collection("carts");
    //    const reviewsCollection = client.db("bistroDB").collection("reviews");


    app.get('/reviews', async(req,res)=>{
        const cursor = reviewsCollection.find();
        const result = await cursor.toArray()
        res.send(result);
       })
       
       app.get('/menu', async (req,res)=> {
        const cursor = menuCollection.find();
        const result = await cursor.toArray()
        res.send(result); 
       })
        app.get('/carts', async(req,res)=>{
          const cursor = cartCollection.find();
          const result = await cursor.toArray()
          res.send(result)
        })

       app.post('/carts', async(req,res)=>{
        const item =  req.body;
        const result = await cartCollection.insertOne(item);
        res.send(result)
       })
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
    console.log("Bistro server is running on port", port)
})