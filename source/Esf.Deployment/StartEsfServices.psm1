#
# StartEsfServices.psm1
#
function Start-DotNetCore($dotNetCoreProjectPath, $ASPNETCORE_ENVIRONMENT) {
	$env:ASPNETCORE_ENVIRONMENT= $ASPNETCORE_ENVIRONMENT
	Start-Process powershell.exe -ArgumentList " -command dotnet run" -WorkingDirectory $dotNetCoreProjectPath 
}

function Start-EsfStateDbServer() {
	Import-Module $PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.psm1
	StartMongoDbServerInSeparateProcess
}

function Start-EsfQueryRunnerServer() {
	Import-Module $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.psm1
	Start-EsfQueryRunner
}

function Start-EsfWebApiServer($ASPNETCORE_ENVIRONMENT = "Development") {
	Start-DotNetCore $PSScriptRoot\..\Esf.WebApi $ASPNETCORE_ENVIRONMENT
}

function Start-EsfWebsiteServer() {
	Start-DotNetCore $PSScriptRoot\..\Esf.Website $ASPNETCORE_ENVIRONMENT
}

Export-ModuleMember -Function Start-EsfStateDbServer, Start-EsfQueryRunnerServer, Start-EsfWebApiServer, Start-EsfWebsiteServer