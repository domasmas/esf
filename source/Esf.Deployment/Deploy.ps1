echo $PSScriptRoot
. "$PSScriptRoot\MsBuildEsfDebug.ps1" 2>&1> $PSScriptRoot\DeploymentOutput\MsBuildOutput.txt
$esfSolution = Resolve-Path "$PSScriptRoot\..\Esf.sln"
$deploymentOutput = "$PSScriptRoot\DeploymentOutput"
InvokeEsfMsBuild $esfSolution $deploymentOutput 
$esfDeploymentSolution = Resolve-Path "$PSScriptRoot\..\Esf.Deployment.sln"
InvokeEsfMsBuild $esfDeploymentSolution $deploymentOutput
. "$PSScriptRoot\Esf.Website.Gulp.Deployment.ps1" 2>&1> $PSScriptRoot\DeploymentOutput\Esf.Website.Gulp.Deployment.txt
$deployDbScriptPath = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.ps1"
& $deployDbScriptPath -deployDbOutputDir $deploymentOutput
& $PSScriptRoot\DeployWebsiteAndWebApi.ps1 2>&1 > $PSScriptRoot\DeploymentOutput\DeployWebsiteAndWebApi.txt