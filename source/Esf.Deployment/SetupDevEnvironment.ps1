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
	if (-not (Test-Path $PSScriptRoot\DevEnvironment)) {
		New-Item $PSScriptRoot\DevEnvironment -type Directory
	}
	$OutputDirectory = Resolve-Path $PSScriptRoot\DevEnvironment
	Return "$OutputDirectory\$shortcutName.lnk"
}

function CreateStartEsfMongoServerShortcut() {
	$Command = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess.Deployment\StartEsfMongoServer.ps1"
	$OutputFilePath = GetShortcutFilePath "StartEsfMongoServer"
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
	CreatePowershellCommandShortcut $command $OutputFilePath
}

CreateStartEsfMongoServerShortcut
CreateCdEsfWebsiteShortcut
CreateDeployShortcut
CreateCleanEnvironmentShortcut