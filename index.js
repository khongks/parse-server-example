// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var parseConfig = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337'  // Don't forget to change to https if needed
}

// Optional Keys
if (process.env.FILE_KEY) {
  parseConfig.fileKey = process.env.FILE_KEY;
}

if (process.env.CLIENT_KEY) {
  parseConfig.clientKey = process.env.CLIENT_KEY;
}

if (process.env.JS_KEY) {
  parseConfig.javascriptKey = process.env.JS_KEY;
}

if (process.env.REST_KEY) {
  parseConfig.restAPIKey = process.env.REST_KEY;
}

if (process.env.DOTNET_KEY) {
  parseConfig.dotNetKey = process.env.DOTNET_KEY;
}

if (process.env.FACEBOOK_APP_IDS) {
  parseConfig.facebookAppIds = process.env.FACEBOOK_APP_IDS
}

var api = new ParseServer(parseConfig);
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
