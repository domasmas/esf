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
		$esfWebApi = Get-Website -Name "esf.WebApi"

		It "should have output path in config.json" {
			$deploymentPath = $esfWebApiConfig.DeploymentPath
			$expectedPath = Resolve-Path $PSScriptRoot\$deploymentPath
			$esfWebApi.PhysicalPath | Should Be $expectedPath.Path
		}

		It "should have port number in config.json" {
			$expectedPort = $esfWebApiConfig.Port
			$actualBinding = $esfWebApi.Bindings.Collection.BindingInformation
			$actualBinding | Should Match $expectedPort
		}

		It "should have deployed and started website" {
			
			$esfWebApi.State | Should Be "Started"
		}

		It "should return states/new resource" {
			$portNumber = $esfWebApiConfig.Port
			$NavigationHeadResponse = Invoke-WebRequest -Uri "http://localhost:$portNumber/states/new/" -Method Get -UseBasicParsing
			$NavigationHeadResponse.StatusCode | Should Be 200
			$NavigationHeadResponse.StatusDescription | Should Be "OK"
		}
	}
}

Describe "esf.Website IIS deployment" {
	Context "deployment on IIS" {		
		$esfWebsiteConfig = GetDeploymentConfig("$PSScriptRoot\esfWebsite.config.json")
		ImportWebAdministrationModule
		$esfWebsite = Get-Website -Name "esf.Website"

		It "should have the right deployment path" {
			$deploymentPath = $esfWebsiteConfig.DeploymentPath
			$expectedPath = Resolve-Path $PSScriptRoot\$deploymentPath
			$esfWebsite.PhysicalPath | Should Be $expectedPath.Path
		}

		It "should have the right port number" {
			$expectedPort = $esfWebsiteConfig.Port
			$actualBinding = $esfWebsite.Bindings.Collection.BindingInformation
			$actualBinding | Should Match $expectedPort
		}

		It "should be started" {			
			$esfWebsite.State | Should Be "Started"
		}

		It "should be able to navigate the home page" {
			$portNumber = $esfWebsiteConfig.Port
			$NavigationHeadResponse = Invoke-WebRequest -Uri "http://localhost:$portNumber" -Method Head -UseBasicParsing
			$NavigationHeadResponse.StatusCode | Should Be 200
			$NavigationHeadResponse.StatusDescription | Should Be "OK"
		}
	}
}