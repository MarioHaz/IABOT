const express = require("express");
const apiRuta = require("./routes/route");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", apiRuta);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
