const { ObjectId } = require("mongodb");

const getApps = async (req, res, appsCollection) => {
  try {
    const limit = Number(req?.query?.limit) || 10; 
    console.log(limit);
    const apps = await appsCollection
      .find()
      .project({
        description: 0,
        rating: 0,
        companyName: 0,
        size: 0,
        reviews: 0,
        ratings: 0,
      })
      .sort({ ratingAvg: -1 }).limit(limit)
      .toArray();
    res.send(apps);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSingleApp = async (req, res, appsCollection) => {
  try {
    const appId = req.params.id;

    if (appId.length != 24) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const query = new ObjectId(appId);
    const app = await appsCollection.findOne({ _id: query });
    res.json(app);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getApps, getSingleApp };
