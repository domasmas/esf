param (
    [string]$deployDbOutputFileName = ".\deployDbOutput.txt"
)

function RunEsfNUnitDeploymentTests() {
	$EsfRootDir = Resolve-Path "$PSScriptRoot\.."
	# Set nunit path test runner
	$nunit = Resolve-Path "$EsfRootDir\packages\NUnit.ConsoleRunner.3.4.1\tools\nunit3-console.exe"
	$deploymentTestsOutputDir = Resolve-Path "$EsfRootDir\..\bin\Esf.DataAccess.DeploymentTests"
	#Find tests in OutDir
	$tests = (Get-ChildItem $deploymentTestsOutputDir -Recurse -Include *Tests.dll)

	# Run tests
	$outputArg = "-work"
	& $nunit $outputArg $deploymentTestsOutputDir $tests
}

Start-Process powershell.exe -ArgumentList "-file .\StartEsfMongoServer.ps1" -NoNewWindow
Start-Process powershell.exe -ArgumentList "-file .\UpgradeDb.ps1" -NoNewWindow -RedirectStandardOutput $deployDbOutputFileName -Wait

RunEsfNUnitDeploymentTests