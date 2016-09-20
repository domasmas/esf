$dbDeploymentConfig = (Get-Content .\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
$mongoShell =  $dbDeploymentConfig.mongoDbServerDirectory + "mongo.exe"
echo "Starting MongoDB Shell for Es Fiddle"
& $mongoShell