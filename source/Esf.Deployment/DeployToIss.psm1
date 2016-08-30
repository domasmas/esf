function GetDeploymentConfig($configFilePath) {
	return (Get-Content $configFilePath) -join "`n" | ConvertFrom-Json
}
function ImportWebAministrationModule() {
	if (-Not (IsModuleInstalled "WebAdministration"))
	{
		Add-PSSnapin WebAdministration
	}
	Import-Module WebAdministration	
}

function RemoveWebsiteIfExists($websiteName) {
	if (Get-Website $websiteName)
    {
        Remove-Website $websiteName
    }
    if (Get-IISAppPool $websiteName)
    {
        Remove-WebAppPool $websiteName
    }
}

function CreateWebsite($websiteName, $portNumber, $physicalPath) {
	RemoveWebsiteIfExists $websiteName
    New-WebAppPool -Name $websiteName -Force
    New-Website -Name $websiteName -Port $portNumber -PhysicalPath $physicalPath -ApplicationPool $websiteName -Force
}
function GetPSScriptRootPath($pathRelativeToProject) {
	return  Resolve-Path "$PSScriptRoot\$pathRelativeToProject"
}

function ImportPester() {
	Import-Module $PSScriptRoot\PsModule.psm1
	ImportPsGet
	if (-Not (IsModuleInstalled "Pester")) {
		Install-Module -Name Pester -Scope CurrentUser
	}
	Import-Module Pester
}

function DeployWebsiteAndWebApi() {
	Import-Module $PSScriptRoot\Permissions.psm1
	CheckForElevatedPermissions
	ImportWebAministrationModule
	cd IIS:
	$websiteDeploymentConfig = GetDeploymentConfig "$PSScriptRoot\esfWebsite.config.json"
	$webApiDeploymentConfig = GetDeploymentConfig "$PSScriptRoot\esfWebApi.config.json"
	$webApiPath = GetPSScriptRootPath($webApiDeploymentConfig.DeploymentPath)
	$websitePath = GetPSScriptRootPath($websiteDeploymentConfig.DeploymentPath)
	CreateWebsite "esf.WebApi" $webApiDeploymentConfig.Port $webApiPath 
	CreateWebsite "esf.Website" $websiteDeploymentCOnfig.Port $websitePath

	$unitTestsPath = "$PSScriptRoot\DeployToIss.tests.ps1"
	ImportPester
	Invoke-Pester -Script @{ Path = $unitTestsPath}
}
Export-ModuleMember -Function DeployWebsiteAndWebApi