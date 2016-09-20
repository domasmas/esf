$dbDeploymentConfig = (Get-Content .\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
if (Test-Path $dbDeploymentConfig.esFiddleDbPath)
{
	Remove-Item $dbDeploymentConfig.esFiddleDbPath -recurse
}