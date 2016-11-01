Import-Module $PSScriptRoot\PsModule.psm1

function ImportPester() {
	if (-Not (IsThirdPartyModuleInstalled "Pester" "Pester-3.4.3")) {
		DownloadModuleZipFile "Pester" "https://github.com/pester/Pester/archive/3.4.3.zip"
		UnzipFile $PSScriptRoot\ThirdPartyModules\Pester.zip $PSScriptRoot\ThirdPartyModules
	}
	Import-Module $PSScriptRoot\ThirdPartyModules\Pester-3.4.3\Pester.psm1
}

function RunPesterSuite($testsFilePath) {
	ImportPester
	$pesterResult = (Invoke-Pester -Script @{ Path = $testsFilePath} -PassThru)
	Return [PSCustomObject]@{
		FailedTestsCount = $pesterResult.TotalCount - $pesterResult.PassedCount
	}
}

Export-ModuleMember -Function RunPesterSuite

