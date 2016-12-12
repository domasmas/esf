function GetWebsiteProject() {
	$esfWebsiteProjectPath = Resolve-Path "$PSScriptRoot\..\Esf.Website"
	return $esfWebsiteProjectPath
}

function GetTestsOutputDir() {
    Return "$PSScriptRoot\TestsOutput"
}

function WriteStreamToTextFile([string] $fileName, [System.IO.StreamReader] $inputStream) {
    [System.IO.StreamWriter] $streamWriter = [System.IO.File]::CreateText($fileName)
    try {
    while (-Not ($inputStream.EndOfStream)) {
            $outputLine = $inputStream.ReadLine()
            $streamWriter.WriteLine($outputLine);
        }
    }
    finally {
        $streamWriter.Dispose();
    }
}

function RunEsfWebsiteGulpTask($gulpTaskName, $outputLogFileName, $errorsLogFileName) {
    $esfWebsiteProjectPath = GetWebsiteProject
    $testsOutputDir = GetTestsOutputDir
    if (-Not (Test-Path $testsOutputDir)) {
		New-Item -ItemType Directory $testsOutputDir
	}
	$processInfo = New-Object System.Diagnostics.ProcessStartInfo
	$processInfo.FileName = "powershell.exe"
	$processInfo.WorkingDirectory = $esfWebsiteProjectPath
	$processInfo.Arguments = "-executionpolicy unrestricted npm run gulp $gulpTaskName"
	$processInfo.RedirectStandardError = $true
	$processInfo.RedirectStandardOutput = $true
	$processInfo.UseShellExecute = $false

	$process = New-Object System.Diagnostics.Process
	$process.StartInfo = $processInfo
	$process.Start()
	$process.WaitForExit()
    WriteStreamToTextFile "$testsOutputDir\$outputLogFileName.txt" $process.StandardOutput
    WriteStreamToTextFile "$testsOutputDir\$errorsLogFileName.txt" $process.StandardError
    
    Return $process 
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