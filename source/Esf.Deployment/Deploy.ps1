Import-Module $PSScriptRoot\MSBuild.psm1
$esfSolution = Resolve-Path "$PSScriptRoot\..\Esf.sln"
$deploymentOutput = "$PSScriptRoot\DeploymentOutput"
Write-Progress -Activity "Esf MS build" -Status "Started"
InvokeMsBuildOnSolution $esfSolution $deploymentOutput *>&1 | Out-File $PSScriptRoot\DeploymentOutput\Esf.MsBuild.txt
Write-Progress -Activity "Esf MS build" -Status "Finished"
$esfDataAccessDeploymentTests = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess.DeploymentTests\Esf.DataAccess.DeploymentTests.csproj"
Write-Progress -Activity "esfDataAccessDeploymentTests MS build" -Status "Started"
InvokeMsBuildOnProject $esfDataAccessDeploymentTests $deploymentOutput *>&1 | Out-File $PSScriptRoot\DeploymentOutput\Esf.DataAccess.DeploymentTests.MsBuild.txt
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