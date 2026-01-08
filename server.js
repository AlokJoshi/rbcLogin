const express = require("express");
const bcrypt = require("bcrypt"); 
const app = express();
const PORT = 3000;
const users = []; // This would typically be a database
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Here you would typically store the username and hashedPassword in your database
    users.push({ username, password: hashedPassword });
    res.status(201).send("User registered successfully");
  } catch {
    res.status(500).send("Error registering user");
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);  
  if (!user) {
    return res.status(404).send("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid password");
  }
  res.status(200).send("Login successful");
}); 

app.get("/users", async (req, res) => {
  res.json(users);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
