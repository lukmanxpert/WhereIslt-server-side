const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/latest-posts", async (req, res) => {
      const cursor = allPosts.find({}).sort({ date: -1 }).limit(6);
      const latestPosts = await cursor.toArray();
      res.send(latestPosts);
    });

    app.post("/posts", async (req, res) => {
      const newPost = req.body;
      const result = await allPosts.insertOne(newPost);
      res.json(result);
    });

    app.get("/posts", async (req, res) => {
      const cursor = allPosts.find({});
      const posts = await cursor.toArray();
      res.send(posts);
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
