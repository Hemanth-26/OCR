const OcrRouter = require("express").Router();
const { ImageToText, } = require("../controllers/ocrController");

/**
 * @swagger
 * /ocr/image-to-text:
 *   post:
 *     summary: Converts an image or PDF to text using Azure OCR API
 *     description: >
 *       Upload an image or PDF file to extract text using Azure's OCR service. 
 *       Features: 
 *       - Handwriting recognition: Supports handwritten text in images.
 *       - Multi-language support: Automatically detects and extracts text in supported languages.
 *       Supported file formats: 
 *       - Images: JPEG, PNG, BMP, TIFF
 *       - PDFs: Text or image-based PDF files.
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
 *                 description: >
 *                   The image or PDF file to be processed for OCR. 
 *                   Supported formats: JPEG, PNG, BMP, TIFF, PDF.
 *                   Supports handwritten text and multi-language extraction.
 *     responses:
 *       200:
 *         description: Successfully extracted text from the uploaded image or PDF.
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
 *                   description: The full extracted text.
 *                   example: "Hola mundo. This is OCR."
 *                 detailedData:
 *                   type: array
 *                   description: Detailed breakdown of extracted text by page and line.
 *                   items:
 *                     type: object
 *                     properties:
 *                       page:
 *                         type: integer
 *                         description: Page number of the text.
 *                         example: 1
 *                       line:
 *                         type: integer
 *                         description: Line number on the page.
 *                         example: 1
 *                       text:
 *                         type: string
 *                         description: The text of the line.
 *                         example: "Hola mundo"
 *       400:
 *         description: >
 *           Bad request. Possible reasons: 
 *           - No file uploaded 
 *           - Unsupported file format 
 *           - No text could be extracted from the uploaded file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file was uploaded or file format is not supported."
 *       500:
 *         description: Internal server error, possibly related to Azure OCR API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error occurred while processing the file with Azure OCR API."
 */

OcrRouter.post("/image-to-text", ImageToText);

module.exports = OcrRouter;
