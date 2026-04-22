param(
  [string]$FrontBaseUrl = "http://localhost:62581",
  [string]$Email = "admin@crediguard.local",
  [string]$Password = "Admin123!"
)

$ErrorActionPreference = "Stop"

function Run-Step {
  param(
    [string]$Name,
    [scriptblock]$Action
  )

  try {
    $result = & $Action
    if ($null -eq $result -or ($result -is [string] -and $result.Trim() -eq "")) {
      Write-Output "PASS | $Name"
    } else {
      Write-Output "PASS | $Name | $result"
    }
  }
  catch {
    $detail = $_.Exception.Message
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
      $detail = $_.ErrorDetails.Message
    }

    Write-Output "FAIL | $Name | $detail"
  }
}

$token = $null
$headers = @{}
$newUser = $null
$account = $null
$transaction = $null

Run-Step "Login admin" {
  $login = Invoke-RestMethod -Uri "$FrontBaseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body (@{ email = $Email; password = $Password } | ConvertTo-Json)
  $script:token = if ($login.accessToken) { $login.accessToken } else { $login.token }

  if (-not $script:token) {
    throw "Token missing in login response"
  }

  $script:headers = @{ Authorization = "Bearer $script:token" }
  "token ok"
}

Run-Step "GET /api/users/me" {
  $me = Invoke-RestMethod -Uri "$FrontBaseUrl/api/users/me" -Method GET -Headers $script:headers
  "id=$($me.id)"
}

Run-Step "POST /api/users" {
  $rnd = Get-Random
  $body = @{
    fullName = "Scenario User $rnd"
    email = "scenario.$rnd@mail.com"
    password = "123456"
    phone = "12345678"
    userType = "Beneficiary"
    enabled = $true
  }
  $script:newUser = Invoke-RestMethod -Uri "$FrontBaseUrl/api/users" -Method POST -Headers $script:headers -ContentType "application/json" -Body ($body | ConvertTo-Json)
  "userId=$($script:newUser.id)"
}

Run-Step "POST /api/comptes-financiers" {
  $body = @{
    solde = 1500
    typeCompte = "BENEFICIAIRE"
    utilisateurId = [int64]$script:newUser.id
  }
  $script:account = Invoke-RestMethod -Uri "$FrontBaseUrl/api/comptes-financiers" -Method POST -Headers $script:headers -ContentType "application/json" -Body ($body | ConvertTo-Json)
  "accountId=$($script:account.idCompte)"
}

Run-Step "POST /api/transactions" {
  $body = @{
    typeTransaction = "VENTE"
    montant = 100
    compteSourceId = [int64]$script:account.idCompte
    compteDestinationId = [int64]$script:account.idCompte
    orderId = [int64](Get-Random)
  }

  $script:transaction = Invoke-RestMethod -Uri "$FrontBaseUrl/api/transactions" -Method POST -Headers $script:headers -ContentType "application/json" -Body ($body | ConvertTo-Json)
  "txId=$($script:transaction.idTransaction)"
}

Run-Step "GET /api/transactions/{id}" {
  $tx = Invoke-RestMethod -Uri "$FrontBaseUrl/api/transactions/$($script:transaction.idTransaction)" -Method GET -Headers $script:headers
  "txId=$($tx.idTransaction)"
}

Run-Step "PUT+GET /api/comptes-financiers/{id}" {
  $updateBody = @{
    solde = 2222
    typeCompte = "BENEFICIAIRE"
    utilisateurId = [int64]$script:newUser.id
  }

  Invoke-RestMethod -Uri "$FrontBaseUrl/api/comptes-financiers/$($script:account.idCompte)" -Method PUT -Headers $script:headers -ContentType "application/json" -Body ($updateBody | ConvertTo-Json) | Out-Null
  $updated = Invoke-RestMethod -Uri "$FrontBaseUrl/api/comptes-financiers/$($script:account.idCompte)" -Method GET -Headers $script:headers
  "solde=$($updated.solde)"
}

Run-Step "POST /api/remboursements (creditId=1)" {
  $body = @{
    montant = 10
    mode = "automatique"
    creditId = 1
  }
  $r = Invoke-RestMethod -Uri "$FrontBaseUrl/api/remboursements" -Method POST -Headers $script:headers -ContentType "application/json" -Body ($body | ConvertTo-Json)
  "id=$($r.idRemboursement)"
}

Run-Step "POST /api/regles-remboursement (creditId=1)" {
  $body = @{
    typeRegle = "POURCENTAGE_SUR_VENTE"
    valeur = 5
    creditId = 1
  }
  $r = Invoke-RestMethod -Uri "$FrontBaseUrl/api/regles-remboursement" -Method POST -Headers $script:headers -ContentType "application/json" -Body ($body | ConvertTo-Json)
  "id=$($r.idRegle)"
}

Run-Step "DELETE /api/comptes-financiers/{id}" {
  Invoke-RestMethod -Uri "$FrontBaseUrl/api/comptes-financiers/$($script:account.idCompte)" -Method DELETE -Headers $script:headers | Out-Null
  "deleted"
}
