import fs from 'graceful-fs';
import os from 'os';

const writeFile = (filename, content, EOL) => {
    //Replace new lines with OS-specific new lines
    content = content.replace(/\n/g, EOL);

    fs.writeFileSync(filename, content, 'utf8');
};

export const writeToFileIfChanged = (filename, content, EOL = os.EOL) => {
    if (fs.existsSync(filename)) {
        const currentInput = fs.readFileSync(filename, 'utf-8');

        if (currentInput !== content) {
            writeFile(filename, content);
        }
    } else {
        writeFile(filename, content, EOL);
    }
};
