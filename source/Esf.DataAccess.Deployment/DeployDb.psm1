function RunEsfNUnitDeploymentTests($deployDbOutputDir) {
	$EsfRootDir = Resolve-Path "$PSScriptRoot\.."
	# Set nunit path test runner
	$nunit = Resolve-Path "$EsfRootDir\packages\NUnit.ConsoleRunner.3.4.1\tools\nunit3-console.exe"
	$deploymentTestsOutputDir = Resolve-Path "$EsfRootDir\..\bin\Esf.DataAccess.DeploymentTests"
	#Find tests in OutDir
	$tests = (Get-ChildItem $deploymentTestsOutputDir -Recurse -Include *Tests.dll)

	# Run tests
	& $nunit "-work" $deployDbOutputDir $tests
}

function StartMongoDbServerInSeparateProcess() {
	$mongoDbServerScriptPath = Resolve-Path $PSScriptRoot\StartEsfMongoServer.ps1
	Start-Process powershell.exe -ArgumentList "-file $mongoDbServerScriptPath" -WorkingDirectory $PSScriptRoot
}

function DeployDb($deployDbOutputDir) {
	StartMongoDbServerInSeparateProcess
	cd $PSScriptRoot
	Import-Module $PSScriptRoot\UpgradeDb.psm1	
	& UpgradeDb

	RunEsfNUnitDeploymentTests $deployDbOutputDir
}

Export-ModuleMember -Function DeployDb
