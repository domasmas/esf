function deployDb($mongoDBServerDirectory, $mongoDbPath, $mongoDbLogPath)
{
    $mongoDBServer = $mongoDBServerDirectory + "mongod.exe"
    New-Item -ItemType Directory -Force -Path $mongoDbPath
    New-Item -ItemType File -Force $mongoDbLogPath
    & $mongoDBServer --dbpath $mongoDbPath --logpath $mongoDbLogPath
}
$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
deployDb $dbDeploymentConfig.mongoDbServerDirectory $dbDeploymentConfig.mongoDbPath $dbDeploymentConfig.mongoDbLogPath