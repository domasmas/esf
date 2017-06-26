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

		It "Checks Visual Studio 2017" {
			$msiName = "*Visual Studio 2017*"
			$majorVersion = "15"
			(IsMsiPackageInstalled $msiName $majorVersion) | Should Be $true
		}

		It "Checks Java 8 redistributable" {
			$msiName = "*Java*"
			$majorVersion = "8"
			(IsMsiPackageInstalled $msiName $majorVersion) | Should Be $true
		}

		It "Checks Typescript Tools for Visual Studio is 2.2" {	
			$isTypescript2_2Installed = Test-Path "${env:ProgramFiles(x86)}\Microsoft SDKs\TypeScript\2.2\tsc.exe"
			$isTypescript2_2Installed | Should Be $true
		}

	}

	It "Check IIS 10 is installed" {
		$iisRegistryItem = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\InetStp"

		$iisRegistryItem.SetupString | Should BeLike "IIS*"
		$iisRegistryItem.MajorVersion | Should BeLike 10
	}

	function LoadFromJson($jsonPath) {
		$path = Resolve-Path $jsonPath
		return (Get-Content $path) -join "`n" | ConvertFrom-Json
	}

	It "Check MongoDb is installed in program files" {
		$mongoDbConfigPath = "$PSScriptRoot\..\Esf.DataAccess.Deployment\dbDeployment.config.json"
		$mongoDbServerInstallPath = (LoadFromJson $mongoDbConfigPath).mongoDbServerDirectory
		Test-Path $mongoDbServerInstallPath | Should Be True
	}

	It "Check Elasticsearch is installed in program files" {
		$elasticsearchConfigPath = "$PSScriptRoot\..\Esf.QueryRunnerDeployment\Esf.QueryRunner.Config.json"
		$elasticserachInstallPath = (LoadFromJson $elasticsearchConfigPath).ElasticSearchInstallPath
		Test-Path $elasticserachInstallPath | Should Be True
	}
}