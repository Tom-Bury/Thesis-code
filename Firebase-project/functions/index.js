const functions = require('firebase-functions');
var proxy = require('express-http-proxy');
const express = require('express');


const revproxy = express();


revproxy.get('/s/student', (req, res) => {
  res.send('no');
});

revproxy.get('/s/student/kibana', (req, res) => {
  res.send('no');
});


revproxy.get('/test2', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.json({
    bongs: 'BONG '.repeat(hours)
  });
});

revproxy.get('/start', (req, res) => {
  res.send('Hello.')
});



// /s/student/app/kibana#/dashboard/a1a3ac60-19fd-11ea-a467-55964895c522?embed=true&_g=(refreshInterval:(pause:!t,value:0),time:(from:now-31d,to:now))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!f),panels:!((embeddableConfig:(title:'Verbruik+in+Watt+doorheen+de+tijd'),gridData:(h:15,i:b6db9ff8-1e24-4335-be89-b6b43d8288e3,w:48,x:0,y:0),id:ce5288e0-167d-11ea-aa54-131c370a98b8,panelIndex:b6db9ff8-1e24-4335-be89-b6b43d8288e3,title:'Verbruik+in+Watt+doorheen+de+tijd',type:visualization,version:'7.4.0')),query:(language:kuery,query:''),timeRestore:!f,title:'Gewoon+een+watt+timeline',viewMode:view)

revproxy.use(proxy('https://932f51d533944da9b8ecace37e13aa8b.europe-west1.gcp.cloud.es.io:9243', {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Add authentication
    proxyReqOpts.headers['Authorization'] = 'Basic dG9tYnVyeTpveWpueUVtWDRybXFoNmJ0';
    return proxyReqOpts;
  },

  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    // Add caching
    headers['cache-control'] = "max-age=300";
    return headers;
  }
}));


// Create "main" function to host all other top-level functions
const revrproxyMain = express();
revrproxyMain.use('', revproxy);

exports.revproxyMain = functions.https.onRequest(revrproxyMain);
