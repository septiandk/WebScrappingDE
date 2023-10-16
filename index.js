import { init as initApm } from '@elastic/apm-rum'
var apm = initApm({
  serviceName: 'my-service-name',
  serverUrl: 'https://elastic.psngroup.cloud:8200',
  serviceVersion: '',
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
