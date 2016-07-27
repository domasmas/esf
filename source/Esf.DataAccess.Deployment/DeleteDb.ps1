$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
Remove-Item $dbDeploymentConfig.esFiddleDbPath -recurse