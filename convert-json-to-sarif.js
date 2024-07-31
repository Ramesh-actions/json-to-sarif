const fs = require('fs'); // Import the fs module

function convertJsonToSarif(jsonData) {
    console.log('Parsed JSON data:', JSON.stringify(jsonData, null, 2)); // Log the parsed JSON data

    if (!Array.isArray(jsonData)) {
        throw new TypeError('Expected an array of JSON data');
    }

    const sarif = {
        version: "2.1.0",
        runs: [
            {
                tool: {
                    driver: {
                        name: "Custom JSON to SARIF Converter",
                        version: "1.0.0",
                        informationUri: "https://example.com",
                        rules: []
                    }
                },
                results: jsonData.map((item, index) => ({
                    ruleId: `rule-${index + 1}`,
                    message: {
                        text: item.message
                    },
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: {
                                    uri: item.file
                                },
                                region: {
                                    startLine: item.line
                                }
                            }
                        }
                    ]
                }))
            }
        ]
    };

    return sarif;
}

const inputPath = process.argv[2];
const outputPath = process.argv[3]; // Ensure this is declared only once

console.log(`Input Path: ${inputPath}`);
console.log(`Output Path: ${outputPath}`);

if (!inputPath || !outputPath) {
  throw new Error("Input path and output path must be provided");
}

const jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const sarifData = convertJsonToSarif(jsonData);
fs.writeFileSync(outputPath, sarifData);

fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        console.log('Raw JSON data:', jsonData); // Log the raw JSON data
        const sarifData = convertJsonToSarif(jsonData);
        console.log('Converted SARIF data:', JSON.stringify(sarifData, null, 2));

        fs.writeFile(outputPath, JSON.stringify(sarifData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing SARIF file:', writeErr);
            } else {
                console.log('SARIF file written successfully to', outputPath);
            }
        });
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
    }
});
