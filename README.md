# Convert JSON to SARIF

This action converts JSON files to SARIF format.

## Inputs

### `input_path`

**Required** The path to the input JSON file.

### `output_path`

**Required** The path to save the output SARIF file.

## Example Usage

```yaml
name: Convert JSON to SARIF

on:
  push:
    paths:
      - 'data/*.json'

jobs:
  convert:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '14'

    - name: Convert JSON to SARIF
      uses: Ramesh-actions/json-to-sarif@main
      with:
        input_path: 'data/input.json'
        output_path: 'data/output.sarif'

    - name: Upload SARIF
      uses: actions/upload-artifact@v3
      with:
        name: sarif-results
        path: data/output.sarif
