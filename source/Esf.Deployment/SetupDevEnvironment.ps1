function CreatePowershellCommandShortcut($Command, $OutputFilePath, $isRunAsAdmin = $false) {
	$TargetPowershell = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
	$WScriptShell = New-Object -ComObject WScript.Shell
	$Shortcut = $WScriptShell.CreateShortcut($OutputFilePath)
	$Shortcut.TargetPath  = $TargetPowershell
	$Shortcut.Arguments = "-noexit -command ""$Command"""
	$Shortcut.Save()
	if ($isRunAsAdmin -eq $true) {
		AddRunAsAdminFlagToShortcut($OutputFilePath)
	}
}

function AddRunAsAdminFlagToShortcut($ShortcutPath) {
	$bytes = [System.IO.File]::ReadAllBytes($ShortcutPath)
	$bytes[0x15] = $bytes[0x15] -bor 0x20 #set byte 21 (0x15) bit 6 (0x20) ON
	[System.IO.File]::WriteAllBytes($ShortcutPath, $bytes)
}

function GetShortcutFilePath($ShortcutName) {		
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $outputPath = "$desktopPath\DevEnvironment"
    if (-not (Test-Path $outputPath)) {        
		New-Item $outputPath -type Directory | Out-Null #need Out-Null to create directory before using it
	}
	Return "$outputPath\$shortcutName.lnk"
}

function CreateStartEsfMongoShellShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess.Deployment\StartMongoShell.ps1"
	$OutputFilePath = GetShortcutFilePath "StartEsfMongoShell"
	CreatePowershellCommandShortcut $command $OutputFilePath
}

function CreateStartEsfServicesDebugShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\StartEsfServices-Debug.ps1"
	$OutputFilePath = GetShortcutFilePath "StartEsfServices-Debug"
	CreatePowershellCommandShortcut $command $OutputFilePath
}
function CreateStartEsfServicesReleaseShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\StartEsfServices-Release.ps1"
	$OutputFilePath = GetShortcutFilePath "StartEsfServices-Release"
	CreatePowershellCommandShortcut $command $OutputFilePath
}

function CreateCdEsfWebsiteShortcut() {
	$Command = "cd $PSScriptRoot\..\Esf.Website"
	$OutputFilePath = GetShortcutFilePath "CD ESf.Website"
	CreatePowershellCommandShortcut $command $OutputFilePath $true
}

function CreateDeployShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\..\Esf.Deployment\Deploy.ps1"
	$OutputFilePath = GetShortcutFilePath "Deploy"
	CreatePowershellCommandShortcut $command $OutputFilePath $true
}

function CreateCleanEnvironmentShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\..\Esf.Deployment\CleanEnvironment.ps1"
	$OutputFilePath = GetShortcutFilePath "CleanEnvironment"
	CreatePowershellCommandShortcut $command $OutputFilePath $true
}

function RunTestsShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\..\Esf.Deployment\RunTests.ps1"
	$OutputFilePath = GetShortcutFilePath "RunTests"
	CreatePowershellCommandShortcut $command $OutputFilePath
}

CreateStartEsfMongoShellShortcut
CreateStartEsfServicesDebugShortcut
CreateStartEsfServicesReleaseShortcut
CreateCdEsfWebsiteShortcut
CreateDeployShortcut
CreateCleanEnvironmentShortcut
RunTestsShortcut