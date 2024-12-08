const express = require('express');
const fileUpload = require('express-fileupload');
// const multer = require('multer');
const dotenv = require("dotenv");
const cors = require('cors');
const setupSwagger = require('./utils/swagger');

const app = express();
// const upload = multer();
dotenv.config();

/**Custom Modules */
const OcrRouter = require('./routers/ocrRouter');

/**Local Variables */
const PORT = process.env.PORT;

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
app.get("/", (req, res) => {
    res.status(200).send("Server Running Successfully");
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Swagger Documentation at http://localhost:${PORT}/api-docs`);
});

server.on('error', (err) => {
    console.error("Error : Could not connect to server");
});