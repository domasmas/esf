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

function DeployEsf() {
	Write-Host -ForegroundColor Cyan "Deployment process of ES Fiddle"
	Import-Module $PSScriptRoot\MSBuild.psm1
	$esfSolution = Resolve-Path "$PSScriptRoot\..\Esf.sln"
	$deploymentOutput = "$PSScriptRoot\DeploymentOutput"
	EnsureDeploymentOutputExists $deploymentOutput

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
	& DeployDb $deploymentOutput
	Write-Progress -Activity "Deploy DB" -Status "Finished"
	Import-Module $PSScriptRoot\DeployToIss.psm1
	Write-Progress -Activity "Deploy Website and web api" -Status "Started"
	DeployWebsiteAndWebApi *>&1 | Out-File $PSScriptRoot\DeploymentOutput\DeployWebsiteAndWebApi.txt
	Write-Progress -Activity "Deploy Website and web api" -Status "Finished"
}

Clear-Host
DeployEsf
Pause