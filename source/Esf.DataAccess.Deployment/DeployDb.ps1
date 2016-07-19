function deployDb($mongoDBServerDirectory, $mongoDbPath, $mongoDbLogPath)
{
    $mongoDBServer = $mongoDBServerDirectory + "mongod.exe"
    New-Item -ItemType Directory -Force -Path $mongoDbPath
    $mongoDBLogPathDirectory = Split-Path $mongoDbLogPath
    New-Item -ItemType Directory -Force -Path  $mongoDBLogPathDirectory
    & $mongoDBServer --dbpath $mongoDbPath --logpath $mongoDbLogPath
}
$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
deployDb $dbDeploymentConfig.mongoDbServerDirectory $dbDeploymentConfig.mongoDbPath $dbDeploymentConfig.mongoDbLogPath