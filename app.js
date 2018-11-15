const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Passport Routes config
require("./config/passport")(passport);

//BD CONFIG URL
const db = require("./config/database");

// golbal promise get rid of warning mongo
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDb connected ..."))
  .catch(err => console.log(err));

// Middleware handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Method override Middleware
app.use(methodOverride("_method"));

//Express Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Index Route
app.get("/", (req, res) => {
  const title = "welcome";
  res.render("index", {
    title: title
  });
});

//About Page
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
