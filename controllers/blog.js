const Post = require("../models/post");

exports.getIndex = (req, res, next) => {
  if (req.isLogged) return res.redirect("/blog");

  res.render("blog/noauthindex", {
    pageTitle: "Private Blog",
    path: "/",
    isLogged: false
  });
};

exports.getBlog = (req, res, next) => {
  if (!req.isLogged) return res.redirect("/");

  Post.fetchAll(posts => {
    res.render("blog/index", {
      pageTitle: "Posts - Private Blog",
      path: "/blog",
      isLogged: req.isLogged,
      posts: posts
    });
  });
};

exports.addNewPost = (req, res, next) => {
  if (!req.isLogged || !req.isLogged.user.isAdmin) return res.redirect("/");

  const newPost = new Post(null, req.isLogged.user.user, "", "");
  newPost.save(postCreated => {
    res.redirect(`/blog/${postCreated.id}?newpost=1`);
  });
};

exports.getPost = (req, res, next) => {
  if (!req.isLogged) return res.redirect("/");

  const postID = req.params.postID;
  return Post.findById(postID, p => {
    if (req.isLogged.user.isAdmin) {
      let editing = false;
      let newpost = false;

      if (req.query.newpost === "1") newpost = true;
      if (req.query.editing === "1") editing = true;

      res.render("blog/post", {
        pageTitle: `${newpost ? "New Post" : p.title} - Private Blog`,
        path: `/blog/${postID}`,
        isLogged: req.isLogged,
        post: p,
        newpost: newpost,
        editing: editing
      });
    } else {
      res.render("blog/post", {
        pageTitle: `${p.title} - Private Blog`,
        path: `/blog/${postID}`,
        isLogged: req.isLogged,
        post: p,
        newpost: false,
        editing: false
      });
    }
  });
};
