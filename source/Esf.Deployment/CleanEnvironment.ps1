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
	if (Test-Path ".\Sites\$websiteName")
    {
        Remove-Website $websiteName
    }
    if (Test-Path ".\AppPools\$websiteName")
    {
        Remove-WebAppPool $websiteName
    }
}

ImportWebAministrationModule
cd IIS:
RemoveWebsiteIfExists "Esf.WebApi"
RemoveWebsiteIfExists "Esf.Website"
cd $PSScriptRoot\..\Esf.DataAccess.Deployment
.\DeleteDb.ps1
cd $PSScriptRoot