const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('..');
const publicDir = path.join(__dirname, 'public', 'datasheets');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const directories = [
    'APAR', 'BPCL', 'Columbia', 'Ergon HyVolt Solutions (Indonesia)', 'Gandhar Oil',
    'IOCL', 'Nynas AB (Sweden)', 'PetroChina KunLun (China)', 'Phillips 66 Lubricants (USA)',
    'Repsol Lubricants (Spain)', 'SAVITA', 'Shell plc (Netherlands)', 'Sinopec Corp. (China)'
];

const normalize = (str) => str.replace(/[^a-z0-9]/gi, '').toLowerCase();

const findFile = (filename) => {
    if (!filename) return null;
    const targetNormal = normalize(filename);
    const targetBase = normalize(path.parse(filename).name);

    for (const dir of directories) {
        const dirPath = path.join(rootDir, dir);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            
            // Exact or normalized match
            let found = files.find(f => normalize(f) === targetNormal);
            
            // Substring match
            if (!found) {
                found = files.find(f => {
                    const fBase = normalize(path.parse(f).name);
                    return fBase.includes(targetBase) || targetBase.includes(fBase);
                });
            }
            if (found) {
                return path.join(dirPath, found);
            }
        }
    }
    return null;
};

const wb = xlsx.readFile(path.join(rootDir, 'Transformer_Oil_Master_Table_1.xlsx'));
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

const processedData = data.map(row => {
    let sourceFile = row['Source File'];
    let localPath = null;
    if (sourceFile) {
        const foundPath = findFile(sourceFile);
        if (foundPath) {
            const fileName = path.basename(foundPath);
            const destPath = path.join(publicDir, fileName);
            fs.copyFileSync(foundPath, destPath);
            localPath = `/datasheets/${fileName}`;
        } else {
            console.warn(`File not found: ${sourceFile}`);
        }
    }
    return {
        ...row,
        localPath
    };
});

fs.writeFileSync(path.join(__dirname, 'src', 'data.json'), JSON.stringify(processedData, null, 2));
console.log('Data processing complete.');
