Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$src = (Resolve-Path 'tmp_docx_edit').Path
$dst = Join-Path (Resolve-Path 'MEMOIRE').Path 'Memoire_EduTrack_L3_corrige.docx'
Remove-Item -LiteralPath $dst -Force -ErrorAction SilentlyContinue
$zip = [System.IO.Compression.ZipFile]::Open($dst, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -LiteralPath $src -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($src.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
}
finally {
  $zip.Dispose()
}
