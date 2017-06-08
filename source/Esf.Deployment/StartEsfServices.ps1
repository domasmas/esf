Import-Module $PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.psm1
StartMongoDbServerInSeparateProcess

Import-Module $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.psm1
Start-EsfQueryRunner

$env:ASPNETCORE_ENVIRONMENT='Development'
Start-Process powershell.exe -ArgumentList " -command dotnet run" -WorkingDirectory $PSScriptRoot\..\Esf.WebApi
Start-Process powershell.exe -ArgumentList " -command dotnet run" -WorkingDirectory $PSScriptRoot\..\Esf.Website