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

    // .................................

    const hiddenProductCollections = client
      .db("rjTechDB")
      .collection("HiddenProducts");
    const hiddenCategoryCollections = client
      .db("rjTechDB")
      .collection("hiddenCategories");
    const hiddenConfirmOrderCollections = client
      .db("rjTechDB")
      .collection("hiddenOrders");
    const hiddenFooterrCollections = client
      .db("rjTechDB")
      .collection("hiddenFooter");
    const hiddenPasswordCollections = client
      .db("rjTechDB")
      .collection("hiddenPasswordAdmin");

    // ---------------------------

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
    // End of cake paradise bd------------------------------

    // Hidden Cloth

    app.get("/hiddenProducts", async (req, res) => {
      const result = await hiddenProductCollections.find().toArray();
      res.send(result);
    });

    app.get("/hiddenProducts/:id", async (req, res) => {
      const id = req.params.id;

      // Validate if the provided ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ObjectId format" });
      }

      const query = { _id: new ObjectId(id) };
      const result = await hiddenProductCollections.findOne(query);

      if (!result) {
        return res.status(404).send({ error: "Product not found" });
      }

      res.send(result);
    });

    app.post("/hiddenProducts", async (req, res) => {
      try {
        const product = req.body;
        const result = await hiddenProductCollections.insertOne(product);
        // res.send(result);
        // await db.collection("products").insertOne(product);
        res.status(200).json({ message: "Product added" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Insert failed" });
      }
    });
    app.delete("/hiddenProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hiddenProductCollections.deleteOne(query);
      res.send(result);
    });

    app.get("/hiddenCategories", async (req, res) => {
      const result = await hiddenCategoryCollections.find().toArray();
      res.send(result);
    });

    app.post("/hiddenCategories", async (req, res) => {
      try {
        const product = req.body;
        const result = await hiddenCategoryCollections.insertOne(product);
        // res.send(result);
        // await db.collection("products").insertOne(product);
        res.status(200).json({ message: "Product added" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Insert failed" });
      }
    });

    app.delete("/hiddenCategories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await hiddenCategoryCollections.deleteOne(query);
      res.send(result);
    });

    app.get("/hiddenOrders", async (req, res) => {
      const result = await hiddenConfirmOrderCollections.find().toArray();
      res.send(result);
    });

    app.get("/hiddenOrders/:id", async (req, res) => {
      const id = req.params.id;

      // Validate if the provided ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ObjectId format" });
      }

      const query = { _id: new ObjectId(id) };
      const result = await hiddenConfirmOrderCollections.findOne(query);

      if (!result) {
        return res.status(404).send({ error: "Product not found" });
      }

      res.send(result);
    });
    app.post("/hiddenOrders", async (req, res) => {
      try {
        const product = req.body;
        const result = await hiddenConfirmOrderCollections.insertOne(product);
        res
          .status(200)
          .json({ message: "Product added", insertedId: result.insertedId });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Insert failed" });
      }
    });
    // Update order status by admin
    app.patch("/hiddenOrders/:id", async (req, res) => {
      const id = req.params.id;

      console.log("hiddenOrdershiddenOrders", id);
      const { action } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      const filter = { _id: new ObjectId(id) };
      let updateDoc = {};

      if (action === "confirm") {
        updateDoc = {
          $set: { status: "confirmed", delivery: "pending" },
        };
      } else if (action === "deliver") {
        updateDoc = {
          $set: { status: "confirmed", delivery: "done" },
        };
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }

      try {
        const result = await hiddenConfirmOrderCollections.updateOne(
          filter,
          updateDoc
        );
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "Order not found or already updated" });
        }
        res.send({ message: "Order updated successfully" });
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/orderDetails", async (req, res) => {
      try {
        const { ids } = req.body; // Assume you send an array of ids
        console.log(ids);
        const objectIds = ids.map((id) => new ObjectId(id)); // Convert string IDs to ObjectId
        const query = { _id: { $in: objectIds } }; // Use $in to match any of the IDs
        const result = await hiddenConfirmOrderCollections
          .find(query)
          .toArray(); // Fetch matching documents
        console.log(result); // Optional: Check the data in the server console

        res.status(200).send(result); // Return the matching documents
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts" });
      }
    });

    // footer
    app.get("/hiddenFooter", async (req, res) => {
      // const result = await hiddenFooterrCollections.find().toArray();
      // res.send(result);
      const footerData = await hiddenFooterrCollections.find().toArray();
      const categoryData = await hiddenCategoryCollections.find().toArray();
      res.send({
        footerData,
        categoryData,
      });
    });
    app.put("/hiddenFooter/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;

      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          phone: updatedInfo.phone,
          email: updatedInfo.email,
          address: updatedInfo.address,
        },
      };

      try {
        const result = await hiddenFooterrCollections.updateOne(
          filter,
          updateDoc
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating footer info:", error);
        res.status(500).send({ message: "Failed to update footer info" });
      }
    });

    // GET hiddenPassword (only return password field)
    app.get("/hiddenPasswordAdmin", async (req, res) => {
      try {
        const passwordData = await hiddenPasswordCollections
          .find({}, { projection: { password: 1 } }) // only password field
          .toArray();

        res.send(passwordData);
      } catch (error) {
        console.error("Error fetching password:", error);
        res.status(500).send({ message: "Failed to fetch password" });
      }
    });

    app.post("/hiddenPasswordAdmin", async (req, res) => {
      const { oldPassword, newPassword } = req.body;

      try {
        const existing = await hiddenPasswordCollections.findOne({});
        if (!existing) {
          return res.status(404).send({ error: "Admin password not found" });
        }

        // Compare old password directly
        if (existing.password !== oldPassword) {
          return res.status(401).send({ error: "Old password is incorrect" });
        }

        // Update password
        const filter = { _id: existing._id };
        const updateDoc = { $set: { password: newPassword } };

        await hiddenPasswordCollections.updateOne(filter, updateDoc);
        res.send({ message: "Password updated successfully" });
      } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).send({ error: "Password update failed" });
      }
    });

    // PUT hiddenPassword/:id — update password
    app.put("/hiddenPasswordAdmin/:id", async (req, res) => {
      const id = req.params.id;
      const { password } = req.body;

      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          password, // Ideally hash this
        },
      };

      try {
        const result = await hiddenPasswordCollections.updateOne(
          filter,
          updateDoc
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send({ message: "Failed to update password" });
      }
    });

    // End of Hidden Cloth

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
