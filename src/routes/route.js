const express = require("express");
const router = express.Router();

const apiController = require("../controller/apicontroller");

router.get("/", apiController.verificar);
router.post("/", apiController.recibir);

module.exports = router;
