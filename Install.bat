@echo off
powershell "gci . -Recurse | Unblock-File"
powershell "Start-Process -FilePath powershell.exe -ArgumentList '%~fs0\..\InstallerHTML.ps1', '%~fs0\..\HelloFromJS' -verb RunAs -Wait"