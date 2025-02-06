import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login-Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Nutzerdaten aus der JSON-Datei laden
  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

  // Überprüfen, ob die Anmeldedaten übereinstimmen
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ message: "Login erfolgreich!" });
  } else {
    res.json({ message: "Falsche Anmeldedaten!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
