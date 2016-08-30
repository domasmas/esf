function ImportInvoke-MsBuild() {
	Import-Module $PSScriptRoot\PsModule.psm1
	ImportPsGet

	if (-Not (IsModuleInstalled "Invoke-MsBuild"))
	{
		Install-Module -Name Invoke-MsBuild -Scope CurrentUser
	}
	Import-Module Invoke-MsBuild
}

function ReportResult($buildResult) {
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

function InvokeMsBuildOnProject($msBuildProjectPath, $buildLogDirectoryPath) {
	$buildResult = Invoke-MsBuild -Path $msBuildProjectPath -BuildLogDirectoryPath $buildLogDirectoryPath -MsBuildParameters "/target:Clean;Build" -KeepBuildLogOnSuccessfulBuilds
	ReportResult $buildResult
}
function InvokeMsBuildOnSolution($msBuildSolutionPath, $buildLogDirectoryPath) {
	$buildResult = Invoke-MsBuild -Path $msBuildSolutionPath -BuildLogDirectoryPath $buildLogDirectoryPath -Params "/target:Clean;Build /property:Configuration=Debug;Platform=""Any CPU"" " -KeepBuildLogOnSuccessfulBuilds
	ReportResult $buildResult
}

ImportInvoke-MsBuild
Export-ModuleMember -Function InvokeMsBuildOnSolution, InvokeMsBuildOnProject