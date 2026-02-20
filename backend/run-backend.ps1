# Start MarketKosova backend (sets JAVA_HOME for JDK 21 then runs Spring Boot)
$jdkPath = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
if (-not (Test-Path $jdkPath)) {
    $jdkPath = (Get-ChildItem "C:\Program Files\Eclipse Adoptium\jdk-21*" -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
}
if ($jdkPath) {
    $env:JAVA_HOME = $jdkPath
    & "$PSScriptRoot\mvnw.cmd" spring-boot:run
} else {
    Write-Host "JDK 21 not found. Install from https://adoptium.net/ or set JAVA_HOME manually."
    exit 1
}
