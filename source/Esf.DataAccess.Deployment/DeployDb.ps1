function deployDb($mongoDbServerDirectory, $mongoDbPath)
{
    $mongoDbServer = $mongoDbServerDirectory + "mongod.exe"
    New-Item -ItemType Directory -Force -Path "$mongoDbPath\DB"
    & $mongoDbServer --dbpath "$mongoDbPath\DB" --logpath "$mongoDbPath\Log.log"
}
$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
deployDb $dbDeploymentConfig.mongoDbServerDirectory $dbDeploymentConfig.esFiddleDbPath