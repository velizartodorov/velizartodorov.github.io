const fs = require('fs');
const path = require('path');

function fixJsonFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    try {
        // Remove export default and just keep the JSON object
        const jsonContent = content.replace(/export\s+default\s+/, '');
        // Parse to verify it's valid JSON
        JSON.parse(jsonContent);
        // Write back to file
        fs.writeFileSync(filePath, jsonContent);
        console.log(`Fixed: ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.json')) {
            fixJsonFile(fullPath);
        }
    });
}

// Process both English and Dutch translations
const translationsDir = path.join(__dirname, 'src', 'translations');
processDirectory(translationsDir);