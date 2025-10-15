const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function convertJsonToYaml(jsonPath) {
    // Read JSON file
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(jsonContent);
    
    // Convert to YAML
    const yamlContent = yaml.dump(jsonData, {
        indent: 2,
        lineWidth: -1,
        quotingType: '"'
    });
    
    // Create new YAML file path
    const yamlPath = jsonPath.replace('.json', '.yml');
    
    // Write YAML file
    fs.writeFileSync(yamlPath, yamlContent);
    
    // Delete JSON file
    fs.unlinkSync(jsonPath);
    
    console.log(`Converted ${jsonPath} to ${yamlPath}`);
}

function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.name.endsWith('.json')) {
            convertJsonToYaml(fullPath);
        }
    }
}

const translationsDir = path.join(__dirname, '..', 'src', 'translations');
processDirectory(translationsDir);