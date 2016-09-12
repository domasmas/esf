function EnsurePathIsRemoved($path) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
    }
}

function EnsureDirectoryExists($directoryPath) {
    if (-Not (Test-Path $directoryPath)) {
        New-Item -ItemType Directory $directoryPath
    }
}

function EnsureBinPathsAreRemoved($esfRootPath) {    
    EnsurePathIsRemoved "$esfRootPath\bin\Esf.DataAccess"
    EnsurePathIsRemoved "$esfRootPath\bin\Esf.DataAccess.DeploymentTests"
    EnsurePathIsRemoved "$esfRootPath\bin\Esf.Domain"
}

function EnsureNugetPackagesAreRemoved($esfRootPath) {
    $nugetPackagesPath = "$esfRootPath\source\packages"
    Get-ChildItem -Path $nugetPackagesPath -Exclude "NuGet.CommandLine.3.4.3" | Remove-Item -Recurse -Force
}

function EnsureLongPathIsRemoved($path) {
    if (Test-Path $path) {
        $destPathToRemove = "C:\Temp\PathToRemove"
        New-Item -ItemType Directory -Path $destPathToRemove
        Robocopy.exe $destPathToRemove $path /MIR
        Remove-Item $path -Force
        Remove-Item $destPathToRemove
    }
}

function GitCleanEsf($esfRootPath) {
    cd $esfRootPath
    git.exe clean -fx -d
    cd $PSScriptRoot
}

function SiteExists($website) {
    return (get-website | where-object { $_.name -eq $website })
}

function CleanIIS() {
    Import-Module $PSScriptRoot\Permissions.psm1
    CheckForElevatedPermissions
    if (SiteExists "esf.WebApi") {
        Remove-Website "esf.Website"
        Remove-WebAppPool "esf.Website"
    }

    if (SiteExists "esf.WebApi") {
        Remove-Website "esf.WebApi"
        Remove-WebAppPool "esf.WebApi"
    }
}

function CleanEnvironment($databasePath, $esfRootPath, $cleanEnvironmentOutput) {
    Write-Output "Start cleaning ESF deployment"

    EnsurePathIsRemoved $databasePath
    EnsureBinPathsAreRemoved $esfRootPath
    EnsureNugetPackagesAreRemoved $esfRootPath
    
    EnsureDirectoryExists $cleanEnvironmentOutput
    $cleanEnvironmentOutput = Resolve-Path $cleanEnvironmentOutput
    EnsureLongPathIsRemoved "$esfRootPath\source\Esf.DataAccess\node_modules" | Out-File $cleanEnvironmentOutput\dataAccess_node_modules_removed.txt
    EnsurePathIsRemoved "$esfRootPath\source\Esf.DataAccess\upgradeOutput"

    EnsurePathIsRemoved "$esfRootPath\source\Esf.Deployment\DeploymentOutput"
    EnsurePathIsRemoved "$esfRootPath\source\Esf.Deployment\ThirdPartyModules"

    EnsureLongPathIsRemoved "$esfRootPath\source\Esf.Website\wwwroot" | Out-File $cleanEnvironmentOutput\website_wwwroot_removed.txt
    EnsureLongPathIsRemoved "$esfRootPath\source\Esf.Website\node_modules" | Out-File $cleanEnvironmentOutput\website_node_modules_removed.txt
    EnsureLongPathIsRemoved "$esfRootPath\source\Esf.Website\typings" | Out-File $cleanEnvironmentOutput\website_typings_removed.txt

    GitCleanEsf $esfRootPath

    CleanIIS

    Write-Output "Cleaning ESF deployment finished."

    Write-Output "To check cleaning logs go to: $CleanEnvironmentOutput"
}

$esfRootPath = Resolve-Path "$PSScriptRoot\..\..\"
$databasePath = "C:\Databases\EsFiddle"
$cleanEnvironmentOutput = "$esfRootPath\..\CleanEnvironmentOutput"
CleanEnvironment $databasePath $esfRootPath $cleanEnvironmentOutput