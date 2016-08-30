function IsModuleInstalled($moduleName) {
	return [bool] (Get-Module -ListAvailable | Where-Object { $_.Name -eq $moduleName})
}

function ImportPsGet() {
	if (-Not (IsModuleInstalled "PsGet")) {
		(new-object Net.WebClient).DownloadString("http://psget.net/GetPsGet.ps1") | iex
	}
}

Export-ModuleMember -Function IsModuleInstalled, ImportPsGet