function RunEsfNUnitDeploymentTests($deployDbOutputDir) {
	$EsfRootDir = Resolve-Path "$PSScriptRoot\.."
	# Set nunit path test runner
	$nunit = Resolve-Path "$EsfRootDir\packages\NUnit.ConsoleRunner.3.4.1\tools\nunit3-console.exe"
	$deploymentTestsOutputDir = Resolve-Path "$EsfRootDir\..\bin\Esf.DataAccess.DeploymentTests"
	#Find tests in OutDir
	$tests = (Get-ChildItem $deploymentTestsOutputDir -Recurse -Include *Tests.dll)

	# Run tests
	$deployDbTestsXml = "deployDb.tests.xml"
	& $nunit "-work" $deployDbOutputDir "-result" $deployDbTestsXml $tests
	Return [PSCustomObject]@{
	  FailedTestsCount = (ReadNUnitFailedTestsCount $deployDbOutputDir\$deployDbTestsXml)
	}
}

function ReadNUnitFailedTestsCount($xmlResultFilePath) {
	$nUnitXmlResult = [xml](Get-Content $xmlResultFilePath)
	return [int] $nUnitXmlResult."test-run".failed
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

Export-ModuleMember -Function DeployDb, StartMongoDbServerInSeparateProcess, RunEsfNUnitDeploymentTests