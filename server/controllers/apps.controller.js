const { ObjectId } = require("mongodb");

const getApps = async (req, res, appsCollection) => {
  try {
    const { limit = 0, page = 0 } = req.query;
    const requestedLimit = parseInt(limit, 10) || 8;
    const limitNum = Math.max(1, Math.min(requestedLimit, 100));
    const pageNum = Math.max(1, parseInt(page, 10));
    const skip = (pageNum - 1) * 10 || 0;
    const projection = {
      description: 0,
      rating: 0,
      companyName: 0,
      size: 0,
      reviews: 0,
      ratings: 0,
    };
    const [totalApps, apps] = await Promise.all([
      appsCollection.countDocuments(),
      await appsCollection
        .find()
        .project(projection)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
    ]);

    res.status(200).send({totalApps, apps});
  } catch (error) {
    console.error("Error fetching apps:", error);
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
