const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (the built website)
app.use(express.static('dist'));

// Content file path
const CONTENT_FILE = path.join(__dirname, 'content.json');

// Get content
app.get('/api/content', (req, res) => {
  try {
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read content' });
  }
});

// Update content
app.post('/api/content', (req, res) => {
  try {
    const newContent = req.body;
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2));
    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve the main app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Website: http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});
