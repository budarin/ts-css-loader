import fs from 'graceful-fs';

const writeFile = (filename, content, EOL) => {
    fs.writeFileSync(filename, content, 'utf8');
};

export const writeToFileIfChanged = (filename, content, { EOL }) => {
    if (fs.existsSync(filename)) {
        const currentInput = fs.readFileSync(filename).toString();

        if (currentInput !== content) {
            writeFile(filename, content);
        }
    } else {
        writeFile(filename, content, EOL);
    }
};
