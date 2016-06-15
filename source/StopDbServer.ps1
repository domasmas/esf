$mongoDBServerDirectory = "C:\Program Files\MongoDB\Server\3.2\bin\"
$mongoDBClient = $mongoDBServerDirectory + "mongo.exe"
$mongoDbStopScriptPath = "C:\ESFiddle\esf\source\StopDbServer.js"
& $mongoDBClient $mongoDbStopScriptPath