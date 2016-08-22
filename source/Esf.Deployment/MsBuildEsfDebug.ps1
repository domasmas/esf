function InvokeEsfMsBuild($msBuildProjectOrSolutionPath, $buildLogDirectoryPath)
{
	if (-Not (Get-Module Invoke-MsBuild))
	{
		Install-Module -Name Invoke-MsBuild -Scope CurrentUser
	}
	Import-Module Invoke-MsBuild
	
	$buildResult = Invoke-MsBuild -Path "$msBuildProjectOrSolutionPath" -BuildLogDirectoryPath $buildLogDirectoryPath -Params "/target:Clean;Build /property:Configuration=Debug;Platform=""Any CPU"" /verbosity:normal" -KeepBuildLogOnSuccessfulBuilds
	If ($buildResult.BuildSucceeded -eq $true)
	{ 
		Write-Output "Build completed successfully." 
	}
	ElseIf ($buildResult.BuildSucceeded -eq $false)
	{ 
		Write-Error "Build failed. Check the build log file $($buildResult.BuildLogFilePath) for errors." 
	}
	ElseIf ($buildResult.BuildSucceeded -eq $null)
	{ 
		Write-Warning "Unsure if build passed or failed: $($buildResult.Message)" 
	}
}