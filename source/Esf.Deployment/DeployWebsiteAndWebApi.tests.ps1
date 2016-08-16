function GetDeploymentConfig($configFilePath)
{
	return (Get-Content $configFilePath) -join "`n" | ConvertFrom-Json
}
function GetPSScriptRootPath($pathRelativeToProject)
{
	return  Resolve-Path "$PSScriptRoot\$pathRelativeToProject"
}
function ImportWebAdministrationModule()
{
	if (-Not (Get-Module WebAdministration))
	{
		Add-PSSnapin WebAdministration
	}
	Import-Module WebAdministration	
}


Describe "esf.WebApi deployment"  {
	Context "deployment on IIS" {		
		$esfWebApiConfig = GetDeploymentConfig("$PSScriptRoot\esfWebApi.config.json")
		ImportWebAdministrationModule
		It "should have output path in config.json" {
			$esfWebApiConfig.DeploymentPath | Should Be "..\Esf.WebApi"
		}

		It "should have port number in config.json" {
			$esfWebApiConfig.Port | Should Be 40081
		}

		It "should have deployed and started website" {
			$esfWebApi = Get-Website -Name "esf.WebApi"
			$esfWebApi.State | Should Be "Started"
		}
	}
}

Describe "esf.Website IIS deployment" {
	Context "deployment on IIS" {		
		$esfWebApiConfig = GetDeploymentConfig("$PSScriptRoot\esfWebsite.config.json")
		ImportWebAdministrationModule
		It "should have output path in config.json" {
			$esfWebApiConfig.DeploymentPath | Should Be "..\Esf.Website"
		}

		It "should have port number in config.json" {
			$esfWebApiConfig.Port | Should Be 40082
		}

		It "should have deployed and started website" {
			$esfWebApi = Get-Website -Name "esf.Website"
			$esfWebApi.State | Should Be "Started"
		}
	}
}