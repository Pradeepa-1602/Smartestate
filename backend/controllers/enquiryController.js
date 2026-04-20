const db = require("../db/db");

exports.add = (req, res) => {
  const { property_id, buyer_id, name, phone, message } = req.body;

  db.query(
    "INSERT INTO enquiries (property_id,buyer_id,name,phone,message) VALUES (?,?,?,?,?)",
    [property_id, buyer_id, name, phone, message],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Enquiry sent" });
    }
  );
};

exports.getByOwner = (req, res) => {
  db.query(
    `SELECT 
      e.property_id,
      e.message,
      e.created_at,

      p.title,
      p.location,
      p.price,

      u.name AS buyer_name,
      e.phone AS buyer_phone

     FROM enquiries e
     JOIN properties p ON e.property_id = p.property_id
     JOIN users u ON e.buyer_id = u.user_id
     WHERE p.owner_id=?`,
    [req.params.owner_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

exports.getByBuyer = (req, res) => {
  db.query(
    `SELECT e.*, p.title, p.location, p.price 
     FROM enquiries e 
     JOIN properties p ON e.property_id = p.property_id
     WHERE e.buyer_id=?`,
    [req.params.buyer_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};