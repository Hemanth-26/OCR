const OcrRouter = require("express").Router();
const { ImageToText, ExtractText } = require("../controllers/ocrController");

/**
 * @swagger
 * /ocr/image-to-text:
 *   post:
 *     summary: Converts image to text using Azure OCR API
 *     description: Upload an image file and get the extracted text as a sentence using Azure's OCR service. Includes detailed breakdown.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               processFile:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be processed for OCR
 *     responses:
 *       200:
 *         description: OCR result from Azure, converted into a single sentence with detailed data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 extractedText:
 *                   type: string
 *                   description: The extracted text as a sentence
 *                   example: "Hello world This is OCR"
 *                 detailedData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       region:
 *                         type: integer
 *                         description: Region number
 *                       line:
 *                         type: integer
 *                         description: Line number within the region
 *                       text:
 *                         type: string
 *                         description: Text of the line
 *                         example: "Hello world"
 *       400:
 *         description: Bad request, no file uploaded, file format error, or no text could be extracted from the uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The uploaded file could not extract or process any data."
 *       500:
 *         description: Internal server error, possibly related to Azure OCR API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error calling Azure OCR API."
 */

OcrRouter.post("/image-to-text", ImageToText);


// OcrRouter.post("/extract-text", ExtractText);

module.exports = OcrRouter;
