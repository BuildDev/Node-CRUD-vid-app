if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://achref:jako366459@ds039351.mlab.com:39351/vid-dev"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/vid-dev" };
}
