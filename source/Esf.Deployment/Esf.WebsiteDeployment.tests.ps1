function GetDeploymentConfig($configFilePath)
{
	return (Get-Content $configFilePath) -join "`n" | ConvertFrom-Json
}

Describe "esf.Website deployment"  {
	Context "Self-hosted deployment" {		
		$esfsiteApiConfig = GetDeploymentConfig("$PSScriptRoot\..\Esf.WebApi\hostsettings.json")

		It "should be able to navigate the home page" {
			$hostServerUrl = $esfsiteApiConfig."server.urls"

			$NavigationHeadResponse = Invoke-WebRequest -Uri "$hostServerUrl" -Method Head -UseBasicParsing
			$NavigationHeadResponse.StatusCode | Should Be 200
			$NavigationHeadResponse.StatusDescription | Should Be "OK"
		}
	}
}