#define AppName 'Генератор розыгрыша призов'
#define AppVersion '1.6'
#define AppCopyright 'Copyright © 2008 all right reserved ProjectSoft'
#define InstallText 'Удалить'
#define GitHub 'https://github.com/ProjectSoft-STUDIONIONS/rafflePrizes'
#define DirName 'RafflePrizes'      
#define AppNameDir 'raffleprizes'

[Setup]
AppId={{978368E4-609F-43B5-A1BD-83155DA2D998}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppVersion}
AppCopyright={#AppCopyright}
AppMutex={#AppName}
AppPublisher=ProjectSoft
AppPublisherURL=http://projectsoft.ru/
AppSupportURL=http://projectsoft.ru/
AppContact=projectsoft2009@yandex.ru
AppComments={#AppName}
; AppUpdatesURL={#GitReleace}

VersionInfoVersion={#AppVersion}
VersionInfoCompany=ProjectSoft
VersionInfoDescription={#AppName}. {#AppCopyright}
VersionInfoTextVersion={#AppVersion}
VersionInfoCopyright={#AppCopyright}
VersionInfoProductName={#AppName}
VersionInfoProductVersion={#AppVersion}
VersionInfoProductTextVersion={#AppName} v{#AppVersion}

DefaultDirName={userappdata}\{#DirName}
DefaultGroupName={#AppName}

Compression=lzma/ultra
SolidCompression=false
InternalCompressLevel=ultra

OutputDir=installer
OutputBaseFilename=RafflePrizesSetup_win64
SetupIconFile=project/favicon.ico
WizardImageFile=src/embed/wizard.bmp
WizardSmallImageFile=src/embed/logo.bmp


UninstallDisplayName={#InstallText} {#AppName}
UninstallDisplayIcon={uninstallexe}

DisableWelcomePage=False
DisableReadyPage=true
DisableReadyMemo=true
DisableFinishedPage=false
FlatComponentsList=false
AlwaysShowComponentsList=false
ShowComponentSizes=false
WindowShowCaption=false
WindowResizable=false
UsePreviousAppDir=false
UsePreviousGroup=false
AppendDefaultDirName=false

BackSolid=true
WindowStartMaximized=false
DisableProgramGroupPage=true
DisableDirPage=true
ShowLanguageDialog=no

ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

PrivilegesRequired=lowest

[Languages]
Name: russian; MessagesFile: "compiler:Languages\Russian.isl,src\lang.isl"

[Messages]
AboutSetupMenuItem=&© ProjectSoft

[Icons]
Name: {group}\{#AppName}; Filename: {app}\raffleprizes.exe; WorkingDir: {app}; IconFilename: {app}\favicon.ico
Name: {group}\Удалить; Filename: {uninstallexe}

[Dirs]
Name: {app}\locales
Name: {app}\pnacl
Name: {app}\swiftshader   
Name: {app}\assets
Name: {app}\module    
Name: {app}\node_modules

[UninstallDelete]
Name: {app}\; Type: filesandordirs

[Files]
Source: InnoCallback.dll; Flags: dontcopy
Source: ".nwjs\raffleprizes\win64\*"; DestDir: "{app}\"; BeforeInstall: AddToMemo; Flags: ignoreversion recursesubdirs createallsubdirs
#include AddBackslash(SourcePath) + "prepocessor.iss"
#emit ProcessScanDir('.nwjs\raffleprizes\win64', '{app}', 'solidbreak ', False, 'AddToMemo')

#expr SaveToFile (AddBackslash (SourcePath) + ".install_win64.iss")

[code]
type
	TTimerProc = procedure(HandleW, Msg, idEvent, TimeSys: LongWord);
 
var
	PercentsTimer: LongWord;
	PercentsLabel: TLabel;
  FilesMemo: TNewMemo;
 
function WrapTimerProc(callback: TTimerProc; Paramcount: Integer): longword; external 'wrapcallback@files:innocallback.dll stdcall';
function SetTimer(hWnd, nIDEvent, uElapse, lpTimerFunc: LongWord): longword; external 'SetTimer@user32';
function KillTimer(hWnd, nIDEvent: LongWord): LongWord; external 'KillTimer@user32 stdcall delayload';
 
Function NumToStr(Float: Extended): String;
Begin
	Result:= Format('%.1n', [Float]); StringChange(Result, ',', '.');
	while ((Result[Length(Result)] = '0') or (Result[Length(Result)] = '.')) and (Pos('.', Result) > 0) do
		SetLength(Result, Length(Result)-1);
End;
 
Procedure PercentsProc(h, msg, idevent, dwTime: Longword);
Begin
	with WizardForm.ProgressGauge do
	begin
		PercentsLabel.Caption:= 'Выполнено ' + NumToStr((Position*100)/Max) + ' %';
	end;
End;
 
procedure DeinitializeSetup();
begin
	KillTimer(0, PercentsTimer);
end;
 
procedure AddToMemo();
var
	AFile: String;
begin
	AFile := ExpandConstant(CurrentFilename);
	if ExtractFileExt(AFile) = '' then
		FilesMemo.Lines.Add('CreateFolder: ' + RemoveBackslash(AFile))
	else
		FilesMemo.Lines.Add('Extract: ' + AFile);
end;
 
procedure InitializeWizard();
begin 
	FilesMemo := TNewMemo.Create(WizardForm);
	FilesMemo.SetBounds(ScaleX(0), ScaleY(80), ScaleX(418), ScaleY(120));
	FilesMemo.WordWrap := False;
	FilesMemo.Parent := WizardForm.InstallingPage;
	FilesMemo.ScrollBars := ssVertical;
	FilesMemo.ReadOnly := True;
	FilesMemo.Clear;
	FilesMemo.Color := clBlack;
	FilesMemo.Font.Color := clLime;
	PercentsLabel:= TLabel.Create(WizardForm);
	with PercentsLabel do
	begin
		Left:= WizardForm.ProgressGauge.Left;
		Top:= WizardForm.ProgressGauge.Top + WizardForm.ProgressGauge.Height + ScaleY(3);
		Width:= WizardForm.StatusLabel.Width;
		Height:= WizardForm.StatusLabel.Height;
		AutoSize:= False;
		Transparent := True;
		Parent:= WizardForm.InstallingPage;
	end;
end;
 
procedure CurStepChanged(CurStep: TSetupStep);
begin
	if CurStep = ssInstall then
	begin
		PercentsTimer:= SetTimer(0, 0, 100, WrapTimerProc(@PercentsProc, 4));
	end;
end;
