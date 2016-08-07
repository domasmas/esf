function GetDeploymentConfig($configFilePath)
{
	return (Get-Content $configFilePath) -join "`n" | ConvertFrom-Json
}
function ImportWebAministrationModule()
{
	if (-Not (Get-Module WebAdministration))
	{
		Add-PSSnapin WebAdministration
	}
	Import-Module WebAdministration	
}

function RemoveWebsiteIfExists($websiteName)
{
	if (Get-Website $websiteName)
    {
        Remove-Website $websiteName
    }
    if (Get-IISAppPool $websiteName)
    {
        Remove-WebAppPool $websiteName
    }
}

function CreateWebsite($websiteName, $portNumber, $physicalPath)
{
	RemoveWebsiteIfExists $websiteName
    New-WebAppPool -Name $websiteName -Force
    New-Website -Name $websiteName -Port $portNumber -PhysicalPath $physicalPath -ApplicationPool $websiteName -Force
}

$webApiDeploymentConfig = GetDeploymentConfig "$PSScriptRoot\esfWebApi.config.json"
$websiteDeploymentConfig = GetDeploymentConfig "$PSScriptRoot\esfWebsite.config.json"
ImportWebAministrationModule
cd IIS:
$webApiPath = Resolve-Path "$PSScriptRoot\$($webApiDeploymentConfig.DeploymentPath)"
$websitePath = Resolve-Path "$PSScriptRoot\$($websiteDeploymentConfig.DeploymentPath)"
CreateWebsite "esf.WebApi" 40081 $webApiPath
CreateWebsite "esf.Website" 40082 $websitePath