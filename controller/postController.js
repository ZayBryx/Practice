const Post = require("../models/Post.js");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../Errors/custom-error.js");
const { default: mongoose } = require("mongoose");

const getAllPost = async (req, res) => {
  const post = await Post.find({});

  res.status(StatusCodes.OK).json(post);
};

const createPost = async (req, res) => {
  const { title, body } = req.body;

  const post = await Post.create({ title, body });
  res.status(StatusCodes.CREATED).json(post);
};

const getOnePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new CustomError(`Invalid ID: ${id}`, StatusCodes.BAD_REQUEST);
  }

  const post = await Post.findById(id);

  if (!post) {
    throw new CustomError(`ID:${id} not found`, StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(post);
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new CustomError(`Invalid ID: ${id}`, StatusCodes.BAD_REQUEST);
  }

  const post = await Post.findByIdAndUpdate(id, { title, body });

  if (!post) {
    throw new CustomError(`ID:${id} not found`, StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(post);
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new CustomError(`Invalid ID: ${id}`, StatusCodes.BAD_REQUEST);
  }

  const post = await Post.findByIdAndDelete(id);

  if (!post) {
    throw new CustomError(`ID:${id} not found`, StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAllPost,
  createPost,
  getOnePost,
  updatePost,
  deletePost,
};
