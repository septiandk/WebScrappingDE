const express = require('express');
const router = express.Router();
const fs = require('fs');

// API route
router.get('/', (req, res) => {
  // Read the CSV file
  const csvFilePath = 'products.csv';
  const csvFile = fs.readFileSync(csvFilePath, 'utf-8');
  // Parse the CSV data
  const lines = csvFile.split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const product = {};
    headers.forEach((header, index) => {
      product[header] = values[index];
    });
    return product;
  });
  res.json(data);
});

module.exports = router;
