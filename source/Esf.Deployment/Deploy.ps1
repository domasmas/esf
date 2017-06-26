function EnsureDeploymentOutputExists($deploymentOutput) {
	if (-Not (Test-Path $deploymentOutput)) {
		New-Item -ItemType Directory $deploymentOutput
	}
}

function DeployEsf() {
	Write-Host -ForegroundColor Cyan "Deployment process of ES Fiddle"
	
	$deploymentOutput = "$PSScriptRoot\DeploymentOutput"
	EnsureDeploymentOutputExists $deploymentOutput
	
	Write-Progress -Activity "Prerequisites" -Status "Started"
	TestPrerequisites $deploymentOutput
	Write-Progress -Activity "Prerequisites" -Status "Finished"

	Write-Progress -Activity "Esf .Net Core Build" -Status "Started"
	Import-Module $PSScriptRoot\DotNetCoreBuild.psm1
	$esfSolutionPath = "$PSScriptRoot\..\Esf.sln"
	$esfRestoreResult = (RestoreDotNetSolution	$esfSolutionPath)
	$esfRestoreResult.Result | Out-File $deploymentOutput\Esf-DotNetCoreRestore.txt
	ReportResult "Esf nuget restore" $esfRestoreResult.ErrorCode
	$esfBuildResult = (BuildDotNetSolution	$esfSolutionPath)
	$esfBuildResult.Result |  Out-File $deploymentOutput\Esf-DotNetCoreBuild.txt
	ReportResult "Esf .net core build" $esfBuildResult.ErrorCode
	Write-Progress -Activity "Esf .Net Core Build" -Status "Finished"

	Import-Module $PSScriptRoot\Esf.Website.GulpBuild.psm1
	Write-Progress -Activity "Esf.Website Gulp Build" -Status "Started"
	EsfWebsiteGulpBuild *>&1 | Out-File $PSScriptRoot\DeploymentOutput\Esf.Website.GulpBuild.txt
	Write-Progress -Activity "Esf.Website Gulp Build" -Status "Finished"

	Import-Module $PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.psm1
	Write-Progress -Activity "Deploy DB" -Status "Started"
	& DeployDb *>&1 |  Out-File $PSScriptRoot\DeploymentOutput\DeployDB.output.txt
	$deployDbTestsResult = RunEsfStateDbDeploymentTests
	$deployDbTestsResult.Result *>&1 |  Out-File $PSScriptRoot\DeploymentOutput\DeployDB.tests.txt
	ReportResult "Deploy DB tests" $deployDbTestsResult.ErrorCode
	Write-Progress -Activity "Deploy DB" -Status "Finished"
	
	Import-Module $PSScriptRoot\PesterSuite.psm1
	Import-Module $PSScriptRoot\StartEsfServices.psm1

	Write-Progress -Activity "Deploy Esf.WebApi" -Status "Started"
	Start-EsfWebApiServer "Production" 5
	($esfWebApiTests = RunPesterSuite $PSScriptRoot\Esf.WebApiDeployment.tests.ps1) *>&1 | Out-File $deploymentOutput\Esf.WebApiDeployment.tests.txt
	Write-Progress -Activity "Deploy Esf.WebApi" -Status "Finished"

	Write-Progress -Activity "Deploy Esf.Website" -Status "Started"
	Start-EsfWebsiteServer "Production" 5
	($esfWebsiteTests = RunPesterSuite $PSScriptRoot\Esf.WebsiteDeployment.tests.ps1) *>&1 | Out-File $deploymentOutput\Esf.WebsiteDeployment.tests.txt
	Write-Progress -Activity "Deploy Esf.Website" -Status "Finished"

	Import-Module $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.psm1
	Write-Progress -Activity "Deploy Elastic Search Query Runner" -Status "Started"
	Start-EsfQueryRunner
	$startQueryRunnerTests = (RunPesterSuite $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.tests.ps1) *>&1 | Out-File $PSScriptRoot\DeploymentOutput\QueryRunner.tests.txt
	ReportResult "Query runner deployment tests" $startQueryRunnerTests.FailedTestsCount
	Write-Progress -Activity "Deploy Elastic Search Query Runner" -Status "Finished"

	Write-Output "Deployment finished. To check if it is successful go to:"
	Write-Output $deploymentOutput
	
	If ($esfWebsiteTests.ErrorCode -eq 0) { 
		OpenWebsite 
	}
}

function ReportResult($message, $errorCode) {
	If ($errorCode -eq 0) {
		Write-Host -ForegroundColor Green "$message succeeded"
	}
	Else {
		Write-Host -ForegroundColor Red "$message failed"
	}
}

function OpenWebsite() {
	$hostServerUrl = $((Get-Content "$PSScriptRoot\..Esf.Website\hostsettings.json") -join "`n" | ConvertFrom-Json)."server.urls"
	start "$hostServerUrl"
}

function TestPrerequisites($deploymentOutput) {
	Import-Module $PSScriptRoot\PesterSuite.psm1
	($preqequisitesTestsResult = RunPesterSuite $PSScriptRoot\Prerequisites.tests.ps1) *>&1 |  Out-File $deploymentOutput\prerequisites.tests.txt	
	ReportResult "environment prerequisites tests" $preqequisitesTestsResult.FailedTestsCount
	If ($preqequisitesTestsResult.FailedTestsCount -gt 0) {
		$prerequisitesFailedTestsResult = (Get-Content $deploymentOutput\prerequisites.tests.txt) | Out-String
		Write-Output $prerequisitesFailedTestsResult
	}

}

Clear-Host
DeployEsf
Pause