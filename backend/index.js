const express = require("express");
const { userRouter } = require("./Routes/User");

const app = express();

app.use("/api/user/v1", userRouter);

const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
