param (
    [string]$deployDbOutputFileName = ".\deployDbOutput.txt"
)

Start-Process powershell.exe -ArgumentList "-file .\StartEsfMongoServer.ps1" -NoNewWindow
Start-Process powershell.exe -ArgumentList "-file .\UpgradeDb.ps1" -NoNewWindow -RedirectStandardOutput $deployDbOutputFileName -Wait
$unitTestsPath = "$PSScriptRoot\DeployDb.tests.ps1"
Invoke-Pester -Script @{ Path = $unitTestsPath}