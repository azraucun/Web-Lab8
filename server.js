import express from 'express';

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Routes ---

// GET /hello -> plain text greeting
app.get('/hello', (req, res) => {
  res.type('text/plain');
  res.send("Hello from Azra's server");
});

// GET /robots.txt -> plain-text file for search engine bots
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/admin\n');
});

// GET /old-page -> redirect to /hello
app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});