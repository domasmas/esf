function GetWebsiteProject() {
	$esfWebsiteProjectPath = Resolve-Path "$PSScriptRoot\..\Esf.Website"
	return $esfWebsiteProjectPath
}

function GetTestsOutputDir() {
    Return "$PSScriptRoot\TestsOutput"
}

function RunEsfWebsiteGulpTask($gulpTaskName, $outputLogFileName, $errorsLogFileName) {
    $esfWebsiteProjectPath = GetWebsiteProject
    $testsOutputDir = GetTestsOutputDir
    if (-Not (Test-Path $testsOutputDir)) {
		New-Item -ItemType Directory $testsOutputDir
	}
	$result = Start-Process -WorkingDirectory $esfWebsiteProjectPath -FilePath "npm" -ArgumentList "run gulp $gulpTaskName" -Wait -PassThru -RedirectStandardError "$testsOutputDir\$errorsLogFileName.txt" -RedirectStandardOutput "$testsOutputDir\$outputLogFileName.txt"
    Return $result 
}

function RunWebsiteUnitTests() {
    Return (RunEsfWebsiteGulpTask "unit-tests:single-run" "unitTests-output" "unitTests-errors") 
}

function RunWebsiteE2ETests() {
    Return (RunEsfWebsiteGulpTask "e2etests:startServerAndRunTests" "e2eTests-output" "e2eTests-errors")
}

function ReportTestsResult($message, $testsErrorCode) {
	if ($testsErrorCode -eq 0) {
		Write-Host -ForegroundColor Green "All $message succeeded"
	}
	else {
		Write-Host -ForegroundColor Red "$message failed"
	}
}

Write-Progress -Activity "Unit tests" -Status "Started"
$unitTestsOutput = RunWebsiteUnitTests
ReportTestsResult "Unit tests" $unitTestsOutput.ExitCode
Write-Progress -Activity "Unit tests" -Status "Finished"

Write-Progress -Activity "End to end tests" -Status "Started"
$e2etestsOutput = RunWebsiteE2ETests 
Write-Progress -Activity "End to end tests" -Status "Finished"
ReportTestsResult "End to end tests" $e2etestsOutput.ExitCode
Write-Host "You can check the output from the tests in:"
Write-Host (GetTestsOutputDir) 