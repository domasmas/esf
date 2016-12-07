$dbDeploymentConfig = (Get-Content $PSScriptRoot\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
$mongoShell =  $dbDeploymentConfig.mongoDbServerDirectory + "mongo.exe"
echo "Starting MongoDB Shell for Es Fiddle"
& $mongoShell