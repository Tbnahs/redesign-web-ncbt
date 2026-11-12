param([Parameter(Mandatory=$true)][string]$Manifest,[Parameter(Mandatory=$true)][string]$Results)
$ErrorActionPreference = 'Stop'
$entries = Get-Content -Raw -Encoding UTF8 -LiteralPath $Manifest | ConvertFrom-Json
Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
public class NbcDownloadResult {
 public string Url; public string File; public bool Success; public bool Cached; public int Bytes; public string Error;
}
public class NbcClient : WebClient {
 protected override WebRequest GetWebRequest(Uri u) {
  WebRequest r=base.GetWebRequest(u); r.Timeout=25000;
  HttpWebRequest h=r as HttpWebRequest;
  if(h!=null) {h.ReadWriteTimeout=25000;h.AutomaticDecompression=DecompressionMethods.GZip|DecompressionMethods.Deflate;}
  return r;
 }
}
public static class NbcDownloader {
 public static NbcDownloadResult[] Get(string[] urls,string[] paths) {
  ServicePointManager.SecurityProtocol=SecurityProtocolType.Tls12;
  ServicePointManager.DefaultConnectionLimit=8;
  NbcDownloadResult[] output=new NbcDownloadResult[urls.Length];
  Parallel.For(0,urls.Length,new ParallelOptions{MaxDegreeOfParallelism=4},i=>{
   NbcDownloadResult result=new NbcDownloadResult{Url=urls[i],File=paths[i]};
   output[i]=result;
   if(File.Exists(paths[i])&&new FileInfo(paths[i]).Length>0) {result.Success=true;result.Cached=true;result.Bytes=(int)new FileInfo(paths[i]).Length;return;}
   for(int attempt=0;attempt<2;attempt++) {
    try {
     Uri u=new Uri(urls[i]);if(u.Scheme!="https"&&u.Scheme!="http")throw new Exception("Unsupported URL scheme");
     using(NbcClient c=new NbcClient()) {
      c.Headers[HttpRequestHeader.UserAgent]="Mozilla/5.0 (compatible; NBC site migration preview)";
      byte[] bytes=c.DownloadData(u);Directory.CreateDirectory(Path.GetDirectoryName(paths[i]));File.WriteAllBytes(paths[i],bytes);
      result.Success=true;result.Bytes=bytes.Length;result.Error=null;return;
     }
    }catch(Exception ex){result.Error=ex.Message;System.Threading.Thread.Sleep(250);}
   }
  });
  return output;
 }
}
'@
$root = [IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent)) + '\'
$urls = @(); $paths = @()
foreach ($entry in $entries) {
 $path = [IO.Path]::GetFullPath([string]$entry.File)
 if (-not $path.StartsWith($root,[StringComparison]::OrdinalIgnoreCase)) { throw 'Download path outside project' }
 $urls += [string]$entry.Url; $paths += $path
}
$downloaded = [NbcDownloader]::Get([string[]]$urls,[string[]]$paths)
$json = ConvertTo-Json -InputObject @($downloaded) -Depth 4
[IO.File]::WriteAllText($Results,$json,[Text.UTF8Encoding]::new($false))
Write-Output ('Downloads: '+$downloaded.Count+'; success: '+@($downloaded | Where-Object Success).Count)
