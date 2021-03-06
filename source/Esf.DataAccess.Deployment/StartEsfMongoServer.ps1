function StartMongoDbServer($mongoDbServerDirectory, $esFiddleDbPath, $esFiddlePort) {
	Clear-Host
	Write-Host -ForegroundColor Yellow "Starting Mongo DB Server for ES Fiddle"
    $mongoDbServer = $mongoDbServerDirectory + "mongod.exe"
	if (-Not (Test-Path -Path $esFiddleDbPath)) {
		New-Item -ItemType Directory -Force -Path "$esFiddleDbPath\DB"	
	}
    & $mongoDbServer --dbpath "$esFiddleDbPath\DB" --logpath "$esFiddleDbPath\Log.log" --port "$esFiddlePort"
}
$dbDeploymentConfig = (Get-Content $PSScriptRoot\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
StartMongoDbServer $dbDeploymentConfig.mongoDbServerDirectory $dbDeploymentConfig.esFiddleDbPath $dbDeploymentConfig.mongoDbServerPort