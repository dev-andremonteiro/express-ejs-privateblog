const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "users.json"
);

const p2 = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "util.json"
);

const getUsersFromFile = (path, cb) => {
  fs.readFile(path, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class User {
  constructor(user, pass, isAdmin) {
    this.user = user;
    this.pass = pass;
    this.isAdmin = isAdmin;
  }

  static login(user, pass, cb) {
    getUsersFromFile(p, users => {
      const userFound = users.find(u => u.user === user);
      if (userFound) {
        if (userFound.pass === pass) {
          return fs.writeFile(
            p2,
            JSON.stringify({ loggedin: true, user: userFound }),
            err => {
              if (!err) {
                return cb(userFound);
              }
            }
          );
        }
      }
      cb(null);
    });
  }

  static logout(cb) {
    return fs.writeFile(p2, JSON.stringify({}), err => {
      if (err) return cb(false);
      cb(true);
    });
  }

  static signup(user, pass, repeat, isAdmin, cb) {
    getUsersFromFile(p, users => {
      const userFound = users.find(u => u.user === user);
      if (!userFound) {
        if (pass.length > 4) {
          if (pass === repeat) {
            const updatedUsers = [...users];
            const newUser = {
              user: user,
              pass: pass,
              isAdmin: isAdmin === "on"
            };
            updatedUsers.push(newUser);
            return fs.writeFile(p, JSON.stringify(updatedUsers), err => {
              if (!err) {
                return cb(newUser);
              }
            });
          } else {
            return cb("SU03");
          }
        } else {
          return cb("SU02");
        }
      } else {
        return cb("SU01");
      }
    });
  }

  static isLoggedIn(cb) {
    getUsersFromFile(p2, utilFile => {
      if (Object.keys(utilFile).length == 0) return cb(null);
      cb(utilFile);
    });
  }
};
