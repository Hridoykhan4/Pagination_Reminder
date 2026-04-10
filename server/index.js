//Definition & imports
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const morgan = require("morgan");
const { appRoutes } = require("./routes/apps.routes");
const app = express();

// Middlewares
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(async (req, res, next) => {
//   console.log(
//     `⚡ ${req.method} - ${req.path} from ${
//       req.host
//     } at ⌛ ${new Date().toLocaleString()}`,
//   );
//   next();
// });

//ports & clients
const port = process.env.PORT || 5000;
const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//listeners
client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Hero Apps Server listening ${port}`);
      console.log(`Hero Apps Server Connected with DB`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//DB & collections
const database = client.db("Amazon");
const appsCollection = database.collection("apps");
app.use("/apps", appRoutes(appsCollection));

// Basic routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Hero Apps Server" });
});

//404
app.all(/.*/, (req, res) => {
  res.status(404).json({
    status: 404,
    error: "API not found",
  });
});
