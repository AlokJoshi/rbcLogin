const express = require("express");
// const bcrypt = require("bcrypt"); 
const {userExists, addUser, passwordMatches, changePassword,registeredUsers} = require("./credentials");

const app = express();
const PORT = 3000;
// const users = []; // This would typically be a database
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/register", async (req, res) => {
  //check if user exists
  if (await userExists(req.body.username)) {
    return  res.status(409).send("User already exists");
  }

  try {
    const { username, password } = req.body;
    const success = await addUser(username, password);
    if (!success) {
      return res.status(500).send("Error registering user");
    } 
    res.status(201).send("User registered successfully");
  } catch {
    res.status(500).send("Error registering user");
  }
});
  
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userExists = await userExists(req.body.username);
  if (!userExists) {
    return res.status(404).send("User not found");
  }
  const isPasswordValid = await passwordMatches(username, password);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid password");
  }
  res.status(200).send("Login successful");
}); 

app.post("/changePassword", async (req, res) => {
  const { username, existingPassword, newPassword } = req.body;
  const userExists = await userExists(req.body.username);
  if (!userExists) {
    return res.status(404).send("User not found");
  }
  const isPasswordValid = await passwordMatches(username, existingPassword);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid password");
  }
  const success = await changePassword(username, newPassword);
  if (!success) {
    return res.status(500).send("Error changing password");
  }
  res.status(200).send("Password changed successfully");
}); 

app.get("/registeredusers", async (req, res) => {
  res.json(await registeredUsers());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
