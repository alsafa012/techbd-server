const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pz6rkt0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
     serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
     },
});

async function run() {
     try {
          // Connect the client to the server(optional starting in v4.7)
          await client.connect();

          const userProductCollection = client
               .db("rjTechDB")
               .collection("products");
          const addCardCollection = client
               .db("rjTechDB")
               .collection("addCart");

          app.get("/products", async (req, res) => {
               const cursor = userProductCollection.find();
               const result = await cursor.toArray();
               console.log(result);
               res.send(result);
          });

          app.get("/products/:id", async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               const result = await userProductCollection.findOne(query);
               res.send(result);
          });

          app.post("/products", async (req, res) => {
               const newProduct = req.body;
               console.log(newProduct);
               const result = await userProductCollection.insertOne(newProduct);
               res.send(result);
          });
          
          //Add Cart Product
          app.get("/addCart", async (req, res) => {
               const cursor = addCardCollection.find();
               const result = await cursor.toArray();
               console.log(result);
               res.send(result);
          }); 
          app.post("/addCart", async (req, res) => {
               const product = req.body;
               console.log(product);
               const result = await addCardCollection.insertOne(product);
               res.send(result);
          });
          

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

app.get("/", (req, res) => {
     res.send("server is running");
});

app.listen(port, () => {
     console.log(`server is running on port: ${port}`);
});
