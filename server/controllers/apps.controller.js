const { ObjectId } = require("mongodb");

const ALLOWED_SORT_FIELDS = new Set([
  "size",
  "ratingAvg",
  "downloads",
  "title",
]);
const ALLOWED_ORDERS = new Set(["asc", "desc"]);

const getApps = async (req, res, appsCollection) => {
  try {
    const {
      limit = "12",
      page = "1",
      sort = "size",
      order = "desc",
      search = "",
      category = "",
    } = req.query;

    // ── Sanitize ──────────────────────────────────────────────
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (pageNum - 1) * limitNum;

    // ✅ Whitelist sort field — prevents NoSQL injection via sort
    const sortField = ALLOWED_SORT_FIELDS.has(sort) ? sort : "size";
    const sortDir = ALLOWED_ORDERS.has(order) ? order : "desc";

    // ── Query ─────────────────────────────────────────────────
    const query = {};
    if (search.trim()) {
      query.$or = [{ title: { $regex: search.trim(), $options: "i" } }];
    }
    if (category.trim()) {
      query.category = category.trim();
    }

    const projection = {
      description: 0,
      companyName: 0,
      reviews: 0,
    };

    const [total, apps] = await Promise.all([
      appsCollection.countDocuments(query),
      appsCollection
        .find(query)
        .sort({ [sortField]: sortDir === "asc" ? 1 : -1 })
        .project(projection)
        .skip(skip)
        .limit(limitNum)
        .toArray(),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // ✅ Return pagination object — frontend never calculates this
    res.status(200).json({
      apps,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSingleApp = async (req, res, appsCollection) => {
  try {
    const { id } = req.params;

    // ✅ ObjectId.isValid() is more robust than a length check
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid app ID" });
    }

    const app = await appsCollection.findOne({ _id: new ObjectId(id) });

    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }

    res.status(200).json(app);
  } catch (error) {
    console.error("Error fetching app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getApps, getSingleApp };
