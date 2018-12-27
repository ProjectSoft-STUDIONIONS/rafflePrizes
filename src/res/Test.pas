unit Test;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, XPMan;

type
  TForm1 = class(TForm)
    Button1: TButton;
    XPManifest1: TXPManifest;
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}
function ShowAbout(Msg: PAnsiChar):Boolean; stdcall; external 'RafflePrizes.dll'

procedure TForm1.Button1Click(Sender: TObject);
var
    str: PAnsiChar;
begin
   ShowAbout(PChar(FormatDateTime('yyyy', Date)));
end;

end.
