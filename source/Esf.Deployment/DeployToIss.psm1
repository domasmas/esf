Import-Module $PSScriptRoot\PsModule.psm1

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
	if (-Not (IsThirdPartyModuleInstalled "Pester" "Pester-3.4.3")) {
		DownloadModuleZipFile "Pester" "https://github.com/pester/Pester/archive/3.4.3.zip"
		UnzipFile $PSScriptRoot\ThirdPartyModules\Pester.zip $PSScriptRoot\ThirdPartyModules
	}
	Import-Module $PSScriptRoot\ThirdPartyModules\Pester-3.4.3\Pester.psm1
}

function DeployWebsiteAndWebApi() {
	$websiteName = "esf.Website"
	$apiName = "esf.WebApi"

	Import-Module $PSScriptRoot\Permissions.psm1
	CheckForElevatedPermissions
	ImportWebAministrationModule
	cd IIS:
	$websiteDeploymentConfig = GetDeploymentConfig "$PSScriptRoot\esfWebsite.config.json"
	$webApiDeploymentConfig = GetDeploymentConfig "$PSScriptRoot\esfWebApi.config.json"
	$webApiPath = GetPSScriptRootPath($webApiDeploymentConfig.DeploymentPath)
	$websitePath = GetPSScriptRootPath($websiteDeploymentConfig.DeploymentPath)
	CreateWebsite $apiName $webApiDeploymentConfig.Port $webApiPath 
	CreateWebsite $websiteName $websiteDeploymentCOnfig.Port $websitePath	
		
	SetPermissions "$PSScriptRoot\$($webApiDeploymentConfig.DeploymentPath)" $apiName
	SetPermissions "$PSScriptRoot\$($websiteDeploymentConfig.DeploymentPath)" $websiteName
}

function RunDeployWebsiteAndWebApiTests() {
	$deploymentTestsPath = "$PSScriptRoot\DeployToIss.tests.ps1"
	ImportPester
	$pesterResult = (Invoke-Pester -Script @{ Path = $deploymentTestsPath} -PassThru)
	Return [PSCustomObject]@{
		FailedTestsCount = $pesterResult.TotalCount - $pesterResult.PassedCount
	}
}

function SetPermissions($path, $appPoolName) {
	$Acl = Get-Acl $path
	$Ar = New-Object  system.security.accesscontrol.filesystemaccessrule("IIS AppPool\$appPoolName","FullControl","ObjectInherit,ContainerInherit","None","Allow")
	$Ar2 = New-Object  system.security.accesscontrol.filesystemaccessrule("IUSR","FullControl","ObjectInherit,ContainerInherit","None","Allow")
	$Acl.SetAccessRule($Ar)
	$Acl.SetAccessRule($Ar2)
	Set-Acl $path  $Acl
}

Export-ModuleMember -Function DeployWebsiteAndWebApi, RunDeployWebsiteAndWebApiTests