$sprintDir = "E:\V3_conecta\Sprint Report"
$brainDir = "C:\Users\Joker\.gemini\antigravity-ide\brain"
$utf8 = [System.Text.Encoding]::UTF8

$walkthroughs = Get-ChildItem -Path $brainDir -Filter "walkthrough.md" -Recurse | Select-String -Pattern "(?i)sprint\s+(\d+)" | ForEach-Object { 
    $sprintNum = [int]$_.Matches[0].Groups[1].Value
    [PSCustomObject]@{ Path = $_.Path; SprintNumber = $sprintNum }
} | Group-Object SprintNumber | ForEach-Object { $_.Group[0] }

$folders = Get-ChildItem -Path $sprintDir -Directory -Filter "Sprint *"
foreach ($folder in $folders) {
    if ($folder.Name -match "Sprint\s*(\d+)") {
        $sprintNumber = [int]$Matches[1]
        if ($sprintNumber -eq 17) { continue }

        $reportPath = Join-Path $folder.FullName "relatorio_sprint_$sprintNumber.md"
        $blueprintPath = Join-Path $folder.FullName "sprint_$($sprintNumber)_blueprint.md"
        $oldBlueprintPath = Join-Path $folder.FullName "blueprint.md"
        
        $content = "# Relatorio Unificado de Encerramento - Sprint $sprintNumber`n`n"
        
        $content += "## 1. Resumo Executivo`n"
        if (Test-Path $reportPath) {
            $content += [System.IO.File]::ReadAllText($reportPath, $utf8) + "`n`n"
        } else {
            $content += "*(Sem relatorio legivel cadastrado)*`n`n"
        }
        
        $content += "## 2. Blueprint (Arquitetura)`n"
        $bpFound = $false
        if (Test-Path $blueprintPath) {
            $content += [System.IO.File]::ReadAllText($blueprintPath, $utf8) + "`n`n"
            $bpFound = $true
        } elseif (Test-Path $oldBlueprintPath) {
            $content += [System.IO.File]::ReadAllText($oldBlueprintPath, $utf8) + "`n`n"
            $bpFound = $true
        } else {
            $content += "*(Sem blueprint tecnico cadastrado)*`n`n"
        }
        
        $content += "## 3. Walkthrough (Log de Validacao)`n"
        $wt = $walkthroughs | Where-Object { $_.SprintNumber -eq $sprintNumber }
        if ($wt) {
            $content += [System.IO.File]::ReadAllText($wt.Path, $utf8) + "`n`n"
        } else {
            $content += "*(Sem walkthrough registrado no ambiente para esta sprint)*`n`n"
        }
        
        $unifiedPath = Join-Path $folder.FullName "relatorio_sprint_$sprintNumber.md"
        [System.IO.File]::WriteAllText($unifiedPath, $content, $utf8)
        
        if ($bpFound) {
            if (Test-Path $blueprintPath) { Remove-Item $blueprintPath -Force }
            if (Test-Path $oldBlueprintPath) { Remove-Item $oldBlueprintPath -Force }
        }
    }
}
