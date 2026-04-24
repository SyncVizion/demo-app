const compression = require('compression');
const path = require('path');
const express = require('express');
const app = express();

// Gzip
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(__dirname + '/dist/card-market-ui'));

// Return index.html for all GET requests for PathLocationStrategy
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/card-market-ui/index.html'));
});

console.log('Application Succesfully Started!');
app.listen(process.env.PORT || 8050);

console.log('Sending Production Request update');

const url = `https://${process.env.apiUrl}`;

fetch(`${url}/v1/auth`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: process.env.refreshUser, password: process.env.refreshPassword }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error getting auth: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    fetch(`${url}/v1/subscription/app/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .then((response) => {
        if (response.status !== 204) {
          throw new Error(`Error refreshing app: ${response.status}`);
        }
        console.log('Refresh response complete');
      })
      .catch((error) => {
        console.error('There was a problem refresh call:', error);
      });
  })
  .catch((error) => {
    console.error('There was a problem with getting auth:', error);
  });
