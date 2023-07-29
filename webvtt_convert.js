const fs = require('fs');
const readline = require('readline');

// 讀取 subtitles 裡面的檔案
let dirs = fs.readdirSync('subtitles');

for (let i = 0; i < dirs.length; i++) {

    console.log(`process file ${dirs[i]}`);

    let readStream = fs.createReadStream(`subtitles/${dirs[i]}`, 'utf8');
    let writeStream = fs.createWriteStream(`subtitles_modified/${dirs[i]}--modified`, 'utf8');

    // 逐行讀取檔案
    let rl = readline.createInterface({
        input: readStream
    });

    // 逐行讀取檔案
    let lineIndex = 0;
    let subtitleCounter = 1;

    rl.on('line', (line) => {

        let sourceLine = line;
        let modifiedLine = line;

        // remove the first line
        if (lineIndex == 0) {
            // do nothing
        }
        else if ((lineIndex - 1) % 3 == 0) {
            writeStream.write(`${subtitleCounter}\n`);
            subtitleCounter++;
        }
        else if ((lineIndex - 1) % 3 == 1) {
            modifiedLine = sourceLine.replace('.', ',');
            modifiedLine = modifiedLine.replace('.', ',');
            writeStream.write(modifiedLine + '\n');
        }
        else if ((lineIndex - 1) % 3 == 2) {
            writeStream.write(sourceLine + '\n');
            writeStream.write('\n');
        }
        lineIndex++;
    });
}