library RafflePrizes;

uses
  Windows,
  Messages,
  SysUtils,
  Variants,
  Classes,
  Graphics,
  Controls,
  Forms,
  Dialogs,
  StdCtrls,
  XPMan,
  ExtCtrls,
  Buttons,
  AboutForm in 'AboutForm.pas' {AboutBox};

{$R *.res}

function ShowAbout(Msg: PAnsiChar):Boolean stdcall;
var
    aboutBox: TAboutBox;
begin

    aboutBox := AboutForm.TAboutBox.Create(Application);
    aboutBox.Caption := 'О программе';
    aboutBox.nameProject.Caption :=  aboutBox.nameProject.Caption + ' v' + StrPas(Msg);
    aboutBox.Copyright.Caption := 'Copyright © 2009 - ' +  FormatDateTime('yyyy', Date) + ', ProjectSoft';
    Result := (aboutBox.ShowModal = mrOk);
    aboutBox.Free;
end;

exports ShowAbout;

begin
end.




