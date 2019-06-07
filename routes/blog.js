const express = require("express");

const blogController = require("../controllers/blog");

const router = express.Router();

router.get("/", blogController.getIndex);

router.get("/blog", blogController.getBlog);

router.post("/blog/new", blogController.addNewPost);

router.get("/blog/:postID", blogController.getPost);

module.exports = router;
