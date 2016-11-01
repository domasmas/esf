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
}