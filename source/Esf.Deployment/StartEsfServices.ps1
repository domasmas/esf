Import-Module $PSScriptRoot\..\Esf.DataAccess.Deployment\DeployDb.psm1
StartMongoDbServerInSeparateProcess

Import-Module $PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunnerDeployment.psm1
Start-EsfQueryRunner