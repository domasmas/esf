function upgradeDb($mongoDbServerDirectory)
{
	$mongoShell = $mongoDbServerDirectory + "mongo.exe"
	& $mongoShell ..\Esf.DataAccess\UpgradeOutput\upgradeScripts.js
}

$dbDeploymentConfig = (Get-Content .\dbDeploymentConfig.json) -join "`n" | ConvertFrom-Json
echo $dbDeploymentConfig
upgradeDb $dbDeploymentConfig.mongoDbServerDirectory