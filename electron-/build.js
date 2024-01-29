var electronInstaller = require('electron-winstaller');
var createDMG = require('electron-installer-dmg')

let configParam = require('minimist')(process.argv.slice(2));


console.log('test',configParam.platform)
if (configParam.platform == 'window') {
    // In this case, we can use relative paths
    var settings = {
        // Specify the folder where the built app is located
        appDirectory: './release-builds/TigerBot-win32-ia32',
        // Specify the existing folder where 
        outputDirectory: './release-builds/winInstaller',
        // The name of the Author of the app (the name of your company)
        authors: 'Hitachi Systems Pvt Ltd.',
        manufacturer : 'Hitachi Systems Pvt Ltd.',
        // The name of the executable of your built
        exe: './TigerBot.exe',
        setupExe: 'TigerBot.exe',
        //setupMsi:'HSIBOT.exe',
        icon: './assets/icons/humonics_logo_icon.ico',
        setupIcon: './assets/icons/humonics_logo_icon.ico'
    };
    console.log("ghjsagdhjsg")
    resultPromise = electronInstaller.createWindowsInstaller(settings);
    console.log('resultssssss',resultPromise)
    resultPromise.then(() => {
        console.log("The installers of your application were succesfully created !");
    }, (e) => {
        console.log(`Well, sometimes you are not so lucky: ${e.message}`)
    });
} else if (configParam.platform == 'mac') {
    let optn = {
        appPath:'./release-builds/HSIBOT-darwin-x64/HSIBOT.app',
        name:"HSI BOT",
        title:"HSI BOT",
        icon:'./assets/icons/humonics_logo_icon.png',
        overwrite:true,
        debug:false,
        out:'./release-builds/macDMG'
    }
    createDMG(optn, function done(err) {
        if (err) {
            console.log(`Well, sometimes you are not so lucky: ${err}`)
        } else {
            console.log("The DMG of your application were succesfully created !");
        }
    })
}



