$esfSolutionDirectory = "C:\Sources\esf\source\"
$mongoDBServerDirectory = "C:\Program Files\MongoDB\Server\3.2\bin\"
$mongoDBServer = $mongoDBServerDirectory + "mongod.exe"
$dbDeploymentConfig = $esfSolutionDirectory + "DbDeploymentConfig.cfg"
$dbPath = "C:\databases\EsFiddle"
$logPath = "C:\databases\log\EsFiddle.log"
New-Item -ItemType Directory -Force -Path $dbPath
New-Item -ItemType File -Force $logPath
& $mongoDBServer --dbpath $dbPath --logpath $logPath