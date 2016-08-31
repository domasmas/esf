function IsModuleInstalled($moduleName) {
	return [bool] (Get-Module -ListAvailable | Where-Object { $_.Name -eq $moduleName})
}

function EnsureThirdPartyModuleIsInstalled($moduleName, $url) {
	if (-Not (Test-Path $PSScriptRoot\ThirdPartyModules\$moduleName)) {
		if (-Not (Test-Path $PSScriptRoot\ThirdPartyModules)) {
			New-Item $PSScriptRoot\ThirdPartyModules -type directory
		}
		(new-object Net.WebClient).DownloadString($url) | Out-File $PSScriptRoot\ThirdPartyModules\$moduleName
	}
}

function ImportThirdPartyModule($moduleName) {
	Import-Module $PSScriptRoot\ThirdPartyModules\$moduleName
}

Export-ModuleMember -Function IsModuleInstalled, ImportThirdPartyModule, EnsureThirdPartyModuleIsInstalled