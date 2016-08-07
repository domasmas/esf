echo $PSScriptRoot
$deployDbProjectPath = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess.Deployment\"
& "$PSScriptRoot\MsBuildEsfDebug.ps1" 2>&1> $PSScriptRoot\DeploymentOutput\MsBuildOutput.txt
& "$PSScriptRoot\GulpBuildEsfDebug.ps1" 2>&1> $PSScriptRoot\DeploymentOutput\GulpOutput.txt
Start-Process powershell.exe -ArgumentList "-file $deployDbProjectPath\DeployDb.ps1 -deployDbOutputFileName $PSScriptRoot\DeploymentOutput\dbDeployOutput.txt" -WorkingDirectory $deployDbProjectPath
Start-Process powershell.exe -ArgumentList "-file .\DeployWebsiteAndWebApi.ps1" -RedirectStandardOutput .\DeploymentOutput\DeployWebsiteAndWebApi.txt