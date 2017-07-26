#
# StartEsfServices.psm1
#
function Start-DotNetCore($dotNetCoreProjectPath, $ASPNETCORE_ENVIRONMENT, $waitDelaySeconds) {
	$env:ASPNETCORE_ENVIRONMENT= $ASPNETCORE_ENVIRONMENT
	if ($ASPNETCORE_ENVIRONMENT -eq "Development") {
		$configuration = "Debug"
	}
	else {
		$configuration = "Release"
	}
	$dotnetRunCommand = " -command dotnet run -c '$configuration' "
	Start-Process powershell.exe -ArgumentList $dotnetRunCommand -WorkingDirectory $dotNetCoreProjectPath
	Start-Sleep -Seconds $waitDelaySeconds
}

function Start-EsfStateDbServer() {
	Import-Module $PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.psm1
	StartMongoDbServerInSeparateProcess
}

function Start-EsfQueryRunnerServer() {
	Import-Module $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.psm1
	Start-EsfQueryRunner
}

function Start-EsfWebApiServer($ASPNETCORE_ENVIRONMENT = "Development", $waitDelaySeconds = 0) {
	Start-DotNetCore $PSScriptRoot\..\Esf.WebApi $ASPNETCORE_ENVIRONMENT $waitDelaySeconds
}

function Start-EsfWebsiteServer($ASPNETCORE_ENVIRONMENT = "Development", $waitDelaySeconds = 0) {
	Start-DotNetCore $PSScriptRoot\..\Esf.Website $ASPNETCORE_ENVIRONMENT $waitDelaySeconds
}

Export-ModuleMember -Function Start-EsfStateDbServer, Start-EsfQueryRunnerServer, Start-EsfWebApiServer, Start-EsfWebsiteServer