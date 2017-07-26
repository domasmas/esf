Import-Module $PSScriptRoot\StartEsfServices.psm1

Start-EsfStateDbServer
Start-EsfQueryRunnerServer
Start-EsfWebApiServer "Development"
Start-EsfWebsiteServer "Development"