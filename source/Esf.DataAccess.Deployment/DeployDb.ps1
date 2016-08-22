param (
	[string]$deployDbOutputDir = "."
)

function RunEsfNUnitDeploymentTests() {
	$EsfRootDir = Resolve-Path "$PSScriptRoot\.."
	# Set nunit path test runner
	$nunit = Resolve-Path "$EsfRootDir\packages\NUnit.ConsoleRunner.3.4.1\tools\nunit3-console.exe"
	$deploymentTestsOutputDir = Resolve-Path "$EsfRootDir\..\bin\Esf.DataAccess.DeploymentTests"
	#Find tests in OutDir
	$tests = (Get-ChildItem $deploymentTestsOutputDir -Recurse -Include *Tests.dll)

	# Run tests
	& $nunit "-work" $deployDbOutputDir $tests
}

$deployDbOutputFileName = "$deployDbOutputDir\deployDbOutput.txt"
$mongoDbServerScriptPath = Resolve-Path $PSScriptRoot\StartEsfMongoServer.ps1
Start-Process powershell.exe -ArgumentList "-file $mongoDbServerScriptPath" -WorkingDirectory $PSScriptRoot
cd $PSScriptRoot
.\Esf.DataAccess.Gulp.Deployment.ps1
$upgradeDbScriptPath = Resolve-Path $PSScriptRoot\UpgradeDb.ps1
& $upgradeDbScriptPath 2>&1 > $deployDbOutputFileName

RunEsfNUnitDeploymentTests