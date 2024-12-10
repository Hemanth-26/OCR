const express = require('express');
const fileUpload = require('express-fileupload');
// const multer = require('multer');
const path = require('path');
const dotenv = require("dotenv");
const cors = require('cors');
const setupSwagger = require('./utils/swagger');

const app = express();
// const upload = multer();
dotenv.config();

/**Custom Modules */
const OcrRouter = require('./routers/ocrRouter');

/**Local Variables */
const port = process.env.PORT || 4000;
const appUrl = process.env.APP_URL || `http://localhost:${port}`;

/**Middleware */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.array());
// Use the express-fileupload middleware
app.use(fileUpload());

setupSwagger(app);

/**Routers */
app.use('/ocr', OcrRouter);

/**Requests */
app.get('/sample-table.pdf', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/sample-table.pdf'));
});
app.get('/images/sample-image-1.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/sample-image1.jpg'));
});
app.get('/images/sample-image-2.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/sample-image2.png'));
});
app.get('/images/handwrite.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/handwrite.jpg'));
});
app.get('/sample.pdf', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/sample.pdf'));
});

app.get("/", (req, res) => {
    res.status(200).send("Server Running Successfully");
});


console.log(appUrl);
const server = app.listen(port, () => {
    console.log(`Server listening on ${appUrl}`);
    console.log(`Swagger Documentation at ${appUrl}/api-docs`);
});

server.on('error', (err) => {
    console.error("Error : Could not connect to server");
});