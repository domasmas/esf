Describe "Esf.QueryRunnerDeployment" {
	Context "Elastic Search Diagnostic checks" {
		[Microsoft.PowerShell.Commands.HtmlWebResponseObject] $queryRunnerDiagnosticRequest = Invoke-WebRequest -Uri "Http://localhost:9200" -Method Get -TimeoutSec 10

		It "Should Query Runner Elastic Search server be up" {
			$queryRunnerDiagnosticRequest.StatusCode | Should Be 200
		}

		It "Should Elastic Search version be 5.x" {
			$queryRunnerStats = ($queryRunnerDiagnosticRequest.Content | ConvertFrom-Json)  
			$isElasticSearchVersion5 = $queryRunnerStats.version.number.StartsWith("5.")
			$isElasticSearchVersion5 | Should Be $True
		}

		It "Should Run on 64 bit JVM" {
			[String] $jvmVersion = (java -d64 -version) *>&1 | Select-String "64-Bit Server VM" 
			$jvmVersion.Length | Should BeGreaterThan 0 
		}
	}
}