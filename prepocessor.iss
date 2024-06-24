#pragma parseroption -p-
#define FileEntry(Source, DestDir, Check, Flags, BeforeInstall) \
	"Source: \"" + Source + "\"; DestDir: " + DestDir + "\; " + \
	(BeforeInstall ? "BeforeInstall: " + BeforeInstall + "; " : "") + \
	(Flags ? "Flags: " + Flags + "; " : "") + \
	(Check ? "Check: " + Check : "") + "\n"
#define ProcessFile(Source, DestDir, FindResult, FindHandle, Flags, Check, BeforeInstall) \
	FindResult \
		? \
			Local[0] = FindGetFileName(FindHandle), \
			Local[1] = Source + "\\" + Local[0], \
			(Local[0] != "." && Local[0] != ".." \
				? (DirExists(Local[1]) \
					? ProcessFolder(Local[1], DestDir + "\\" + Local[0], Flags, Check, BeforeInstall) \
					: FileEntry(Local[1], DestDir, Check, Flags, BeforeInstall)) \
				: "") + ProcessFile(Source, DestDir, FindNext(FindHandle), FindHandle, Flags, Check, BeforeInstall) : ""
#define ProcessFolder(Source, DestDir, Flags, Check, BeforeInstall) \
	Local[0] = FindFirst(Source + "\\*", faAnyFile), \
	ProcessFile(Source, DestDir, Local[0], Local[0], Flags, Check, BeforeInstall)
#define ScanDirProcess(Source, DestDir, FindResult, FindHandle, Flags, Check, BeforeInstall) \
	FindResult \
		? \
			Local[0] = FindGetFileName(FindHandle), \
			Local[1] = Source + "\\" + Local[0], \
			(Local[0] != "." && Local[0] != ".." \
				? (DirExists(Local[1]) \
					? "" \
					: FileEntry(Local[1], DestDir, Check, Flags, BeforeInstall)) \
				: "") + ScanDirProcess(Source, DestDir, FindNext(FindHandle), FindHandle, Flags, Check, BeforeInstall) \
		: ""
#define ProcessScanDir(Source, DestDir, Flags, Check, BeforeInstall) \
	Local[0] = FindFirst(Source + "\\*", faAnyFile), \
	ScanDirProcess(Source, DestDir, Local[0], Local[0], Flags, Check, BeforeInstall)
#pragma parseroption -p+