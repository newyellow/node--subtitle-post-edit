const fs = require('fs');
const readline = require('readline');
const { start } = require('repl');

function TimeTextToObj(str) {
    //01:07:30,280
    let timeParts = str.split(':');

    let hour = parseInt(timeParts[0]);
    let minute = parseInt(timeParts[1]);
    let second = parseInt(timeParts[2].split(',')[0]);

    let millisecond = parseInt(timeParts[2].split(',')[1]);

    return new TimeObject(hour, minute, second, millisecond);
}

class TimeObject {
    constructor(hour, minute, second, millisecond) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond;
    }

    addMillisecond(addMillisecond) {
        this.millisecond += addMillisecond;
        this.second += Math.floor(this.millisecond / 1000);
        this.minute += Math.floor(this.second / 60);
        this.hour += Math.floor(this.minute / 60);

        this.millisecond = this.millisecond % 1000;
        this.second = this.second % 60;
        this.minute = this.minute % 60;
        this.hour = this.hour % 24;
    }

    toString() {
        let hour = this.hour.toString().padStart(2, '0');
        let minute = this.minute.toString().padStart(2, '0');
        let second = this.second.toString().padStart(2, '0');
        let millisecond = this.millisecond.toString().padStart(3, '0');

        return `${hour}:${minute}:${second},${millisecond}`;
    }

    toValue() {
        return this.hour * 3600000 + this.minute * 60000 + this.second * 1000 + this.millisecond;
    }
}

// 讀取 subtitles 裡面的檔案
let dirs = fs.readdirSync('subtitles');

let DO_MODIFY_LETTER_SPACING = true;
let DO_SYMBOL_REMOVE = true;
let DO_LOWER_CASE = true;
let DO_REPLACE_WORDS = true;
let DO_ADJUST_TIME_SPACE = true;


let wordsReplace = [];
wordsReplace.push({ search: 'p5js', replaceTo: 'p5.js' });
wordsReplace.push({ search: 'man hue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'main hue', replaceTo: 'mainHue' });
wordsReplace.push({ search: '深層式', replaceTo: '生成式' });
wordsReplace.push({ search: '深層次', replaceTo: '生成式' });
wordsReplace.push({ search: '深層示', replaceTo: '生成式' });
wordsReplace.push({ search: '深層系', replaceTo: '生成式' });
wordsReplace.push({ search: '回圈', replaceTo: '迴圈' });
wordsReplace.push({ search: '意書', replaceTo: '藝術' });

for (let i = 0; i < dirs.length; i++) {

    console.log(`process file ${dirs[i]}`);

    let readStream = fs.createReadStream(`subtitles/${dirs[i]}`, 'utf8');
    let writeStream = fs.createWriteStream(`subtitles_modified/${dirs[i]}--modified`, 'utf8');

    // 逐行讀取檔案
    let rl = readline.createInterface({
        input: readStream
    });

    let headExp = /([\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF])([a-zA-Z0-9])/g;
    let tailExp = /([a-zA-Z0-9])([\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF])/g;
    let symbolExp = /([\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF])([\,])/g;

    let letterExp = /[A-Z]/g;

    let lineIndex = 0;

    let lastEndTime = -1;

    // 逐行讀取檔案
    rl.on('line', (line) => {

        let sourceLine = line;
        let modifiedLine = line;

        if(DO_MODIFY_LETTER_SPACING)
        while ((match = headExp.exec(line)) !== null) {
            console.log(match);
            modifiedLine = modifiedLine.replace(match[0], match[1] + ' ' + match[2]);
        }

        if(DO_MODIFY_LETTER_SPACING)
        while ((match = tailExp.exec(line)) !== null) {
            modifiedLine = modifiedLine.replace(match[0], match[1] + ' ' + match[2]);
        }

        if(DO_SYMBOL_REMOVE)
        while ((match = symbolExp.exec(line)) !== null) {
            modifiedLine = modifiedLine.replace(match[0], match[1]);
        }

        if(DO_LOWER_CASE)
        while ((match = letterExp.exec(line)) !== null) {
            modifiedLine = modifiedLine.replace(match[0], match[0].toLowerCase());
        }

        if(DO_REPLACE_WORDS)
        for(let j = 0; j < wordsReplace.length; j++){
            modifiedLine = modifiedLine.replace(wordsReplace[j].search, wordsReplace[j].replaceTo);
        }

        if(DO_ADJUST_TIME_SPACE)
        {
            if(modifiedLine.indexOf('-->') != -1)
            {
                let timeParts = modifiedLine.split(' --> ');
                let startTime = TimeTextToObj(timeParts[0].replace(' ', ''));
                let endTime = TimeTextToObj(timeParts[1].replace(' ', ''));

                if(lastEndTime != -1)
                {
                    // check if time space is too small
                    let timeSpace = startTime.toValue() - lastEndTime;
                    if(timeSpace < 25)
                    {
                        startTime.addMillisecond(25 - timeSpace);
                    }

                    modifiedLine = `${startTime.toString()} --> ${endTime.toString()}`;
                }
                lastEndTime = endTime.toValue();
            }
        }


        if (sourceLine != modifiedLine) {
            console.log(`===${lineIndex}===`);
            console.log(sourceLine);
            console.log(modifiedLine);
        }
        writeStream.write(modifiedLine + '\n');
        lineIndex++;
    });
}


