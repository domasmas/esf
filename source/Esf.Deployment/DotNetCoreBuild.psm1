#
# DotNetCoreBuild.psm1
#
function RunXunitSuite($xunitProjectPath) {
	cd (Resolve-Path $xunitProjectPath) 
	$testResult = (dotnet test)
	cd $PSScriptRoot
	return [PSCustomObject] @{
		Result = $testResult
		ErrorCode = $LASTEXITCODE
	}
}

function BuildDotNetSolution($solutionPath) {
	$result = (dotnet build (Resolve-Path $solutionPath))
	return [PSCustomObject] @{
		Result = $result
		ErrorCode = $LASTEXITCODE
	}
}

function BuildEsfSolution() {
	$buildDotNetSolution = BuildDotNetSolution "$PSScriptRoot\..\Esf.sln"
	Return $buildDotNetSolution
}

function RunEsfStateDbDeploymentTests() {
	$deploymentTests = (RunXunitSuite "$PSScriptRoot\..\Esf.DataAccess.DeploymentTests" )
	Return $deploymentTests
}

Export-ModuleMember -Function BuildEsfSolution, RunEsfStateDbDeploymentTests