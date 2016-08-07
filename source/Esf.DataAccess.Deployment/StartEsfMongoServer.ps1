function StartMongoDbServer($mongoDbServerDirectory, $esFiddleDbPath)
{
    $mongoDbServer = $mongoDbServerDirectory + "mongod.exe"
    New-Item -ItemType Directory -Force -Path "$esFiddleDbPath\DB"	
    & $mongoDbServer --dbpath "$esFiddleDbPath\DB" --logpath "$esFiddleDbPath\Log.log"
}
$dbDeploymentConfig = (Get-Content .\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
echo "Starting Mongo DB Server for ES Fiddle"
StartMongoDbServer $dbDeploymentConfig.mongoDbServerDirectory $dbDeploymentConfig.esFiddleDbPath