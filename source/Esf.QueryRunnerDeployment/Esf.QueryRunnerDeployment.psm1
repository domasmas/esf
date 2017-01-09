function Start-EsfQueryRunner {
	$QueryRunnerConfig  = (Get-Content $PSScriptRoot\Esf.QueryRunner.Config.json) -join "`n" | ConvertFrom-Json
	$ElaticSearchInstallPath = Resolve-Path $queryRunnerConfig.ElasticSearchInstallPath
	$Config =  "$PSScriptRoot\ElasticSearchConfig\"

	Start-Process -FilePath "$elaticSearchInstallPath\bin\elasticsearch.bat" -ArgumentList "-Epath.conf=$Config" 
	Start-Sleep 15
}

Export-ModuleMember -Function Start-EsfQueryRunner