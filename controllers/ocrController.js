const axios = require("axios");

// Process an image to Text by Azure OCR API
const ImageToText = async (req, res) => {
    try {
        if (!req.files || !req.files.processFile) {
            return res.status(400).send('No file was uploaded.');
        }

        const processFile = req?.files?.processFile;

        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/bmp',
            'image/tiff',
            'application/pdf' // PDF support
        ];

        if (!allowedMimeTypes.includes(processFile.mimetype)) {
            return res.status(400).send('Uploaded file must be an image.');
        }

        // Convert the uploaded to a Buffer
        const processFileBuffer = processFile?.data;

        // console.log('Buffer:', processFileBuffer);

        // Call Azure OCR API
        const response = await axios.post(
            `${process.env.AZURE_API_ENDPOINT}/vision/v3.2/read/analyze`,
            processFileBuffer,
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
                    "Content-Type": "application/octet-stream",
                },
            }
        );

        // Step 2: Extract the operation-location URL
        const operationLocation = response.headers['operation-location'];
        if (!operationLocation) {
            throw new Error('Operation location header not found in response.');
        }

        // Step 3: Poll for results
        let ocrResult;
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            const resultResponse = await axios.get(operationLocation, {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
                },
            });
            ocrResult = resultResponse.data;

            if (ocrResult.status === 'succeeded') {
                break;
            } else if (ocrResult.status === 'failed') {
                throw new Error('OCR processing failed.');
            }
        }

        // Step 4: Return the OCR data
        // console.log(ocrResult.analyzeResult.readResults);

        const readResults = ocrResult.analyzeResult.readResults;
        let extractedText = '';
        let detailedData = [];

        if (readResults && readResults.length > 0) {
            readResults.forEach((page, pageIndex) => {
                page.lines.forEach((line, lineIndex) => {
                    const lineText = line.text;
                    extractedText += lineText + '\n';
                    detailedData.push({
                        page: pageIndex + 1,
                        line: lineIndex + 1,
                        text: lineText,
                    });
                });
            });
        }

        extractedText = extractedText.trim();

        // If no text is extracted, return a meaningful error
        if (!extractedText) {
            return res.status(400).json({ message: 'No text could be extracted from the uploaded image.' });
        }

        // Step 6: Respond with extracted data
        res.status(200).json({
            status: 'success',
            extractedText: extractedText, // Full text extracted
            detailedData: detailedData,   // Detailed breakdown of extracted text
        });

    } catch (error) {
        // console.error(error.response);
        res.status(400).json({ message: 'Bad request, no file uploaded or file format error' });
    }
};

// Process an table to json by Azure OCR API
const TabletoJson = async (req, res) => {
    try {
        if (!req.files || !req.files.processFile) {
            return res.status(400).send('No file was uploaded.');
        }

        const processFile = req?.files?.processFile;

        const allowedMimeTypes = [
            'application/pdf'
        ];

        if (!allowedMimeTypes.includes(processFile.mimetype)) {
            return res.status(400).send('Uploaded file must be an pdf.');
        }

        // Convert the uploaded to a Buffer
        const processFileBuffer = processFile?.data;

        // console.log('Buffer:', processFileBuffer);

        // Call Azure OCR API
        const response = await axios.post(
            `${process.env.AZURE_API_TABLE_TEXT_ENDPOINT}/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31`,
            processFileBuffer,
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_TABLE_TEXT_KEY,
                    "Content-Type": "application/octet-stream",
                },
            }
        );

        // Step 2: Extract the operation-location URL
        const operationLocation = response.headers['operation-location'];
        if (!operationLocation) {
            throw new Error('Operation location header not found in response.');
        }

        // Step 3: Poll for results
        let result;
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            const resultResponse = await axios.get(operationLocation, {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_TABLE_TEXT_KEY,
                },
            });
            result = resultResponse.data;

            if (result.status === 'succeeded') {
                break;
            } else if (result.status === 'failed') {
                throw new Error('File processing failed.');
            }
        }

        // Step 4: Return the data
        // console.log(result.analyzeResult.tables);
        // Step 4: Process table data
        const tables = result.analyzeResult.tables;
        if (!tables || tables.length === 0) {
            return res.status(404).json({ message: 'No tables found in the document.' });
        }

        const formattedTables = tables.map(table => {
            const header = [];
            const body = [];

            // Determine table dimensions
            const rows = Math.max(...table.cells.map(cell => cell.rowIndex)) + 1;
            const cols = Math.max(...table.cells.map(cell => cell.columnIndex)) + 1;

            // Create a 2D array for the table
            const tableData = Array.from({ length: rows }, () => Array(cols).fill(''));

            // Fill the 2D array with table cell content
            table.cells.forEach(cell => {
                tableData[cell.rowIndex][cell.columnIndex] = cell.content || '';
            });

            // First row as header
            header.push(...tableData[0]);

            // Remaining rows as body
            body.push(...tableData.slice(1));

            return { header, body };
        });

        // Step 5: Respond with formatted data
        res.status(200).json({
            status: 'success',
            tables: formattedTables,
            extractedData: tables
        });

    } catch (error) {
        // console.error(error.response);
        res.status(400).json({ message: 'Bad request, no file uploaded or file format error' });
    }
}

module.exports = {
    ImageToText,
    TabletoJson,
}