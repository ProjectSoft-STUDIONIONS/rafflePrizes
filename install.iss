#define AppName 'Генератор розыгрыша призов'
#define AppVersion '1.5'
#define AppCopyright 'Copyright © 2010 all right reserved ProjectSoft && STUDIONIONS'
#define InstallText 'Удалить'
#define GitHub 'https://github.com/ProjectSoft-STUDIONIONS/rafflePrizes'
#define DirName 'RafflePrizes'
[Setup]
AppId={{E71B86C4-BF18-420C-89E2-68F1546C59B7}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppVersion}
AppCopyright={#AppCopyright}
AppMutex={#AppName}
AppPublisher=ProjectSoft && STUDIONIONS
AppPublisherURL=http://studionions.ru/
AppSupportURL=http://studionions.ru/
AppContact=projectsoft2009@yandex.ru
AppComments={#AppName}
; AppUpdatesURL={#GitReleace}

VersionInfoVersion={#AppVersion}
VersionInfoCompany=ProjectSoft && STUDIONIONS
VersionInfoDescription={#AppName}. {#AppCopyright}
VersionInfoTextVersion={#AppVersion}
VersionInfoCopyright={#AppCopyright}
VersionInfoProductName={#AppName}
VersionInfoProductVersion={#AppVersion}
VersionInfoProductTextVersion={#AppName} v{#AppVersion}

DefaultDirName={pf}\{#DirName}
DefaultGroupName={#AppName}

Compression=lzma/ultra
SolidCompression=false
InternalCompressLevel=ultra

OutputDir=installer
OutputBaseFilename=RafflePrizesSetup
SetupIconFile=src/embed/favicon.ico
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

; ArchitecturesInstallIn64BitMode=x64 запрашивает, чтобы установка была выполнена
; в 64-битном режиме. Это означает, что она должна использовать собственный
; каталог 64-битных программных файлов и 64-битное представление реестра.
; А во всех остальных архитектурах он будет установлен в 32-битном режиме.
; Примечание: мы не устанавливаем ProcessorsAllowed, потому что мы хотим,
; чтобы эта установка работала на всех архитектурах.
ArchitecturesInstallIn64BitMode=x64


[Languages]
Name: russian; MessagesFile: compiler:Languages\Russian.isl

[Messages]
AboutSetupMenuItem=&© ProjectSoft 2018
[Icons]
;Name: {group}\{#AppName}; Filename: {app}\raffleprizes.exe
;Name: {group}\Удалить {#AppName}; Filename: {uninstallexe}

[Dirs]
Name: {app}\locales
Name: {app}\pnacl
Name: {app}\swiftshader

[UninstallDelete]
Name: {app}\; Type: filesandordirs

[Files]
#include AddBackslash(SourcePath) + "parseroption.iss"
; Source: dlls\InnoCallback.dll; DestDir: {tmp}; Flags: dontcopy
Source: src\dlls\CallbackCtrl.dll; DestDir: {tmp}; Flags: dontcopy
Source: src\res\RafflePrizes.dll; DestDir: {tmp}; Flags: dontcopy
#emit ProcessFolder('src\embed', '{app}', False, 'Is64BitInstallMode')
#emit ProcessFolder('src\embed', '{app}', 'solidbreak', 'not Is64BitInstallMode')

[Code]
#define A = (Defined UNICODE) ? "W" : "A"
type
	TWFProc = function(h:hWnd;Msg,wParam,lParam:Longint):Longint;

function CallWindowProc(lpPrevWndFunc: Longint; hWnd: HWND; Msg: UINT; wParam: Longint; lParam: Longint): Longint; external 'CallWindowProcA@user32.dll stdcall';
function SetWindowLong(Wnd: HWnd; Index: Integer; NewLong: Longint): Longint; external 'SetWindowLongA@user32.dll stdcall';
function WrapWFProc(Callback: TWFProc; ParamCount: Integer): Longword; external 'wrapcallbackaddr@files:CallbackCtrl.dll stdcall';
function ShowAbout(Msg: PAnsiChar): Boolean; external 'ShowAbout@files:RafflePrizes.dll stdcall';


var
	OldProc:Longint;
	OptionPage: TInputOptionWizardPage;

procedure ShowAboutDlg(Sender: TObject);
begin
	ShowAbout(ExpandConstant(ExpandConstant('{#AppVersion}')));
end;

function WFWndProc(h:HWND;Msg,wParam,lParam:Longint):Longint;
begin
	if (Msg=$112) and (wParam=9999) then
	begin
		Result:=0;
		ShowAbout(ExpandConstant('{#AppVersion}'));
	end
	else
	begin
		if Msg=$2 then
			SetWindowLong(WizardForm.Handle,-4,OldProc);
		Result:=CallWindowProc(OldProc,h,Msg,wParam,lParam);
	end;
end;

procedure InitializeWizard;
begin
	OldProc:=SetWindowLong(WizardForm.Handle,-4,WrapWFProc(@WFWndProc,4));
	OptionPage := CreateInputOptionPage(
		wpWelcome,
		'Выберите параметры установки',
		'Для кого должно быть установлено приложение?',
		'Пожалуйста, выберите, хотите ли вы установить «' + ExpandConstant('{#AppName}') + '» для всех пользователей или только для себя.',
		True,
		False
	);
	OptionPage.Add('&Установить для всех пользователей');
	OptionPage.Add('&Установить только для меня');

	if IsAdminLoggedOn then
	begin
		OptionPage.Values[0] := True;
	end
	else
	begin
		OptionPage.Values[1] := True;
		OptionPage.CheckListBox.ItemEnabled[0] := False;
	end;
	with TNewButton.Create(WizardForm) do
	begin
		Parent := WizardForm.NextButton.Parent;
		Top := WizardForm.NextButton.Top;
		Width := WizardForm.NextButton.Width + ScaleX(16);
		Caption := '&О программе';
		Left := ScaleX(8);
		onClick := @ShowAboutDlg;
	end;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
	if CurPageID = OptionPage.ID then
	begin
		if OptionPage.Values[1] then
		begin
			WizardForm.DirEdit.Text := ExpandConstant('{userappdata}\{#DirName}')
		end
		else
		begin
			WizardForm.DirEdit.Text := ExpandConstant('{pf}\{#DirName}');
		end;
	end;
	Result := True;
end;
#expr SaveToFile (AddBackslash (SourcePath) + ".install.iss")
