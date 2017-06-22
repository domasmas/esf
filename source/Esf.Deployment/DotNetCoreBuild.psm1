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

function RestoreDotNetSolution($solutionPath) {
	$result = (dotnet restore (Resolve-Path $solutionPath))
	return [PSCustomObject] @{
		Result = $result
		ErrorCode = $LASTEXITCODE
	}
}

Export-ModuleMember -Function BuildDotNetSolution, RunXunitSuite