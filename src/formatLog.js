// Generated by Nyapilot
// Les commentaires doivent toujours être en français.

const colorize = require("./color");
const getStackTrace = require("./getStackTrace");

function formatLog({ level, support256Color, prefixes, useTextColor }, ...args) {
    const { file, line } = getStackTrace();
    const time = new Date().toLocaleTimeString();

    let emoji, color;
    switch (level) {
        case 'INFO':
            emoji = 'ℹ️';
            color = colorize('brightBlue', support256Color) + ":dodgerblue";
            break;
        case 'WARN':
            emoji = '⚠️';
            color = colorize('brightYellow', support256Color) + ":orange";
            break;
        case 'ERROR':
            emoji = '🚫';
            color = colorize('brightRed', support256Color) + ":red";
            break;
        case 'DEBUG':
            emoji = '🐛';
            color = colorize('brightMagenta', support256Color) + ":purple";
            break;
        default:
            emoji = '✅';
            color = colorize('brightGreen', support256Color) + ":green";
    }

    color = color.split(':')[0];

    let styles = [];
    let logPrefixes = [
        { style: 'circle', color: color, text: `${emoji} ${level}` },
        { style: 'square', color: colorize('yellow', support256Color), text: `${time}` },
        { style: 'square', color: color, text: `${file}:${line}` },
        ...prefixes.map((item) => {
            return { style: "circle", color: colorize(item.color, support256Color), support256Color, text: item.text };
        })
    ];
    for (let i = 0; i < logPrefixes.length; i++) {
        if (logPrefixes[i].style === 'circle') {
            styles.push(logPrefixes[i].color + '(' + logPrefixes[i].text + ')' + colorize('reset', support256Color));
        } else {
            styles.push(logPrefixes[i].color + "[" + logPrefixes[i].text + "]" + colorize('reset', support256Color));
        }
    }
    let formattedArgs = [];
    if (useTextColor) {
        for (let i = 0; i < args.length; i++) {
            let str = "";
            if (typeof args[i] == "object") {
                str = args[i];
                formattedArgs.push(str);
                continue;
            }
            str = color + args[i] + colorize('reset', support256Color);
            formattedArgs.push(str);
        }
    } else {
        formattedArgs = [...args];
    }
    // console.log(styles.join(' '), ...formattedArgs, colorize('reset', support256Color));
    return [styles.join(' '), ...formattedArgs, colorize('reset', support256Color)]
}
module.exports = formatLog;