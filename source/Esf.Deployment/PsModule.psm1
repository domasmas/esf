function IsModuleInstalled($moduleName) {
	return [bool] (Get-Module -ListAvailable | Where-Object { $_.Name -eq $moduleName})
}

function EnsureThirdPartyModuleIsInstalled($moduleName, $url) {

	if (-Not (IsThirdPartyModuleInstalled $moduleName)) {
		if (-Not (Test-Path $PSScriptRoot\ThirdPartyModules)) {
			New-Item $PSScriptRoot\ThirdPartyModules -type directory
		}
		
		DownloadModuleFile $moduleName $url 
	}
}

function DownloadModuleFile($moduleName, $url) {
	$modulePath	= "$PSScriptRoot\ThirdPartyModules\$moduleName.psm1"
	(new-object Net.WebClient).DownloadFile($url, $modulePath)
}

function DownloadModuleZipFile($moduleName, $url) {
	$modulePath	= "$PSScriptRoot\ThirdPartyModules\$moduleName.zip"
	(new-object Net.WebClient).DownloadFile($url, $modulePath)
}

function IsThirdPartyModuleInstalled($moduleName, $modulePath = "") {
	$moduleFilePath	= "$PSScriptRoot\ThirdPartyModules\"
	if ($modulePath.length -gt 0) {
		$moduleFilePath = Join-Path -Path $moduleFilePath -ChildPath $modulePath
	}
	$moduleFilePath = Join-Path -Path $moduleFilePath -ChildPath "$moduleName.psm1"
	return (Test-Path $moduleFilePath);
}


function UnzipFile($backupPath, $destination) {
	Add-Type -assembly “system.io.compression.filesystem”
	[io.compression.zipfile]::ExtractToDirectory($backupPath, $destination)
}

function GetThirdPartyModulePath($moduleName) {
	Return (Resolve-Path $PSScriptRoot\ThirdPartyModules\$moduleName.psm1)
}

Export-ModuleMember -Function IsModuleInstalled, IsThirdPartyModuleInstalled, GetThirdPartyModulePath, EnsureThirdPartyModuleIsInstalled, DownloadModuleFile, UnzipFile, DownloadModuleZipFile