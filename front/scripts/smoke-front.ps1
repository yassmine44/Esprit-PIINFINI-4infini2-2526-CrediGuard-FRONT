param(
  [string]$FrontBaseUrl = "http://localhost:4200",
  [Parameter(Mandatory = $true)]
  [string]$Email,
  [Parameter(Mandatory = $true)]
  [string]$Password
)

$ErrorActionPreference = "Stop"

function Invoke-ApiCheck {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [string]$Method,
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [hashtable]$Headers,
    [object]$Body,
    [int[]]$ExpectedStatus = @(200)
  )

  try {
    $params = @{
      Uri         = $Url
      Method      = $Method
      UseBasicParsing = $true
    }

    if ($null -ne $Headers -and $Headers.Count -gt 0) {
      $params.Headers = $Headers
    }

    if ($null -ne $Body) {
      $params.ContentType = "application/json"
      $params.Body = ($Body | ConvertTo-Json -Depth 10)
    }

    $response = Invoke-WebRequest @params
    $statusCode = [int]$response.StatusCode

    if ($ExpectedStatus -notcontains $statusCode) {
      return [pscustomobject]@{
        Name = $Name
        Status = "FAIL"
        HttpCode = $statusCode
        Detail = "Expected: $($ExpectedStatus -join ', ')"
      }
    }

    return [pscustomobject]@{
      Name = $Name
      Status = "PASS"
      HttpCode = $statusCode
      Detail = "OK"
    }
  }
  catch {
    $code = 0
    if ($_.Exception.Response) {
      $code = [int]$_.Exception.Response.StatusCode
    }

    return [pscustomobject]@{
      Name = $Name
      Status = "FAIL"
      HttpCode = $code
      Detail = $_.Exception.Message
    }
  }
}

Write-Host "== Front Smoke Test =="
Write-Host "FrontBaseUrl: $FrontBaseUrl"

$results = @()

# 1) Front routes (basic page availability)
$routes = @(
  "/",
  "/auth/sign-in",
  "/front",
  "/front/about",
  "/front/contact",
  "/front/finance",
  "/front/profile"
)

foreach ($route in $routes) {
  $results += Invoke-ApiCheck -Name "Route $route" -Method "GET" -Url "$FrontBaseUrl$route" -ExpectedStatus @(200)
}

# 2) Login through front proxy
$loginPayload = @{
  email = $Email
  password = $Password
}

$loginCheck = Invoke-ApiCheck -Name "API POST /api/auth/login" -Method "POST" -Url "$FrontBaseUrl/api/auth/login" -Body $loginPayload -ExpectedStatus @(200)
$results += $loginCheck

if ($loginCheck.Status -eq "FAIL") {
  $results | Format-Table -AutoSize
  throw "Login failed, cannot continue API smoke checks."
}

$loginResponse = Invoke-RestMethod -Uri "$FrontBaseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body ($loginPayload | ConvertTo-Json)
$token = $loginResponse.accessToken
if (-not $token) {
  $token = $loginResponse.token
}

if (-not $token) {
  $results | Format-Table -AutoSize
  throw "Login response does not contain accessToken/token."
}

$authHeaders = @{ Authorization = "Bearer $token" }

# 3) Protected APIs used by frontend
$results += Invoke-ApiCheck -Name "API GET /api/users/me" -Method "GET" -Url "$FrontBaseUrl/api/users/me" -Headers $authHeaders -ExpectedStatus @(200)
$results += Invoke-ApiCheck -Name "API GET /api/finance/summary" -Method "GET" -Url "$FrontBaseUrl/api/finance/summary" -Headers $authHeaders -ExpectedStatus @(200)
$results += Invoke-ApiCheck -Name "API GET /api/comptes-financiers" -Method "GET" -Url "$FrontBaseUrl/api/comptes-financiers" -Headers $authHeaders -ExpectedStatus @(200)
$results += Invoke-ApiCheck -Name "API GET /api/transactions" -Method "GET" -Url "$FrontBaseUrl/api/transactions" -Headers $authHeaders -ExpectedStatus @(200)
$results += Invoke-ApiCheck -Name "API GET /api/remboursements" -Method "GET" -Url "$FrontBaseUrl/api/remboursements" -Headers $authHeaders -ExpectedStatus @(200)
$results += Invoke-ApiCheck -Name "API GET /api/regles-remboursement" -Method "GET" -Url "$FrontBaseUrl/api/regles-remboursement" -Headers $authHeaders -ExpectedStatus @(200)

# 4) Endpoint variants used by finance-front page
$me = $null
try {
  $me = Invoke-RestMethod -Uri "$FrontBaseUrl/api/users/me" -Method GET -Headers $authHeaders
} catch {
  # Keep smoke test result table as the source of truth.
}

if ($null -ne $me -and $null -ne $me.id) {
  $userId = [int]$me.id
  $results += Invoke-ApiCheck -Name "API GET /api/comptes-financiers/utilisateur/$userId" -Method "GET" -Url "$FrontBaseUrl/api/comptes-financiers/utilisateur/$userId" -Headers $authHeaders -ExpectedStatus @(200,404)
}

$results | Format-Table -AutoSize

$failed = $results | Where-Object { $_.Status -eq "FAIL" }
if ($failed.Count -gt 0) {
  throw "Smoke test finished with $($failed.Count) failed check(s)."
}

Write-Host "All smoke checks passed." -ForegroundColor Green
