function deployDb($esfSolutionDirectory, $mongoDBServerDirectory, $dbRootDirectory, $dbName)
{
    $mongoDBServer = $mongoDBServerDirectory + "mongod.exe"
    $dbPath = $dbRootDirectory + $dbName
    $logPath = $dbRootDirectory + "log\" + $dbName + ".log"
    New-Item -ItemType Directory -Force -Path $dbPath
    New-Item -ItemType File -Force $logPath
    & $mongoDBServer --dbpath $dbPath --logpath $logPath
}

deployDb "C:\Sources\esf\source\" "C:\Program Files\MongoDB\Server\3.2\bin\" "C:\databases\" "EsFiddle"