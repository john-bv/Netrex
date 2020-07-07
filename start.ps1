Function CheckDeno {
    try {
        if (Get-Command deno.exe) {
            return $true;
        } else {
            return $false;
        }
    } catch {
        return $false
    }
}
if (CheckDeno) {
    Write-Host "Starting..." -ForegroundColor Yellow
    deno.exe run -A ./src/Netrex.ts
} else {
    Invoke-WebRequest https://deno.land/x/install/install.ps1 -useb | Invoke-Expression
    Write-Host "Deno installed! Running project now!" -ForegroundColor Green
    deno.exe run -A ./src/Netrex.ts
}