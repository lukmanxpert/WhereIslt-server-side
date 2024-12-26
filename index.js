const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 9000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l73rt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const database = client.db("whereislt");
    const allPosts = database.collection("posts");
    const recoveredPosts = database.collection("recoveredPosts");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/latest-posts", async (req, res) => {
      const cursor = allPosts.find({}).sort({ date: -1 }).limit(6);
      const latestPosts = await cursor.toArray();
      res.send(latestPosts);
    });

    app.get("/jobs", async (req, res) => {
      const cursor = allPosts.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my-items/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "contactInfo.email": email };
      const items = await allPosts.find(query).toArray();
      res.send(items);
    });

    app.post("/posts", async (req, res) => {
      const newPost = req.body;
      const result = await allPosts.insertOne(newPost);
      res.json(result);
    });

    app.post("/recovered-item", async (req, res) => {
      const recoveredItem = req.body;
      const result = await recoveredPosts.insertOne(recoveredItem);
      res.json(result);
    });

    app.put("/update-recovered-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const updated = {
        $set: data,
      };
      const options = { upsert: true };
      const result = await allPosts.updateOne(query, updated, options);
      console.log(data);
      res.send(result);
    });

    app.delete("/delete-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(req.params.id) };
      const result = await allPosts.deleteOne(query);
      res.send(result);
    });

    app.get("/posts", async (req, res) => {
      const cursor = allPosts.find({});
      const posts = await cursor.toArray();
      res.send(posts);
    });

    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const post = await allPosts.findOne({ _id: new ObjectId(id) });
      res.send(post);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
