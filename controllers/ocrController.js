const axios = require("axios");

// Process an image to Text by Azure OCR API
const ImageToText = async (req, res) => {
    try {
        if (!req.files || !req.files.processFile) {
            return res.status(400).send('No file was uploaded.');
        }

        const processFile = req?.files?.processFile;

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff'];

        if (!allowedMimeTypes.includes(processFile.mimetype)) {
            return res.status(400).send('Uploaded file must be an image.');
        }

        // Convert the uploaded to a Buffer
        const processFileBuffer = processFile?.data;

        // console.log('Buffer:', processFileBuffer);

        // Call Azure OCR API
        const response = await axios.post(
            `${process.env.AZURE_API_ENDPOINT}/vision/v3.2/ocr`,
            processFileBuffer,
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
                    "Content-Type": "application/octet-stream",
                },
            }
        );

        const ocrData = response.data;
        // console.log(ocrData);

        let extractedText = '';
        let detailedData = [];

        // Process OCR data region by region
        if (ocrData && ocrData.regions) {
            ocrData.regions.forEach((region, regionIndex) => {
                let regionText = '';
                region.lines.forEach((line, lineIndex) => {
                    let lineText = line.words.map(word => word.text).join(' ');
                    extractedText += lineText + ' ';
                    regionText += lineText + ' ';

                    detailedData.push({
                        region: regionIndex + 1,
                        line: lineIndex + 1,
                        text: lineText,
                    });
                });

                detailedData.push({
                    region: regionIndex + 1,
                    text: regionText.trim(),
                    lines: region.lines.length,
                });
            });
        }

        // Clean up the final sentence
        extractedText = extractedText.trim();


        if (extractedText == '') {
            return res.status(400).json({ message: 'The uploaded file could not extract or process any data.' });
        }


        res.status(200).json({
            status: 'success',
            extractedText: extractedText,  // Full sentence extracted from the image
            detailedData: detailedData,    // Detailed OCR breakdown (regions, lines, words)
        });


    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: 'Bad request, no file uploaded or file format error' });
    }
};

// const ExtractText = async (req, res) => {
//     try {
//         // Validate file upload
//         if (!req.files || !req.files.file) {
//             return res.status(400).json({ error: 'No file uploaded.' });
//         }

//         const uploadedFile = req.files.file;

//         // Validate file type
//         const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif'];
//         if (!allowedTypes.includes(uploadedFile.mimetype)) {
//             return res.status(400).json({ error: 'Unsupported file format. Please upload a PDF or image.' });
//         }

//         // Step 1: Send the file to Azure Read API
//         const response = await axios.post(
//             `${process.env.AZURE_API_ENDPOINT}/vision/v3.2/read/analyze`,
//             uploadedFile.data, // Use the file's buffer data
//             {
//                 headers: {
//                     'Ocp-Apim-Subscription-Key': process.env.AZURE_API_KEY,
//                     'Content-Type': 'application/octet-stream',
//                 },
//             }
//         );

//         console.log(response?.data);

//         // Step 2: Poll for results
//         const operationLocation = response.headers['operation-location'];
//         let result = null;

//         while (!result) {
//             await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

//             const operationResult = await axios.get(operationLocation, {
//                 headers: {
//                     'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
//                 },
//             });

//             if (operationResult.data.status === 'succeeded') {
//                 result = operationResult.data.analyzeResult.readResults;
//             } else if (operationResult.data.status === 'failed') {
//                 throw new Error('Read operation failed.');
//             }
//         }

//         // Step 3: Extract text from the response
//         const extractedText = result.flatMap(readResult =>
//             readResult.lines.map(line => line.text)
//         ).join('\n');

//         // Send the extracted text as the response
//         res.status(200).json({ text: extractedText });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: 'Failed to process file. ' + error.message });
//     }
// };


module.exports = {
    ImageToText,
    // ExtractText,
}