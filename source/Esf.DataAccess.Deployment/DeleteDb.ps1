$dbDeploymentConfig = (Get-Content .\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
Remove-Item $dbDeploymentConfig.esFiddleDbPath -recurse