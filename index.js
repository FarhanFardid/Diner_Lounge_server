const express = require('express')
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
res.send("Bistro Boss server is running...")
})



app.post('/jwt', (req,res)=>{
  const user = req.body;
  const token = jwt.sign(user,env.process.Access_Token_Secret, { expiresIn: '1h' })
  res.send({ token})
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
        
       const usersCollection = client.db("bistroDB").collection("users");
       const menuCollection = client.db("bistroDB").collection("menu");
       const reviewsCollection = client.db("bistroDB").collection("reviews");
       const cartCollection = client.db("bistroDB").collection("carts");
    
//  users api
app.post('/users', async(req,res)=>{
  const user = req.body;
  const query = {email: user.email}
  const existingUser = await usersCollection.findOne(query);
  if(existingUser){
    return res.send("User Already Exist in the DB")
  }
  const result = await usersCollection.insertOne(user)
  res.send(result) 
})

app.get('/users', async(req,res)=>{
  const result  = await usersCollection.find().toArray()
  res.send(result);
});

app.delete('/users/:id', async(req,res)=>{
 
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await usersCollection.deleteOne(query)
  res.send(result)
})

app.patch('/users/admin/:id',async (req,res)=> {
  const id = req.params.id;
  const filter = {_id : new ObjectId(id)}
  const updateDoc = {
    $set: {
      role: 'admin'
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc)
  res.send(result)
 })

// reviews api
    app.get('/reviews', async(req,res)=>{
        const cursor = reviewsCollection.find();
        const result = await cursor.toArray()
        res.send(result);
       })
       
      //  menu api
       app.get('/menu', async (req,res)=> {
        const cursor = menuCollection.find();
        const result = await cursor.toArray()
        res.send(result); 
       })

      //  carts api
        app.get('/carts', async(req,res)=>{
          const email = req.query.email;
          if(!email){
            res.send([]);
          }
          const query = {email: email}
          const cursor = cartCollection.find(query);
          const result = await cursor.toArray()
          res.send(result)
        })

       app.post('/carts', async(req,res)=>{
        const item =  req.body;
        const result = await cartCollection.insertOne(item);
        res.send(result)
       })
    
       app.delete('/carts/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await cartCollection.deleteOne(query);
        res.send(result);
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