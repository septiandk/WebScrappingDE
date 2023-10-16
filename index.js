// Add this to the very top of the first file loaded in your app
var apm = require('elastic-apm-node').start({
  serviceName: 'my-service-name',
  secretToken: '',
  serverUrl: 'http://localhost:8200',
  environment: 'my-environment'
})

const express = require('express');
const app = express();
const port = "80"
app.get('/', function(request, response){
    response.sendFile(__dirname+'/views/index.html');
});
// Scrape route
app.use('/scrape', require('./process/scrapeProcess'));

// API route
app.use('/api/products', require('./process/readCsv'));

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
