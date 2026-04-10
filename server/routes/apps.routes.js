const express = require("express");
const { getApps, getSingleApp } = require("../controllers/apps.controller");
const router = express.Router();

const appRoutes = (appsCollection) => {
  const router = express.Router();

  router.get("/", (req, res, next) =>
    getApps(req, res, appsCollection).catch(next),
  );


  
  router.get("/:id", (req, res, next) =>
    getSingleApp(req, res, appsCollection).catch(next),
  );



  return router;
};


module.exports = {appRoutes}