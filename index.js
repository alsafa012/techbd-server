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
    // await client.connect();
    //     techbd-server

    const userProductCollection = client.db("rjTechDB").collection("products");
    const addCardCollection = client.db("rjTechDB").collection("addCart");
    const cakeParadiseProductCollection = client
      .db("rjTechDB")
      .collection("cakeParadiseProducts");
    const cakeParadiseCategoriesCollection = client
      .db("rjTechDB")
      .collection("cakeParadiseCategories");

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
      // const newProduct = req.body;
      console.log(newProduct);
      const result = await userProductCollection.insertOne(newProduct);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const myProduct = {
        image: updateProduct.image,
        productName: updateProduct.productName,
        brandName: updateProduct.brandName,
        productType: updateProduct.productType,
        productPrice: updateProduct.productPrice,
        ShortDescription: updateProduct.ShortDescription,
        rating: updateProduct.rating,
      };
      console.log(myProduct);
      const result = await userProductCollection.updateOne(
        filter,
        { $set: { ...myProduct } },
        options
      );
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userProductCollection.deleteOne(query);
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

    app.delete("/addCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCardCollection.deleteOne(query);
      res.send(result);
    });

    // cake Paradise Bd apis

    app.get("/cakeParadiseProducts", async (req, res) => {
      const result = await cakeParadiseProductCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    // app.get("/cakeParadiseProducts/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await cakeParadiseProductCollection.findOne(query);
    //   res.send(result);
    // });
    app.get("/cakeParadiseProducts/:id", async (req, res) => {
      const id = req.params.id;
    
      // Validate if the provided ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ObjectId format" });
      }
    
      const query = { _id: new ObjectId(id) };
      const result = await cakeParadiseProductCollection.findOne(query);
    
      if (!result) {
        return res.status(404).send({ error: "Product not found" });
      }
    
      res.send(result);
    });
    
    app.post("/cakeParadiseProducts", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await cakeParadiseProductCollection.insertOne(product);
      res.send(result);
    });

    app.put("/cakeParadiseProducts/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const myProduct = {
        title: updateProduct.title,
        category: updateProduct.category,
        total_price: updateProduct.total_price,
        per_pound_price: updateProduct.per_pound_price,
        product_des: updateProduct.product_des,
        img: updateProduct.img, // Updated images (or old images if not changed)
      };
      console.log("myProduct", myProduct);
      const result = await cakeParadiseProductCollection.updateOne(
        filter,
        { $set: { ...myProduct } },
        options
      );
      res.send(result);
    });
    app.delete("/cakeParadiseProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cakeParadiseProductCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/cakeParadiseCategories", async (req, res) => {
      const result = await cakeParadiseCategoriesCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.post("/cakeParadiseCategories", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await cakeParadiseCategoriesCollection.insertOne(product);
      res.send(result);
    });
    app.delete("/cakeParadiseCategories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cakeParadiseCategoriesCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/cakeParadiseCategories", async (req, res) => {
      //  const id = req.params.id;
      //  const query = { _id: new ObjectId(id) };
      const result = await cakeParadiseCategoriesCollection.deleteMany({});
      res.send(result);
    });
    // ------------------------------

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
  res.send("TechBD server is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
