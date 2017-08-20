function GetDeploymentConfig($configFilePath)
{
	return (Get-Content $configFilePath) -join "`n" | ConvertFrom-Json
}

Describe "esf.WebApi deployment"  {
	Context "self-hosted deployment" {		
		$esfWebApiConfig = GetDeploymentConfig("$PSScriptRoot\..\Esf.WebApi\hostsettings.json")

		It "should return states/new resource" {
			$hostServerUrl = $esfWebApiConfig."server.urls"

			$NavigationHeadResponse = Invoke-WebRequest -Uri "$hostServerUrl/states/new/" -Method Get -UseBasicParsing
			$NavigationHeadResponse.StatusCode | Should Be 200
			$NavigationHeadResponse.StatusDescription | Should Be "OK"
		}
	}
}
