const express = require("express");
const cors = require("cors");

const app = express();

const auth = require("./middleware/auth");

const notificationRoutes =
  require("./routes/notifications");


app.use(cors());

app.use(express.json());


// Home Route
app.get("/", (req, res) => {
  res.send("Notification API Running");
});


// Protected Notification Routes
app.use(
  "/notifications",
  auth,
  notificationRoutes
);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});