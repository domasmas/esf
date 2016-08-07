function upgradeDb($mongoDbServerDirectory)
{
	$mongoShell = $mongoDbServerDirectory + "mongo.exe"
	& $mongoShell ..\Esf.DataAccess\UpgradeOutput\upgradeScripts.js
}
echo "UpgradeScriptDb.ps1 root dir: $PSScriptRoot"
$dbDeploymentConfig = (Get-Content .\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
upgradeDb $dbDeploymentConfig.mongoDbServerDirectory