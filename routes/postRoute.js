const express = require("express");
const router = express.Router();
const {
  getAllPost,
  createPost,
  getOnePost,
  updatePost,
  deletePost,
} = require("../controller/postController");

router.route("/").get(getAllPost).post(createPost);
router.route("/:id").get(getOnePost).patch(updatePost).delete(deletePost);

module.exports = router;
