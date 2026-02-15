const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/provider", require("./routes/providerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));

app.listen(5000, () => {
  console.log("Dial4Service Backend Running");
});
