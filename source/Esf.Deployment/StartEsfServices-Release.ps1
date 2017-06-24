Import-Module $PSScriptRoot\StartEsfServices.psm1

Start-EsfStateDbServer
Start-EsfQueryRunnerServer
Start-EsfWebApiServer "Production"
Start-EsfWebsiteServer "Production"