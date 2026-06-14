const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'datasheets');
const dataPath = path.join(__dirname, 'src', 'data.json');

const newFiles = [
    {
        src: 'D:\\Transformer Oils\\Shell plc (Netherlands)\\Shell MIDEL eN 1204 (rapeseed-canola, K2).pdf',
        destName: 'Shell_MIDEL_eN_1204.pdf',
        data: {
            "Manufacturer": "Shell plc",
            "Brand/Family": "MIDEL",
            "Product Name/Code": "MIDEL eN 1204",
            "Region/Country": "Netherlands",
            "Base Oil Type": "Natural Ester",
            "Primary Standard Family": "IEC 62770",
            "Standard Class/Grade (normalized)": "Natural Ester",
            "Secondary Specs": "K2 Fire Class",
            "Oil Category": "Natural Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Rapeseed/canola based, Biodegradable",
            "Source File": "Shell MIDEL eN 1204 (rapeseed-canola, K2).pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Shell_MIDEL_eN_1204.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\Shell plc (Netherlands)\\Shell MIDEL 7131 (synthetic ester, K3).pdf',
        destName: 'Shell_MIDEL_7131.pdf',
        data: {
            "Manufacturer": "Shell plc",
            "Brand/Family": "MIDEL",
            "Product Name/Code": "MIDEL 7131",
            "Region/Country": "Netherlands",
            "Base Oil Type": "Synthetic Ester",
            "Primary Standard Family": "IEC 61099",
            "Standard Class/Grade (normalized)": "Synthetic Ester",
            "Secondary Specs": "K3 Fire Class",
            "Oil Category": "Synthetic Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Synthetic Ester, Fire Safe K3",
            "Source File": "Shell MIDEL 7131 (synthetic ester, K3).pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Shell_MIDEL_7131.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\Shell plc (Netherlands)\\MIDEL eN_1215_Product Brochure.pdf',
        destName: 'MIDEL_eN_1215.pdf',
        data: {
            "Manufacturer": "Shell plc",
            "Brand/Family": "MIDEL",
            "Product Name/Code": "MIDEL eN 1215",
            "Region/Country": "Netherlands",
            "Base Oil Type": "Natural Ester",
            "Primary Standard Family": "IEC 62770",
            "Standard Class/Grade (normalized)": "Natural Ester",
            "Secondary Specs": "",
            "Oil Category": "Natural Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Soy-based Natural Ester",
            "Source File": "MIDEL eN_1215_Product Brochure.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/MIDEL_eN_1215.pdf"
        }
    }
];

let existingData = [];
if (fs.existsSync(dataPath)) {
    existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

for (const file of newFiles) {
    if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, path.join(publicDir, file.destName));
        const exists = existingData.find(d => d['Source File'] === file.data['Source File']);
        if (!exists) {
            existingData.push(file.data);
            console.log(`Added ${file.data['Product Name/Code']}`);
        } else {
            console.log(`${file.data['Product Name/Code']} already exists.`);
        }
    } else {
        console.error(`File not found: ${file.src}`);
    }
}

fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
console.log('Shell update complete.');
