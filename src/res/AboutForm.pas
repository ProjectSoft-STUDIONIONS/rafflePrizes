unit AboutForm;

interface

uses
	Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
	Dialogs, StdCtrls, XPMan, ExtCtrls, Buttons, ActiveX, ShellApi;

type
		TAboutBox = class(TForm)
		XPManifest1: TXPManifest;
		Image1: TImage;
		nameProject: TLabel;
		autorLeft: TLabel;
		autorName: TLabel;
		Label4: TLabel;
		Label5: TLabel;
		Label7: TLabel;
		Label8: TLabel;
		OkButton: TBitBtn;
		Copyright: TLabel;
	private
		{ Private declarations }
	public
		{ Public declarations }
	end;

var
	AboutBox: TAboutBox;

implementation

{$R *.dfm}


end.
