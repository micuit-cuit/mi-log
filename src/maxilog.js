//récupert la rassine du projet
const fs = require('fs');
const PATH = require('path');
const racine = process.cwd();
fs.writeFileSync(racine + '/mi-log.config.json', fs.readFileSync(__dirname + '/default-config.json'));

if (!fs.existsSync(racine + '/mi-log.config.json')) {
    fs.writeFileSync(racine + '/mi-log.config.json', fs.readFileSync(__dirname + '/default-config.json'));
}
const config = require(racine + '/mi-log.config.json');



// Generated by Nyapilot
const formatLog = require("./formatLog")
const support256Color = process.env.TERM.includes('256');
class MaxiLog {
    constructor({ processBaseName, subProcess = [], defaultActive = true }) {
        const defaultLogFile = "log/" + processBaseName+"/"+( subProcess?subProcess.join("-"):processBaseName )+ ".log"
        let process
        //si le nom du process n'est pas défini dans le fichier de configuration on le rajoute
        if (!config.process[processBaseName]) {
            config.process[processBaseName] = {
                "listeOfSubprocess": {},
                logFile: "log/" + processBaseName+"/"+processBaseName + ".log",
                active: defaultActive
            }
            fs.writeFileSync(racine + '/mi-log.config.json', JSON.stringify(config, null, 4));
        }
        process = config.process[processBaseName]
        console.log(subProcess, process)
        for (let i = 0; i < subProcess.length; i++) {
            const subProcessName = subProcess[i]
            if (!process.listeOfSubprocess[subProcessName]) {
                process.listeOfSubprocess[subProcessName] = {
                    "listeOfSubprocess": {},
                    logFile: defaultLogFile,
                    active: defaultActive
                }
                fs.writeFileSync(racine + '/mi-log.config.json', JSON.stringify(config, null, 4));
            }
            process = process.listeOfSubprocess[subProcessName]
        }
        console.log(process)
        const filePath = PATH.join(racine, process.logFile)

        if (config.resetLogfileInRestart)
            fs.unlinkSync(filePath)
        //crée le fichier de log
        fs.mkdirSync(PATH.dirname(filePath), { recursive: true });
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1024 * 1024 * 10) {
            fs.renameSync(filePath, filePath + "." + new Date().toISOString().
                replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '-'))
        }
        if (!fs.existsSync(filePath))
            fs.writeFileSync(filePath,"# use cat to read the log file\n")
        this.logFile = filePath
        this.active = config.process[processBaseName].active;
        this.prefixes = [{ text: processBaseName, color: config.processColor }];
        this.useTextColor = true;
    }

    log(...args) { this.consoleCal('INFO',...args)}
    l(...args) { this.log(...args); }
    warn(...args) { this.consoleCal('WARN',...args)}
    w(...args) { this.warn(...args); }
    error(...args) { this.consoleCal('ERROR',...args)}
    e(...args) { this.error(...args); }
    debug(...args) { this.consoleCal('DEBUG',...args)}
    d(...args) { this.debug(...args); }
    success(...args) { this.consoleCal('SUCCESS',...args)}
    s(...args) { this.success(...args); }
    info(...args) { this.consoleCal('INFO',...args)}
    i(...args) { this.info(...args); }
    console(...args) { this.consoleCal("CONSOLE",...args)}
    c(...args) { this.console(...args); }
    consoleCal(level,...args){
        if (level === 'CONSOLE') {
            if(this.active)
                console.log(...args)
            fs.appendFileSync(this.logFile, args.join("")+ "\n","utf8")
            return
        }
        const reply = formatLog({ level: level, support256Color, prefixes: this.prefixes, useTextColor: this.useTextColor }, ...args)
        fs.appendFileSync(this.logFile, reply.join("")+ "\n","utf8")
        if (this.active) {
            switch (level) {
                case 'INFO': {
                    console.log(...reply)
                    break
                }
                case 'WARN': {
                    console.warn(...reply)
                    break
                }
                case 'ERROR': {
                    console.error(...reply)
                    break
                }
                case 'DEBUG': {
                    console.log(...reply)
                    break
                }
                case 'SUCCESS': {
                    console.log(...reply)
                    break
                }
            }
        }
    }
}
//function pour convertire un texte en couleur

module.exports = MaxiLog
