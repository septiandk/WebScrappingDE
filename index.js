const express = require('express');
const app = express();
const port = "3000"
app.get('/', function(request, response){
    response.sendFile(__dirname+'/views/index.html');
});
// Scrape route
app.use('/scrape', require('./process/scrapeProcess'));

// API route
app.use('/api/products', require('./process/readCsv'));

// Start the server
app.listen(3000, () => {
  console.log(`Server started on http://localhost:${port}`);
});
