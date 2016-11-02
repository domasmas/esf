Describe "Environment Prerequisites" {
	It "Checks is node version 6.x.x" {
		[string] $nodeVersion = Invoke-Expression "node --version"
		$majorVersionStartIndex = 1
		$majorVersionLength = $nodeVersion.IndexOf(".")	- $majorVersionStartIndex 	
		$majorVersion = $nodeVersion.Substring($majorVersionStartIndex, $majorVersionLength);

		$majorVersion | Should Be "6"
	}

	It "Checks is npm version 3.x.x" {
		[string] $npmVersion = Invoke-Expression "npm --version"
		$majorVersionLength = $npmVersion.IndexOf(".")
		$npmMajorVersion = $npmVersion.Substring(0, $majorVersionLength)

		$npmMajorVersion | Should Be "3"
	}

	It "Checks is powershell version 5.x.x" {
		$PSVersionTable.PSVersion.Major | Should Be 5
	}

	Context "Installed MSIs" {
		function GetMsiInstalledPackage($msiDisplayName, $majorVersion = "*", $minorVersion = "*", $displayVersion = "*") {
			$uninstallRegistryPaths = @(
            'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
            'HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
			)

			$result = Get-ChildItem $uninstallRegistryPaths | ForEach-Object {Get-ItemProperty $_.pspath} | 
				ForEach-Object {Get-ItemProperty  $_.pspath } | 
				Where-Object { $_.DisplayName -like $msiDisplayName } |
				Where-Object { $_.VersionMajor -like $majorVersion -and $_.VersionMinor -like $minorVersion } | 
				Where-Object { $_.DisplayVersion -like $displayVersion }
			return $result;
		}

		function IsMsiPackageInstalled($msiDisplayName, $majorVersion = "*", $minorVersion = "*", $displayVersion = "*") {
			return [bool] (GetMsiInstalledPackage $msiDisplayName $majorVersion $minorVersion $displayVersion)
		}

		It "Checks Visual Studio 2015 Update 3" {
			$msiName = "*Visual Studio 2015 Update 3*"
			$majorVersion = "14"
			(IsMsiPackageInstalled $msiName $majorVersion) | Should Be True
		}

		It "Checks Java 8 redistributable" {
			$msiName = "*Java*"
			$majorVersion = "8"
			(IsMsiPackageInstalled $msiName $majorVersion) | Should Be True
		}

		It "Checks Typescript 2.0" {
			$msiName = "TypeScript*"
			$majorVersion = "2"
			$minorVersion = "0"
			(IsMsiPackageInstalled $msiName $majorVersion $minorVersion) | Should Be True
		}

	}
}