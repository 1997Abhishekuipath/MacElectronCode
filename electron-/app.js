const electron = require('electron');
const remote = electron.remote;
const fs = require('fs');
const notifier = require("node-notifier");
const path = require('path');

//var arguments = remote.getGlobal('sharedObject').prop1;
process.env.GOOGLE_API_KEY = 'AIzaSyBJ8GDjbmxUnwrWtPG8K7--gKS-hKGav18';
global.sharedObject = {prop1: process.argv}
//console.log("arguments", arguments);


var runTime = '_prod';

// handling for local 
if (global.sharedObject.prop1.indexOf('--DEV') > -1) {
  runTime = '_dev';
}
console.log('the production', runTime);
const {
  BOT_URL,
  sarathi_botid,
  itmatec_botid,
  bot_name,
  web_uid,
  AGENT_INSTALL_PATH_WINDOW,
  AGENT_INSTALL_PATH_LUNIX,
  AGENT_INSTALL_PATH_MAC
} = require(`./config/config${runTime}`);
const ipc = electron.ipcRenderer;




var webview = document.getElementById("myweb");
var agentJson = findAgentInfo();

agentJson['web_uid']=web_uid
console.log('agentJson',agentJson)
// /${JSON.stringify(agentJson)} let botPath = `${BOT_URL}sarathi_botid=${sarathi_botid}&itmatec_botid=${itmatec_botid}&bot_name=${bot_name}&web_user=${JSON.stringify(agentJson)}`
let botPath = `${BOT_URL}?web_uid=${web_uid}/agentId=${JSON.stringify(agentJson)}`
console.log('bottttt',BOT_URL, AGENT_INSTALL_PATH_WINDOW, AGENT_INSTALL_PATH_LUNIX, AGENT_INSTALL_PATH_MAC,web_uid)
console.log("botPath ++++++++ ", botPath)
webview.setAttribute("src", botPath);
const iconPath = path.join(__dirname, 'assets/icons/humonics_logo_icon.png');


// Process the data from the webview
webview.addEventListener('ipc-message', function (event, data) {
  console.log('##############the event recive in the data#################', data);
  console.log(event);
  console.info(event.channel);
  handelIpcEvents(event.channel.type, event.channel.data);
});

function findAgentInfo() {
  // only implemented to # window
  console.log("process.platform", process.platform)
  switch (process.platform) {
    case "win32":
      return agentInfoFor(AGENT_INSTALL_PATH_WINDOW);
    case "linux":
      return agentInfoFor(AGENT_INSTALL_PATH_LUNIX);
    case "darwin":
      return agentInfoFor(AGENT_INSTALL_PATH_MAC);
  }
}

function agentInfoFor(path) {
  //console.log('agentPath',path)
  let checkPath = fs.existsSync(path);
  console.log('path exist', checkPath);  
  if (checkPath) {
    let data = fs.readFileSync(path);
    //console.log('data',data)
    console.log(typeof(data))
    data = data.toString()
    //data =  data.split('\n')
    //data = data[0].toString().split('\r\n')
    let newdata=data.split('\n')
    data=newdata
    console.log(data,'data')
    let startindex = data.indexOf('[SERVER COMMUNICATIONS]');
    let endindex = data.indexOf('');
    console.log('startIndex',startindex,endindex)
    data = data.slice(startindex, endindex);
    //console.log('slicedata',data)
    data = data.slice(1).join('#').replace(/\s\s+/g, '#');
    data = data.split('#');
    console.log('agent data ', data,data[data.indexOf('Agent_Guid')+1]);
    if (data) {
      let agentID = data[data.indexOf('Agent_Guid') + 1];
      let agentUserName = data[data.indexOf('User_Name') + 1];
      return {
        user_identity: agentID,
        user_name: agentUserName
      }
    } else {
      console.error('file data missing');
      return {};
    }
  }else{
    return {};
  }
}

function handelIpcEvents(type, data) {
  switch (type) {
    case 'NOTIFICATION':
      handleNotification(data);
  };
}

function handleNotification(notificData) {
  console.log('notification recive');
  // remote.getCurrentWindow().show();
  notificData.forEach(data => {
    console.log(data);
    createNotification('Bot Notification', data.type + " " + data.procedure);
  });

}

function createNotification(title, body) {
  notifier.notify({
    message: body,
    title: title,
    icon: iconPath,
    sound: true,
    wait: true
  });
  notifier.on("click", function () {
    showWindowTop();
  }, false);
}

function showWindowTop() {
  remote.getCurrentWindow().show();
}

function onError(err, response) {
  console.error(err, response);
};

  const { ipcRenderer } = require('electron')
  const updateOnlineStatus = () => {
    ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
  }

  window.addEventListener('online',  updateOnlineStatus)
  window.addEventListener('offline',  updateOnlineStatus)

  updateOnlineStatus()

  const { shell } = require('electron')
  webview.addEventListener('new-window', async (e) => {
    const protocol = require('url').parse(e.url).protocol
    if (protocol === 'http:' || protocol === 'https:') {
      await shell.openExternal(e.url)
    }
  })