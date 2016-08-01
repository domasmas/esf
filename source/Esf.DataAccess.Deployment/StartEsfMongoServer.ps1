function deployDb($mongoDbServerDirectory, $esFiddleDbPath)
{
    $mongoDbServer = $mongoDbServerDirectory + "mongod.exe"
    New-Item -ItemType Directory -Force -Path "$esFiddleDbPath\DB"
    & $mongoDbServer --dbpath "$esFiddleDbPath\DB" --logpath "$esFiddleDbPath\Log.log"
}
$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
deployDb $dbDeploymentConfig.mongoDbServerDirectory $dbDeploymentConfig.esFiddleDbPath