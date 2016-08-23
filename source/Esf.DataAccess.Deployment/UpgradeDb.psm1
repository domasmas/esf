function RunUpgradeScripts($mongoDbServerDirectory) {
	$mongoShell = $mongoDbServerDirectory + "mongo.exe"
	& $mongoShell $PSScriptRoot\Esf.DataAccess\UpgradeOutput\upgradeScripts.js
}

function GulpGenerateUpgradeScripts() {
	# Setup npm and gulp
	cd $PSScriptRoot\..\Esf.DataAccess\
	npm install
	npm install --dev
	# Builds generates the upgrade script in UpgradeOtput folder
	npm run gulp generateUpgradeScripts
}

function UpgradeDb() {
	GulpGenerateUpgradeScripts
	$dbDeploymentConfig = (Get-Content .\dbDeployment.config.json) -join "`n" | ConvertFrom-Json
	RunUpgradeScripts $dbDeploymentConfig.mongoDbServerDirectory
}

Export-ModuleMember -Function UpgradeDb