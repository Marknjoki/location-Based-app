const express = require('express');
const path = require('path');
const app = express();
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000"
}))


// Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, './frontend')));


// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve(_dirname, './frontend/index.html'));
});

// Start the server
app.listen('3000', () => {
    console.log(`Server is running on port 3000...`);
});
