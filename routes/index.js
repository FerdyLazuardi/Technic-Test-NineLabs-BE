const router = require("express").Router();

// import package swagger
// const swaggerUi = require("swagger-ui-express");
// import file json
// const swaggerDocument = require('../docs/swagger.json');

// api docs
// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(swaggerDocument));

const User = require("./user");
const Task = require("./task");

// API server
router.use("/api/v1/user/", User);
router.use("/api/v1/task/", Task);

module.exports = router;
