param(
  [string]$FrontBaseUrl = "http://localhost:62581",
  [string]$Email = "admin@crediguard.local",
  [string]$Password = "Admin123!",
  [int]$CreditId = 1
)

$ErrorActionPreference = "Stop"

function Print-ApiResult {
  param(
    [string]$Name,
    [scriptblock]$Action
  )

  try {
    $result = & $Action
    Write-Output "PASS | $Name"
    if ($null -ne $result) {
      if ($result -is [string]) {
        Write-Output $result
      } else {
        $result | ConvertTo-Json -Depth 8
      }
    }
  }
  catch {
    Write-Output "FAIL | $Name"

    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      Write-Output "STATUS=$statusCode"

      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        if ($body) {
          Write-Output $body
        }
      } catch {}
    } else {
      Write-Output $_.Exception.Message
    }
  }
}

$login = Invoke-RestMethod -Uri "$FrontBaseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body (@{ email = $Email; password = $Password } | ConvertTo-Json)
$token = if ($login.accessToken) { $login.accessToken } else { $login.token }
if (-not $token) {
  throw "Login response has no token"
}

$headers = @{ Authorization = "Bearer $token" }

Print-ApiResult -Name "GET /api/remboursements/credit/$CreditId" -Action {
  Invoke-RestMethod -Uri "$FrontBaseUrl/api/remboursements/credit/$CreditId" -Method GET -Headers $headers
}

Print-ApiResult -Name "GET /api/regles-remboursement/credit/$CreditId" -Action {
  Invoke-RestMethod -Uri "$FrontBaseUrl/api/regles-remboursement/credit/$CreditId" -Method GET -Headers $headers
}

Print-ApiResult -Name "POST /api/remboursements" -Action {
  Invoke-RestMethod -Uri "$FrontBaseUrl/api/remboursements" -Method POST -Headers $headers -ContentType "application/json" -Body (@{ montant = 20; mode = "automatique"; creditId = $CreditId } | ConvertTo-Json)
}

Print-ApiResult -Name "POST /api/regles-remboursement" -Action {
  Invoke-RestMethod -Uri "$FrontBaseUrl/api/regles-remboursement" -Method POST -Headers $headers -ContentType "application/json" -Body (@{ typeRegle = "POURCENTAGE_SUR_VENTE"; valeur = 2; creditId = $CreditId } | ConvertTo-Json)
}
