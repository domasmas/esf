$esfDataAccessProjectPath = Resolve-Path "$PSScriptRoot\..\Esf.DataAccess"
cd $esfDataAccessProjectPath
.\Deploy.ps1
$esfWebsiteProjectPath = Resolve-Path "$PSScriptRoot\..\Esf.Website"
cd $esfWebsiteProjectPath
.\Deploy.ps1