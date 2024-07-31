 const fs = require('fs');

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

 const inputPath = process.argv[2];
 const outputPath = process.argv[3];
 const jsonData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
 const sarifData = convertJsonToSarif(jsonData);
 fs.writeFileSync(outputPath, sarifData);
