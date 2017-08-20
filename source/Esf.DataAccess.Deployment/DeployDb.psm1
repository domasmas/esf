function RunEsfStateDbDeploymentTests() {
	Import-Module (Resolve-Path $PSScriptRoot\..\Esf.Deployment\DotNetCoreBuild.psm1)
	$testsPath = "$PSScriptRoot\..\Esf.DataAccess.DeploymentTests"
	RestoreDotNetSolution $testsPath #TODO - provide error logginf for the restore
	$deploymentTests = (RunXunitSuite $testsPath)
	Return $deploymentTests
}

function StartMongoDbServerInSeparateProcess() {
	$mongoDbServerScriptPath = Resolve-Path $PSScriptRoot\StartEsfMongoServer.ps1
	Start-Process powershell.exe -ArgumentList "-file $mongoDbServerScriptPath" -WorkingDirectory $PSScriptRoot
}

function DeployDb() {
	StartMongoDbServerInSeparateProcess
	cd $PSScriptRoot
	Import-Module $PSScriptRoot\UpgradeDb.psm1	
	& UpgradeDb
}

Export-ModuleMember -Function DeployDb, StartMongoDbServerInSeparateProcess, RunEsfStateDbDeploymentTests