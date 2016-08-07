if (-Not (Get-Module Invoke-MsBuild))
{
	Install-Module -Name Invoke-MsBuild 
}
Import-Module Invoke-MsBuild
$esfSolution = Resolve-Path "$PSScriptRoot\..\Esf.sln"
$buildResult = Invoke-MsBuild -Path "$esfSolution" -BuildLogDirectoryPath "$PSScriptRoot\DeploymentOutput" -Params "/target:Clean;Build /property:Configuration=Debug;Platform=""Any CPU"" /verbosity:normal" -KeepBuildLogOnSuccessfulBuilds
If ($buildResult.BuildSucceeded -eq $true)
{ 
	Write-Host "Build completed successfully." 
}
ElseIf ($buildResult.BuildSucceeded -eq $false)
{ 
	Write-Host "Build failed. Check the build log file $($buildResult.BuildLogFilePath) for errors." 
}
ElseIf ($buildResult.BuildSucceeded -eq $null)
{ 
	Write-Host "Unsure if build passed or failed: $($buildResult.Message)" 
}