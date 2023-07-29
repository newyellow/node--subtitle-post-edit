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
wordsReplace.push({ search: 'fxh', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'ffhash', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fhcache', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'ffcatch', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fx-h', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'ffh', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fxcash', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fhcash', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fx cash', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fxcatch', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'fx catch', replaceTo: 'fxhash' });
wordsReplace.push({ search: 'uplux', replaceTo: 'ArtBlocks' });
wordsReplace.push({ search: 'arblacks', replaceTo: 'ArtBlocks' });
wordsReplace.push({ search: 'fidenza', replaceTo: 'Fidenza' });
wordsReplace.push({ search: 'taylor hobbs', replaceTo: 'Tyler Hobbs' });
wordsReplace.push({ search: 'wisp', replaceTo: 'width' });
wordsReplace.push({ search: 'wiz', replaceTo: 'width' });
wordsReplace.push({ search: 'with ', replaceTo: 'width ' });
wordsReplace.push({ search: 'rack', replaceTo: 'rect' });
wordsReplace.push({ search: 'man cue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'main cue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'maincue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'man hue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'man cube', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'mancube', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'main cube', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'maincube', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'main hue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'mainqueue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'main queue', replaceTo: 'mainHue' });
wordsReplace.push({ search: 'set', replaceTo: 'sat' });
wordsReplace.push({ search: 'cue', replaceTo: 'hue' });
wordsReplace.push({ search: '貓貓密碼', replaceTo: '毛毛密碼' });
wordsReplace.push({ search: '貓貓質感', replaceTo: '毛毛質感' });
wordsReplace.push({ search: '深層設計術', replaceTo: '生成式藝術' });
wordsReplace.push({ search: '深層藝術', replaceTo: '生成藝術' });
wordsReplace.push({ search: '生成係數', replaceTo: '生成式藝術' });
wordsReplace.push({ search: '深層式', replaceTo: '生成式' });
wordsReplace.push({ search: '生成事', replaceTo: '生成式' });
wordsReplace.push({ search: '生成是', replaceTo: '生成式' });
wordsReplace.push({ search: '生成師', replaceTo: '生成式' });
wordsReplace.push({ search: '生成系', replaceTo: '生成式' });
wordsReplace.push({ search: '生成試', replaceTo: '生成式' });
wordsReplace.push({ search: '深層式', replaceTo: '生成式' });
wordsReplace.push({ search: '深層市', replaceTo: '生成式' });
wordsReplace.push({ search: '深層次', replaceTo: '生成式' });
wordsReplace.push({ search: '深層示', replaceTo: '生成式' });
wordsReplace.push({ search: '深層系', replaceTo: '生成式' });
wordsReplace.push({ search: '深層', replaceTo: '生成' });
wordsReplace.push({ search: '復迴圈', replaceTo: 'for 迴圈' });
wordsReplace.push({ search: '復活圈', replaceTo: 'for 迴圈' });
wordsReplace.push({ search: '4 迴圈', replaceTo: 'for 迴圈' });
wordsReplace.push({ search: 'four 迴圈', replaceTo: 'for 迴圈' });
wordsReplace.push({ search: '回圈', replaceTo: '迴圈' });
wordsReplace.push({ search: '意書', replaceTo: '藝術' });
wordsReplace.push({ search: '宜數', replaceTo: '藝術' });
wordsReplace.push({ search: '業術', replaceTo: '藝術' });
wordsReplace.push({ search: '宜術', replaceTo: '藝術' });
wordsReplace.push({ search: '意術', replaceTo: '藝術' });
wordsReplace.push({ search: '廠家', replaceTo: '藏家' });
wordsReplace.push({ search: '筆處', replaceTo: '筆觸' });
wordsReplace.push({ search: '刮鬍', replaceTo: '括弧' });
wordsReplace.push({ search: '刮號', replaceTo: '括號' });
wordsReplace.push({ search: '刮', replaceTo: '括' });
wordsReplace.push({ search: '色飄', replaceTo: '色票' });
wordsReplace.push({ search: '坐標', replaceTo: '座標' });
wordsReplace.push({ search: '其實座標', replaceTo: '起始座標' });
wordsReplace.push({ search: '其實位置', replaceTo: '起始位置' });
wordsReplace.push({ search: '比觸', replaceTo: '筆觸' });
wordsReplace.push({ search: '遞回', replaceTo: '遞迴' });
wordsReplace.push({ search: '地回', replaceTo: '遞迴' });
wordsReplace.push({ search: '十座', replaceTo: '實作' });
wordsReplace.push({ search: '忽掉', replaceTo: '呼叫' });
wordsReplace.push({ search: '立場', replaceTo: '力場' });
wordsReplace.push({ search: '住照', replaceTo: '鑄造' });
wordsReplace.push({ search: '註照', replaceTo: '鑄造' });
wordsReplace.push({ search: '。', replaceTo: '' });
wordsReplace.push({ search: '欸', replaceTo: '' });
wordsReplace.push({ search: '加加', replaceTo: '++' });
wordsReplace.push({ search: 'fuel', replaceTo: 'fill' });
wordsReplace.push({ search: 'xpos', replaceTo: 'xPos' });
wordsReplace.push({ search: 'x pose', replaceTo: 'xPos' });
wordsReplace.push({ search: 'x pos', replaceTo: 'xPos' });
wordsReplace.push({ search: 'xpose', replaceTo: 'xPos' });
wordsReplace.push({ search: 'x pulse', replaceTo: 'xPos' });
wordsReplace.push({ search: 'x-pose', replaceTo: 'xPos' });
wordsReplace.push({ search: 'y pose', replaceTo: 'yPos' });
wordsReplace.push({ search: 'ypose', replaceTo: 'yPos' });
wordsReplace.push({ search: 'y pulse', replaceTo: 'yPos' });
wordsReplace.push({ search: 'ypos', replaceTo: 'yPos' });
wordsReplace.push({ search: 'y pos', replaceTo: 'yPos' });
wordsReplace.push({ search: 'y-pose', replaceTo: 'yPos' });
wordsReplace.push({ search: 'xPost', replaceTo: 'xPos' });
wordsReplace.push({ search: 'exPos', replaceTo: 'xPos' });
wordsReplace.push({ search: 'yPost', replaceTo: 'yPos' });
wordsReplace.push({ search: 'x count', replaceTo: 'xCount' });
wordsReplace.push({ search: 'y count', replaceTo: 'yCount' });
wordsReplace.push({ search: 'xcount', replaceTo: 'xCount' });
wordsReplace.push({ search: 'ycount', replaceTo: 'yCount' });
wordsReplace.push({ search: 'rectwidth', replaceTo: 'rectWidth' });
wordsReplace.push({ search: 'rect width', replaceTo: 'rectWidth' });
wordsReplace.push({ search: 'rectheight', replaceTo: 'rectHeight' });
wordsReplace.push({ search: 'rect height', replaceTo: 'rectHeight' });
wordsReplace.push({ search: 'rec ', replaceTo: 'rect ' });
wordsReplace.push({ search: 'rex ', replaceTo: 'rect ' });
wordsReplace.push({ search: 'radius', replaceTo: 'radians' });
wordsReplace.push({ search: 'tesos', replaceTo: 'Tezos' });
wordsReplace.push({ search: 'tesol', replaceTo: 'Tezos' });
wordsReplace.push({ search: 'testos', replaceTo: 'Tezos' });
wordsReplace.push({ search: 'tesla', replaceTo: 'Tezos' });
wordsReplace.push({ search: 'satup', replaceTo: 'setup' });
wordsReplace.push({ search: 'shift auto f', replaceTo: 'shift + alt + f' });
wordsReplace.push({ search: 'flow fills', replaceTo: 'flow fields' });
wordsReplace.push({ search: 'flow fill', replaceTo: 'flow fields' });
wordsReplace.push({ search: 'flow feels', replaceTo: 'flow fields' });
wordsReplace.push({ search: 'flow feel', replaceTo: 'flow fields' });
wordsReplace.push({ search: 'flowfuse', replaceTo: 'flow fields' });
wordsReplace.push({ search: 'nfp', replaceTo: 'NFT' });
wordsReplace.push({ search: 'nft', replaceTo: 'NFT' });
wordsReplace.push({ search: 'nfd', replaceTo: 'NFT' });
wordsReplace.push({ search: 'kanai wallet', replaceTo: 'connect wallet' });
wordsReplace.push({ search: 'kookai', replaceTo: 'Kukai' });
wordsReplace.push({ search: 'temple wallet', replaceTo: 'Temple wallet' });
wordsReplace.push({ search: 'twitter', replaceTo: 'Twitter' });
wordsReplace.push({ search: 'matters', replaceTo: 'Matters' });
wordsReplace.push({ search: 'discord', replaceTo: 'Discord' });
wordsReplace.push({ search: 'disco', replaceTo: 'Discord' });
wordsReplace.push({ search: 'tzkt profiles', replaceTo: 'TzKT Profiles' });
wordsReplace.push({ search: 'tzkt', replaceTo: 'TzKT' });

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


