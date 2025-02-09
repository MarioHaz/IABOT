const express = require("express");
const router = express.Router();

const apiController = require("../controller/apicontroller");

router.get("/", apiController.recibir);
router.post("/", apiController.verificar);

module.exports = router;
