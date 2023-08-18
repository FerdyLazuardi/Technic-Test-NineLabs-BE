require("dotenv").config();

const express = require("express");
const port = process.env.PORT;
const app = express();
const cors = require("cors");
const ApiError = require("./utils/ApiError");
const router = require("./routes");
const httpStatus = require("http-status");

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(router);

// handler for request url not exist in our app
app.use((req, res, next) => {
  next(
    new ApiError(
      httpStatus.NOT_FOUND,
      `Cannot find this ${req.originalUrl} on this app....`
    )
  );
});

app.listen(port, () => {
  console.log(`Server running on ${Date(Date.now)}`);
  console.log(`Server listening on PORT: ${port}`);
});
