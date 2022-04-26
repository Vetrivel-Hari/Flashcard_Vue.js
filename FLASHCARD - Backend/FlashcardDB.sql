CREATE TABLE "uDetails" (
	"uID" INTEGER,
	"fName" TEXT NOT NULL,
	"pwd" TEXT NOT NULL,
	"enKey" TEXT NOT NULL,
	"lastVisited" TEXT NOT NULL,

	PRIMARY KEY("uID")
);

CREATE TABLE "uName" (
	"uID" INTEGER,
	"username" TEXT NOT NULL UNIQUE,

	PRIMARY KEY("uID"),
	FOREIGN KEY("uID") REFERENCES "uDetails"("uID") ON DELETE CASCADE
);

CREATE TABLE "uEmail" (
	"uID" INTEGER,
	"email" TEXT NOT NULL UNIQUE,

	PRIMARY KEY("uID"),
	FOREIGN KEY("uID") REFERENCES "uDetails"("uID") ON DELETE CASCADE
);

CREATE TABLE "uDeck" (
	"uID" INTEGER,
	"dID" INTEGER UNIQUE,
	"dName" TEXT NOT NULL,

	PRIMARY KEY("uID", "dID"),
	FOREIGN KEY("uID") REFERENCES "uDetails"("uID") ON DELETE CASCADE
);

CREATE TABLE "qDeck" (
	"qID" INTEGER,
	"dID" INTEGER NOT NULL,

	PRIMARY KEY("qID"),
	FOREIGN KEY("dID") REFERENCES "uDeck"("dID") ON DELETE CASCADE
);

CREATE TABLE "questionAnswer" (
	"qID" INTEGER,
	"question" TEXT NOT NULL,
	"answer" TEXT NOT NULL,
	
	PRIMARY KEY("qID"),
	FOREIGN KEY("qID") REFERENCES "qDeck"("qID") ON DELETE CASCADE
);

CREATE TABLE "qStat" (
	"qID" INTEGER,
	"easy" INTEGER NOT NULL,
	"medium" INTEGER NOT NULL,
	"hard" INTEGER NOT NULL,
	"attempts" INTEGER NOT NULL,
	
	PRIMARY KEY("qID"),
	FOREIGN KEY("qID") REFERENCES "qDeck"("qID") ON DELETE CASCADE
);


select * from uDetails;
select * from uName;
select * from uEmail;
select * from uDeck;
select * from qDeck;
select * from questionAnswer;
select * from qStat;


delete from uDetails;
delete from uName;
delete from uEmail;
delete from uDeck;
delete from qDeck;
delete from questionAnswer;
delete from qStat;