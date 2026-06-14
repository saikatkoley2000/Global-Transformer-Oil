const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'datasheets');
const dataPath = path.join(__dirname, 'src', 'data.json');

const newFiles = [
    {
        src: 'D:\\Transformer Oils\\Cargill\\FR3_R2000Doc_Spring2026_EN_USL_FINAL.pdf',
        destName: 'Cargill_FR3.pdf',
        data: {
            "Manufacturer": "Cargill",
            "Brand/Family": "Envirotemp",
            "Product Name/Code": "Envirotemp FR3",
            "Region/Country": "USA",
            "Base Oil Type": "Natural Ester",
            "Primary Standard Family": "IEC 62770",
            "Standard Class/Grade (normalized)": "Natural Ester",
            "Secondary Specs": "K-Class",
            "Oil Category": "Natural Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Soy-based Natural Ester",
            "Source File": "FR3_R2000Doc_Spring2026_EN_USL_FINAL.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Cargill_FR3.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\Cargill\\FR3r.pdf',
        destName: 'Cargill_FR3r.pdf',
        data: {
            "Manufacturer": "Cargill",
            "Brand/Family": "Envirotemp",
            "Product Name/Code": "Envirotemp FR3r",
            "Region/Country": "USA",
            "Base Oil Type": "Natural Ester",
            "Primary Standard Family": "IEC 62770",
            "Standard Class/Grade (normalized)": "Natural Ester",
            "Secondary Specs": "K-Class",
            "Oil Category": "Natural Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Natural Ester (Rapeseed based)",
            "Source File": "FR3r.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Cargill_FR3r.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\Cargill\\20191030_Envirotemp_360_fluid_FINAL.pdf',
        destName: 'Cargill_Envirotemp_360.pdf',
        data: {
            "Manufacturer": "Cargill",
            "Brand/Family": "Envirotemp",
            "Product Name/Code": "Envirotemp 360",
            "Region/Country": "USA",
            "Base Oil Type": "Synthetic Ester",
            "Primary Standard Family": "IEC 61099",
            "Standard Class/Grade (normalized)": "Synthetic Ester",
            "Secondary Specs": "",
            "Oil Category": "Synthetic Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Synthetic Fluid",
            "Source File": "20191030_Envirotemp_360_fluid_FINAL.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Cargill_Envirotemp_360.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\Cargill\\ENVIROTEMP200_SELLSHEET_2-13-17.pdf',
        destName: 'Cargill_Envirotemp_200.pdf',
        data: {
            "Manufacturer": "Cargill",
            "Brand/Family": "Envirotemp",
            "Product Name/Code": "Envirotemp 200",
            "Region/Country": "USA",
            "Base Oil Type": "Synthetic Ester",
            "Primary Standard Family": "IEC 61099",
            "Standard Class/Grade (normalized)": "Synthetic Ester",
            "Secondary Specs": "",
            "Oil Category": "Synthetic Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Synthetic Fluid",
            "Source File": "ENVIROTEMP200_SELLSHEET_2-13-17.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Cargill_Envirotemp_200.pdf"
        }
    },
    {
        src: 'D:\\Transformer Oils\\Cargill\\PS_SE3_SynthEster_Datasheet_EN_A4_020226_1.0.pdf',
        destName: 'Cargill_SE3.pdf',
        data: {
            "Manufacturer": "Cargill",
            "Brand/Family": "Envirotemp",
            "Product Name/Code": "Envirotemp SE3",
            "Region/Country": "USA",
            "Base Oil Type": "Synthetic Ester",
            "Primary Standard Family": "IEC 61099",
            "Standard Class/Grade (normalized)": "Synthetic Ester",
            "Secondary Specs": "",
            "Oil Category": "Synthetic Ester",
            "Inhibition Type": "Uninhibited",
            "Intended Application": "Distribution/power transformers",
            "Notable Features": "Synthetic Ester",
            "Source File": "PS_SE3_SynthEster_Datasheet_EN_A4_020226_1.0.pdf",
            "Notes": "Added manually",
            "localPath": "/datasheets/Cargill_SE3.pdf"
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
console.log('Cargill update complete.');
