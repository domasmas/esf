$esfSolutionDirectory = "C:\Sources\esf\source\"
$mongoDBServerDirectory = "C:\Program Files\MongoDB\Server\3.2\bin\"
$mongoDBServer = $mongoDBServerDirectory + "mongod.exe"
$dbDeploymentConfig = $esfSolutionDirectory + "DbDeploymentConfig.cfg"

& $mongoDBServer --config $dbDeploymentConfig --install