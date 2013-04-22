var Mini = new GFGrammar(new GFAbstract("S",{ap: new Type(["Adj", "CN"], "CN"), behind: new Type([], "Prep"), big: new Type([], "Adj"), boy: new Type([], "Noun"), child: new Type([], "Noun"), cl: new Type(["NP", "VP"], "Cl"), cn: new Type(["Noun"], "CN"), decl: new Type(["Cl"], "S"), girl: new Type([], "Noun"), infront: new Type([], "Prep"), kiss: new Type([], "Verb"), np: new Type(["Det", "CN"], "NP"), pl_def: new Type([], "Det"), pl_indef: new Type([], "Det"), pnp: new Type(["NP", "PP"], "NP"), pp: new Type(["Prep", "NP"], "PP"), pvp: new Type(["VP", "PP"], "VP"), que: new Type(["Cl"], "S"), see: new Type([], "Verb"), sg_def: new Type([], "Det"), sg_indef: new Type([], "Det"), small: new Type([], "Adj"), vp: new Type(["Verb", "NP"], "VP")}),{MiniSwe: new GFConcrete({},{0:[new Apply(14,[]), new Apply(48,[])], 1:[new Apply(11,[new PArg(0), new PArg(18)])], 2:[new Apply(18,[new PArg(11)])], 3:[new Apply(12,[new PArg(0), new PArg(19)])], 4:[new Apply(18,[new PArg(12)])], 5:[new Apply(17,[new PArg(10), new PArg(16)])], 6:[new Apply(46,[])], 7:[new Apply(47,[])], 8:[new Apply(39,[])], 9:[new Apply(40,[])], 10:[new Apply(23,[new PArg(6), new PArg(1)]), new Apply(24,[new PArg(7), new PArg(1)]), new Apply(25,[new PArg(8), new PArg(1)]), new Apply(26,[new PArg(9), new PArg(1)]), new Apply(27,[new PArg(6), new PArg(2)]), new Apply(28,[new PArg(7), new PArg(2)]), new Apply(29,[new PArg(8), new PArg(2)]), new Apply(30,[new PArg(9), new PArg(2)]), new Apply(31,[new PArg(6), new PArg(3)]), new Apply(32,[new PArg(7), new PArg(3)]), new Apply(33,[new PArg(8), new PArg(3)]), new Apply(34,[new PArg(9), new PArg(3)]), new Apply(35,[new PArg(6), new PArg(4)]), new Apply(36,[new PArg(7), new PArg(4)]), new Apply(37,[new PArg(8), new PArg(4)]), new Apply(38,[new PArg(9), new PArg(4)]), new Apply(41,[new PArg(10), new PArg(13)])], 11:[new Apply(15,[]), new Apply(20,[])], 12:[new Apply(16,[])], 13:[new Apply(42,[new PArg(14), new PArg(10)])], 14:[new Apply(13,[]), new Apply(21,[])], 15:[new Apply(19,[new PArg(5)]), new Apply(44,[new PArg(5)])], 16:[new Apply(43,[new PArg(16), new PArg(13)]), new Apply(49,[new PArg(17), new PArg(10)])], 17:[new Apply(22,[]), new Apply(45,[])], 18:[new Coerce(1), new Coerce(2)], 19:[new Coerce(3), new Coerce(4)]},[new CncFun("lindef Adj",[0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("lindef CN",[0, 0, 0, 0]), new CncFun("lindef Cl",[0, 0, 0]), new CncFun("lindef Det",[0, 0, 0, 0]), new CncFun("lindef NP",[0]), new CncFun("lindef Noun",[0, 0, 0, 0]), new CncFun("lindef PP",[0]), new CncFun("lindef Prep",[0]), new CncFun("lindef S",[0]), new CncFun("lindef VP",[0, 0]), new CncFun("lindef Verb",[0]), new CncFun("ap",[1, 2, 3, 4]), new CncFun("ap",[5, 6, 7, 8]), new CncFun("behind",[9]), new CncFun("big",[10, 10, 11, 12, 10, 10, 10, 10]), new CncFun("boy",[13, 14, 15, 16]), new CncFun("child",[17, 18, 19, 18]), new CncFun("cl",[20, 21, 22]), new CncFun("cn",[22, 23, 24, 25]), new CncFun("decl",[26]), new CncFun("girl",[27, 28, 29, 30]), new CncFun("infront",[31]), new CncFun("kiss",[32]), new CncFun("np",[1]), new CncFun("np",[33]), new CncFun("np",[34]), new CncFun("np",[35]), new CncFun("np",[36]), new CncFun("np",[2]), new CncFun("np",[37]), new CncFun("np",[38]), new CncFun("np",[5]), new CncFun("np",[39]), new CncFun("np",[40]), new CncFun("np",[41]), new CncFun("np",[42]), new CncFun("np",[6]), new CncFun("np",[43]), new CncFun("np",[44]), new CncFun("pl_def",[45, 45, 46, 46]), new CncFun("pl_indef",[46, 46, 46, 46]), new CncFun("pnp",[1]), new CncFun("pp",[1]), new CncFun("pvp",[1, 23]), new CncFun("que",[47]), new CncFun("see",[48]), new CncFun("sg_def",[49, 50, 46, 46]), new CncFun("sg_indef",[51, 52, 51, 52]), new CncFun("small",[53, 53, 54, 55, 56, 56, 56, 56]), new CncFun("vp",[20, 22])],[[new SymLit(0, 0)],[new SymCat(0, 0), new SymCat(1, 0)],[new SymCat(0, 2), new SymCat(1, 1)],[new SymCat(0, 4), new SymCat(1, 2)],[new SymCat(0, 6), new SymCat(1, 3)],[new SymCat(0, 1), new SymCat(1, 0)],[new SymCat(0, 3), new SymCat(1, 1)],[new SymCat(0, 5), new SymCat(1, 2)],[new SymCat(0, 7), new SymCat(1, 3)],[new SymKS("bakom")],[new SymKS("stora")],[new SymKS("stor")],[new SymKS("stort")],[new SymKS("pojken")],[new SymKS("pojke")],[new SymKS("pojkarna")],[new SymKS("pojkar")],[new SymKS("barnet")],[new SymKS("barn")],[new SymKS("barnen")],[new SymCat(1, 0)],[new SymCat(1, 1)],[new SymCat(0, 0)],[new SymCat(0, 1)],[new SymCat(0, 2)],[new SymCat(0, 3)],[new SymCat(0, 2), new SymCat(0, 1), new SymCat(0, 0), new SymKS(".")],[new SymKS("flickan")],[new SymKS("flicka")],[new SymKS("flickorna")],[new SymKS("flickor")],[new SymKS("framfor")],[new SymKS("kysser")],[new SymCat(0, 0), new SymCat(1, 1)],[new SymCat(0, 0), new SymCat(1, 2)],[new SymCat(0, 0), new SymCat(1, 3)],[new SymCat(0, 2), new SymCat(1, 0)],[new SymCat(0, 2), new SymCat(1, 2)],[new SymCat(0, 2), new SymCat(1, 3)],[new SymCat(0, 1), new SymCat(1, 1)],[new SymCat(0, 1), new SymCat(1, 2)],[new SymCat(0, 1), new SymCat(1, 3)],[new SymCat(0, 3), new SymCat(1, 0)],[new SymCat(0, 3), new SymCat(1, 2)],[new SymCat(0, 3), new SymCat(1, 3)],[new SymKS("de")],[],[new SymCat(0, 1), new SymCat(0, 2), new SymCat(0, 0), new SymKS("?")],[new SymKS("ser")],[new SymKS("den")],[new SymKS("det")],[new SymKS("en")],[new SymKS("ett")],[new SymKS("lilla")],[new SymKS("liten")],[new SymKS("litet")],[new SymKS("sma")]],{Adj:{s: 0, e: 0}, CN:{s: 1, e: 4}, Cl:{s: 5, e: 5}, Det:{s: 6, e: 9}, Float:{s: -3, e: -3}, Int:{s: -2, e: -2}, NP:{s: 10, e: 10}, Noun:{s: 11, e: 12}, PP:{s: 13, e: 13}, Prep:{s: 14, e: 14}, S:{s: 15, e: 15}, String:{s: -1, e: -1}, VP:{s: 16, e: 16}, Verb:{s: 17, e: 17}}, 20)});
