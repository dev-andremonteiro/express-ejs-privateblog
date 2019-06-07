const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "posts.json"
);

const getPostsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Post {
  constructor(id, user, title, desc) {
    this.id = id;
    this.creationDate = null;
    this.user = user;
    this.title = title;
    this.desc = desc;
  }

  save(cb) {
    getPostsFromFile(posts => {
      if (this.id) {
        const existingPostIndex = posts.findIndex(post => post.id === this.id);
        const updatedPosts = [...posts];
        updatedPosts[existingPostIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedPosts), err => {
          if (!err) return cb(this);
          console.log(err);
        });
      } else {
        this.id = Math.floor(Math.random() * 100000).toString();
        this.creationDate = new Date();
        posts.push(this);
        fs.writeFile(p, JSON.stringify(posts), err => {
          if (!err) return cb(this);
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getPostsFromFile(posts => {
      const updatedPosts = posts.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedPosts), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getPostsFromFile(cb);
  }

  static findById(id, cb) {
    getPostsFromFile(posts => {
      const post = posts.find(p => p.id === id);
      cb(post);
    });
  }
};
