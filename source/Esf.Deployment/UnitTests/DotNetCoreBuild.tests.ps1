Describe "DotNetCoreBuild" {
	Import-Module $PSScriptRoot\..\DotNetCoreBuild.psm1

	Context "Builds Esf.sln using .Net Core" {
		$buildResult = BuildEsfSolution

		It "should build successfully" {
			$buildResult.ErrorCode | Should Be 0
		}

		It "should return build output with success message" {
			$comparisonOutputPath = "TestDrive:\DotNetCoreBuildOutput.txt"
			Set-Content -Path $comparisonOutputPath -Value $buildResult.Result
			$comparisonOutputPath | Should Contain ".*Build succeeded\..*"
		}
	}

	Context "Runs Esf State Db Deployment Tests" {
		$testsOutput = RunEsfStateDbDeploymentTests

		It "should run tests successfully" {
			$testsOutput.ErrorCode | Should Be 0
		}

		It "should contain tests output" {
			$comparisonOutputPath = "TestDrive:\EsfStateDbDeploymentTestsOutput.txt"
			Set-Content -Path $comparisonOutputPath -Value $testsOutput.Result
			$comparisonOutputPath | Should Contain ".+"
		}
	}
}