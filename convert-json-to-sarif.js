const fs = require('fs');

// Get the JSON file path from command-line arguments
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath) {
    console.error('C:\\Users\\rameshk\\Desktop\\test-report\\horusec-report.json.');
    process.exit(1);
}

// Load the JSON data
const jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const horusecReport = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Create the SARIF structure
const sarifReport = {
    version: "2.1.0",
    runs: [
        {
            tool: {
                driver: {
                    name: "Horusec",
                    version: horusecReport.version,
                    informationUri: "https://horusec.io",
                    rules: []
                }
            },
            results: []
        }
    ]
};

// Map each vulnerability to the SARIF format
horusecReport.analysisVulnerabilities.forEach((analysis) => {
    const vulnerability = analysis.vulnerabilities;
    const result = {
        ruleId: vulnerability.rule_id,
        message: {
            text: vulnerability.details
        },
        locations: [
            {
                physicalLocation: {
                    artifactLocation: {
                        uri: vulnerability.file
                    },
                    region: {
                        startLine: parseInt(vulnerability.line),
                        startColumn: parseInt(vulnerability.column)
                    }
                }
            }
        ],
        properties: {
            vulnerabilityID: analysis.vulnerabilityID,
            analysisID: analysis.analysisID,
            createdAt: analysis.createdAt,
            confidence: vulnerability.confidence,
            code: vulnerability.code,
            securityTool: vulnerability.securityTool,
            language: vulnerability.language,
            severity: vulnerability.severity,
            type: vulnerability.type,
            commitAuthor: vulnerability.commitAuthor,
            commitEmail: vulnerability.commitEmail,
            commitHash: vulnerability.commitHash,
            commitMessage: vulnerability.commitMessage,
            commitDate: vulnerability.commitDate,
            vulnHash: vulnerability.vulnHash,
            deprecatedHashes: vulnerability.deprecatedHashes,
            securityToolVersion: vulnerability.securityToolVersion,
            securityToolInfoUri: vulnerability.securityToolInfoUri
        }
    };
    sarifReport.runs[0].results.push(result);
});

// Write the SARIF report to a file
const sarifFilePath = outputPath || inputPath.replace('.json', '.sarif');
fs.writeFileSync(sarifFilePath, JSON.stringify(sarifReport, null, 2), 'utf8');

console.log(`SARIF report generated at ${sarifFilePath}`);

// Custom JSON to SARIF conversion function
function convertJsonToSarif(jsonData) {
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
    return JSON.stringify(sarif, null, 2);
}

const sarifData = convertJsonToSarif(jsonData);
fs.writeFileSync(outputPath, sarifData);
