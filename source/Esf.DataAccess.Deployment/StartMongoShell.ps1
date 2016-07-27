$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
$mongoShell =  $dbDeploymentConfig.mongoDbServerDirectory + "mongo.exe"
& $mongoShell