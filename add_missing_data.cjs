const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'datasheets');
const dataPath = path.join(__dirname, 'src', 'data.json');

const newFiles = [
    {
        src: 'D:\\Transformer Oils\\SAVITA\\Savita-bioTRANSOL_Brochure.pdf',
        destName: 'Savita-bioTRANSOL_Brochure.pdf',
        data: {
            "Manufacturer": "Savita Oil Technologies",
            "Brand/Family": "bioTRANSOL",
            "Product Name/Code": "bioTRANSOL",
            "Region/Country": "India",
            "Base Oil Type": "Natural Ester",
            "Primary Standard Family": "IEC 62770",
            "Standard Class/Grade (normalized)": "Natural Ester",
            "Secondary Specs": "",
            "Oil Category": "Natural Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Viscosity @40C (cSt)": "33",
            "Pour Point (C)": "-21",
            "Breakdown Voltage (kV)": "70",
            "Oxidation Stability": "High",
            "Notable Features": "Biodegradable, High fire point",
            "Source File": "Savita-bioTRANSOL_Brochure.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Savita-bioTRANSOL_Brochure.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\SAVITA\\Savita-TRANSOL_Synth_Brochure.pdf',
        destName: 'Savita-TRANSOL_Synth_Brochure.pdf',
        data: {
            "Manufacturer": "Savita Oil Technologies",
            "Brand/Family": "TRANSOL Synth",
            "Product Name/Code": "TRANSOL Synth",
            "Region/Country": "India",
            "Base Oil Type": "Synthetic Ester",
            "Primary Standard Family": "IEC 61099",
            "Standard Class/Grade (normalized)": "Synthetic Ester",
            "Secondary Specs": "",
            "Oil Category": "Synthetic Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Traction/power transformers",
            "Viscosity @40C (cSt)": "28",
            "Pour Point (C)": "-50",
            "Breakdown Voltage (kV)": "75",
            "Oxidation Stability": "Excellent",
            "Notable Features": "High fire point, Synthetic",
            "Source File": "Savita-TRANSOL_Synth_Brochure.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Savita-TRANSOL_Synth_Brochure.pdf"
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
        // Check if already exists in data
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
console.log('Update complete.');
