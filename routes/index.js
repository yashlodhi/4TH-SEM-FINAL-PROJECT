var express = require("express");
var router = express.Router();

var database = require("../database");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.render("Landing_Page", { title: "Express", session: req.session });
});

// GET Login And SignUP page
router.get("/login", function (req, res, next) {
  res.render("login", { msg: "" });
});

// CATS PRODUCTS
router.get("/cat-foods", async function (req, res) {
  await database.query("select * from cat_food", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Cat Foods",
      session: req.session,
    });
  });
});

router.get("/cat-toys", async function (req, res) {
  await database.query("select * from cat_toys", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Cat Toys",
      session: req.session,
    });
  });
});

router.get("/cat-treats", async function (req, res) {
  await database.query(
    "select * from cat_treats_biscuits",
    function (error, results) {
      res.render("Products", {
        foodArray: results,
        Text: "Cat Treats",
        session: req.session,
      });
    }
  );
});

router.get("/cat-leashes", async function (req, res) {
  await database.query("select * from cat_leash", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Cat Leashes",
      session: req.session,
    });
  });
});

// DOG PRODUCTS
router.get("/dog-foods", async function (req, res) {
  await database.query("select * from dog_food", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Dog Foods",
      session: req.session,
    });
  });
});

router.get("/dog-toys", async function (req, res) {
  await database.query("select * from dog_toys", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Dog Toys",
      session: req.session,
    });
  });
});

router.get("/dog-treats", async function (req, res) {
  await database.query(
    "select * from dog_treat_biscuits_chewys",
    function (error, results) {
      res.render("Products", {
        foodArray: results,
        Text: "Dog Treats",
        session: req.session,
      });
    }
  );
});

router.get("/dog-leashes", async function (req, res) {
  await database.query("select * from dog_leash", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Dog Leashes",
      session: req.session,
    });
  });
});

//BIRD PRODUCTS
router.get("/bird-foods", async function (req, res) {
  await database.query("select * from bird_food", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Bird Foods",
      session: req.session,
    });
  });
});

router.get("/bird-toys", async function (req, res) {
  await database.query("select * from bird_toys", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Bird Toys",
      session: req.session,
    });
  });
});

router.get("/bird-cages", async function (req, res) {
  await database.query("select * from bird_cage", function (error, results) {
    res.render("Products", {
      foodArray: results,
      Text: "Bird Cages",
      session: req.session,
    });
  });
});
router.post("/cart", async function (req, res) {
  const productid = req.body.product;
  await database.query(
    "insert into cart set ?",
    { product_id: productid, user_id: 0 },
    async (error, result) => {
      if (error) {
        return res.render("/");
      } else {
        try {
          var productsofcart = [];
          await database.query(`SELECT * FROM cart;`, async (error, results) => {
            for (const result of results) {
              await database.query(`SELECT * FROM cat_food WHERE product_id=${result.product_id}`, (error, data) => {
                 productsofcart.push(data[0]);
                 if(results.length == productsofcart.length) {
                    return res.render('cart', { productsofcart });
                 }
              });
            }
          });
          productsofcart = [];
          await database.query(`SELECT * FROM cart;`, async (error, results) => {
            for (const result of results) {
              await database.query(`SELECT * FROM cat_toys WHERE product_id=${result.product_id}`, (error, data) => {
                 productsofcart.push(data[0]);
                 if(results.length == productsofcart.length) {
                    return res.render('cart', { productsofcart });
                 }
              });
            }
          });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving cart data');
        }
      }
    }
  );
});
router.get("/cart", async function (req, res) {
  try {
    var productsofcart = [];
    await database.query(`SELECT * FROM cart;`, async (error, results) => {
      for (const result of results) {
        await database.query(`SELECT * FROM cat_food WHERE product_id=${result.product_id}`, (error, data) => {
           productsofcart.push(data[0]);
           if(results.length == productsofcart.length) {
              return res.render('cart', { productsofcart });
           }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving cart data');
  }
});

router.post("/removefromcart", async function(req, res) {
  try {
    let productid = req.body.productid;
    var productsofcart = [];
    await database.query(`DELETE FROM cart WHERE product_id=${productid}`, async (error, results) => {
      return res.redirect("/cart");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving cart data');
  }
});

router.get("/payment", function (req, res, next) {
  res.render("payment", { msg: "" });
});

router.get("/contact", function (req, res, next) {
  res.render("contact", { msg: "" });
});

router.get("/about", function (req, res, next) {
  res.render("about", { msg: "" });
});

router.post("/login", function (req, res) {
  console.log("req" + req.body.username);
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);

  database.query(
    "select * from user where user_name = ? and user_password = ?",
    [username, password],
    function (error, results, fields) {
      if (results.length > 0) {
        for (var count = 0; count < results.length; count++) {
          console.log(results);
          console.log("login successful");
          req.session.user_id = results[count].user_id;
          req.session.user_email = results[count].user_email;
          res.redirect("/");
        }
      } else {
        console.log(error);
        res.render("login");
      }
      res.end();
    }
  );
});

router.post("/signup", function (req, res) {
  console.log("req" + req.body.username);
  var username = req.body.username1;
  var password = req.body.password1;
  var confirmPassword = req.body.confirmpassword;
  console.log(username);
  console.log(password);
  console.log(confirmPassword);

  database.query(
    "select user_name from user where user_name=?",
    [username],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        return res.render("login", {
          msg: "Username already Taken",
          msg_type: "error",
          signupwindow: true,
        });
      } else if (password !== confirmPassword) {
        return res.render("login", {
          msg: "Password do not match",
          msg_type: "error",
          signupwindow: true,
        });
      }

      database.query(
        "insert into user set ?",
        { user_name: username, user_password: password, user_session_id: "" },
        (error, result) => {
          if (error) {
            res.render("login", { msg: "" });
          } else {
            res.render("login", { msg: "" });
          }
        }
      );
    }
  );
});

router.get("/logout", function (request, response, next) {
  request.session.destroy();

  response.redirect("/");
});

module.exports = router;