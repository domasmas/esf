function RestoreNugetPackages($solutionPath) {
	$packagesDirectory = Resolve-Path "$PSScriptRoot\..\packages"
	$nugetPath = "$packagesDirectory\NuGet.CommandLine.3.4.3\tools\NuGet.exe"
	
	& $nugetPath restore -PackagesDirectory $packagesDirectory $solutionPath
}

function EnsureDeploymentOutputExists($deploymentOutput) {
	if (-Not (Test-Path $deploymentOutput)) {
		New-Item -ItemType Directory $deploymentOutput
	}
}

function RunXunitSuite($xunitProjectPath)
{
	cd (Resolve-Path $xunitProjectPath) 
	$testResult = (dotnet test)
	cd $PSScriptRoot
	return [PSCustomObject]@{
		Result = $testResult
		ErrorCode = $LASTEXITCODE
	}
}

function BuildDotNetSolution($solutionPath)
{
	$result = (dotnet build (Resolve-Path $solutionPath))
	return [PSCustomObject] @{
		Result = $result
		ErrorCode = $LASTEXITCODE
	}
}

function DeployEsf() {
	Write-Host -ForegroundColor Cyan "Deployment process of ES Fiddle"
	Import-Module $PSScriptRoot\MSBuild.psm1
	$esfSolution = Resolve-Path "$PSScriptRoot\..\Esf.sln"
	$deploymentOutput = "$PSScriptRoot\DeploymentOutput"
	EnsureDeploymentOutputExists $deploymentOutput
	
	Write-Progress -Activity "Prerequisites" -Status "Started"
	TestPrerequisites $deploymentOutput
	Write-Progress -Activity "Prerequisites" -Status "Finished"
	RestoreNugetPackages $esfSolution *>&1 | Out-File $deploymentOutput\EsfNugetPackagesRestore.txt
	$esfDeploymentSolution = Resolve-Path "$PSScriptRoot\..\Esf.Deployment.sln"
	RestoreNugetPackages $esfDeploymentSolution *>&1 | Out-File $deploymentOutput\EsfDeploymentNugetPackagesRestore.txt
	Write-Progress -Activity "Esf MS build" -Status "Started"
	InvokeMsBuildOnSolution $esfSolution $deploymentOutput *>&1 | Out-File $deploymentOutput\Esf.MsBuild.txt
	Write-Progress -Activity "Esf MS build" -Status "Finished"
	$esfDataAccessDeploymentTests = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess.DeploymentTests\Esf.DataAccess.DeploymentTests.csproj"
	Write-Progress -Activity "esfDataAccessDeploymentTests MS build" -Status "Started"
	InvokeMsBuildOnProject $esfDataAccessDeploymentTests $deploymentOutput *>&1 | Out-File $deploymentOutput\Esf.DataAccess.DeploymentTests.MsBuild.txt
	Write-Progress -Activity "$esfDataAccessDeploymentTests MS build" -Status "Finished"
	Import-Module $PSScriptRoot\Esf.Website.GulpBuild.psm1
	Write-Progress -Activity "Esf.Website Gulp Build" -Status "Started"
	EsfWebsiteGulpBuild *>&1 | Out-File $PSScriptRoot\DeploymentOutput\Esf.Website.GulpBuild.txt
	Write-Progress -Activity "Esf.Website Gulp Build" -Status "Finished"
	Import-Module $PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.psm1
	Write-Progress -Activity "Deploy DB" -Status "Started"
	& DeployDb *>&1 |  Out-File $PSScriptRoot\DeploymentOutput\DeployDB.output.txt
	($deployDbTestsResult = RunEsfNUnitDeploymentTests $deploymentOutput) *>&1 |  Out-File $PSScriptRoot\DeploymentOutput\DeployDB.tests.txt
	ReportTestsResult "deploy DB tests" $deployDbTestsResult.FailedTestsCount
	Write-Progress -Activity "Deploy DB" -Status "Finished"
	Import-Module $PSScriptRoot\DeployToIss.psm1
	Write-Progress -Activity "Deploy Website and web api" -Status "Started"
	DeployWebsiteAndWebApi *>&1 | Out-File $PSScriptRoot\DeploymentOutput\DeployWebsiteAndWebApi.txt
	Write-Progress -Activity "Deploy Website and web api" -Status "Finished"
	($deployWebsiteAndWebApiTestsResult = RunDeployWebsiteAndWebApiTests) *>&1 | Out-File $PSScriptRoot\DeploymentOutput\DeployWebsiteAndWebApi.tests.txt
	ReportTestsResult "website and web api tests" $deployWebsiteAndWebApiTestsResult.FailedTestsCount
	
	Import-Module $PSScriptRoot\PesterSuite.psm1
	Import-Module $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.psm1
	Write-Progress -Activity "Deploy Elastic Search Query Runner" -Status "Started"
	Start-EsfQueryRunner
	$startQueryRunnerTests = (RunPesterSuite $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.tests.ps1) *>&1 | Out-File $PSScriptRoot\DeploymentOutput\QueryRunner.tests.txt
	ReportTestsResult "Query runner deployment tests" $startQueryRunnerTests.FailedTestsCount
	Write-Progress -Activity "Deploy Elastic Search Query Runner" -Status "Finished"

	Write-Output "Deployment finished. To check if it is successful go to:"
	Write-Output $deploymentOutput
	
	If ($deployWebsiteAndWebApiTestsResult.FailedTestsCount -eq 0) { 
		OpenWebsite 
	}
}

function ReportTestsResult($message, $testsFailedCount) {
	if ($testsFailedCount -eq 0) {
		Write-Host -ForegroundColor Green "All $message succeeded"
	}
	if ($testsFailedCount -gt 0) {
		Write-Host -ForegroundColor Red "$message failed"
	}
}

function OpenWebsite() {
	$port = $((Get-Content "$PSScriptRoot\esfWebsite.config.json") -join "`n" | ConvertFrom-Json).Port
	start "http://localhost:$port"
}

function TestPrerequisites($deploymentOutput) {
	Import-Module $PSScriptRoot\PesterSuite.psm1
	($preqequisitesTestsResult = RunPesterSuite $PSScriptRoot\Prerequisites.tests.ps1) *>&1 |  Out-File $deploymentOutput\prerequisites.tests.txt	
	ReportTestsResult "environment prerequisites tests" $preqequisitesTestsResult.FailedTestsCount
	If ($preqequisitesTestsResult.FailedTestsCount -gt 0) {
		$prerequisitesFailedTestsResult = (Get-Content $deploymentOutput\prerequisites.tests.txt) | Out-String
		Write-Output $prerequisitesFailedTestsResult
	}

}

Clear-Host
$buildDotNetSolution = BuildDotNetSolution "$PSScriptRoot\..\Esf.sln"
$buildDotNetSolution.Result | Out-File $PSScriptRoot\DeploymentOutput\EsfDotnetBuild.txt
ReportTestsResult "Esf.sln Dotnet Build" $buildDotNetSolution.ErrorCode
$deploymentTests = (RunXunitSuite "$PSScriptRoot\..\Esf.DataAccess.DeploymentTests" )
$deploymentTests.Result | Out-File $PSScriptRoot\DeploymentOutput\deploymentTests.txt
ReportTestsResult "Es Fiddle State database tests" $deploymentTests.ErrorCode
#DeployEsf
Pause