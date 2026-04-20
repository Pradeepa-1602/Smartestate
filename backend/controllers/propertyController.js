const db = require("../db/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM properties", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.add = (req, res) => {
  const owner_id = req.body.owner_id;
  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const price = req.body.price;
  const property_type = req.body.property_type;

  const image = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO properties (owner_id,title,description,location,price,property_type,image) VALUES (?,?,?,?,?,?,?)",
    [owner_id, title, description, location, price, property_type, image],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Property added successfully" });
    }
  );
};

exports.remove = (req, res) => {
  db.query("DELETE FROM properties WHERE property_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
};