const OcrRouter = require("express").Router();
const { ImageToText, TabletoJson } = require("../controllers/ocrController");

/**
 * @swagger
 * /ocr/image-to-text:
 *   post:
 *     summary: Converts an image or PDF to text using Azure OCR API
 *     tags:
 *       - Converts an image or PDF to text Extraction
 *     description: >
 *       Upload an image or PDF file to extract text using Azure's OCR service.
 *       Features: 
 *       - Handwriting recognition: Supports handwritten text in images.
 *       - Multi-language support: Automatically detects and extracts text in supported languages.
 *       Supported file formats: 
 *       - Images: JPEG, PNG, BMP, TIFF
 *       - PDFs: Text or image-based PDF files.
 *       
 *       Example images and PDF for testing:
 * 
 *       <div style="text-align: left; margin-bottom: 20px;">
 *         <div style="display: flex; justify-content: flex-start; gap: 10px;">
 *           <img src="http://137.184.77.186:4000/images/sample-image-1.jpg" width="200px" height="200px" />
 *           <img src="http://137.184.77.186:4000/images/sample-image-2.jpg" width="200px" height="200px" />
 *           <img src="http://137.184.77.186:4000/images/handwrite.jpg" width="200px" height="200px" />
 *         </div>
 *         <br><br>
 *         <a href="http://137.184.77.186:4000/sample.pdf" target="_blank">View Example PDF</a>
 *         <br><br>
 *       </div>
 *       
 *       These are sample images and a PDF that can be uploaded for text extraction using OCR.
 *       
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

/**
 * @swagger
 * /ocr/table-to-json:
 *   post:
 *     summary: Extract tabular data from PDF
 *     description: Accepts a PDF file, processes it using Azure Form Recognizer, and returns the tabular data in JSON format.
 *     tags:
 *       - Table Extraction
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
 *                 description: The PDF file containing tabular data. Example PDF file is available at [View sample PDF](http://localhost:4000/sample-table.pdf).
 *                 example: "Upload a PDF file. Example: [Download sample PDF](http://localhost:4000/sample-table.pdf)"
 *           encoding:
 *             processFile:
 *               contentType: application/pdf
 *     responses:
 *       '200':
 *         description: Successfully extracted table data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 tables:
 *                   type: array
 *                   description: Extracted tables with header and body.
 *                   items:
 *                     type: object
 *                     properties:
 *                       header:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Year", "Revenue ($)", "Expenses ($)", "Profit ($)"]
 *                       body:
 *                         type: array
 *                         items:
 *                           type: array
 *                           items:
 *                             type: string
 *                         example:
 *                           - ["2021", "5,00,000", "3,00,000", "2,00,000"]
 *                 extractedData:
 *                   type: array
 *                   description: Raw extracted data from Azure Form Recognizer.
 *                   items:
 *                     type: object
 *       '400':
 *         description: Bad request due to missing file, incorrect file type, or processing failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bad request, no file uploaded or file format error
 *       '404':
 *         description: No tables found in the document.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tables found in the document.
 */

OcrRouter.post("/table-to-json", TabletoJson);

module.exports = OcrRouter;
