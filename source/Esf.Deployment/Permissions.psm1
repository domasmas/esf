function CheckForElevatedPermissions {
    If (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
        [Security.Principal.WindowsBuiltInRole] "Administrator"))

    {
        Write-Error "You do not have Administrator rights to run this script!`nPlease re-run this script as an Administrator!"
        Break
    }
}

Export-ModuleMember -Function CheckForElevatedPermissions