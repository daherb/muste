var Utilities;
(function (Utilities) {
    // String utilities
    function common_prefix(sequences) {
        if (!sequences.length) {
            return [];
        }
        var minlen = Math.min.apply(this, sequences.map(function (seq) { return seq.length; }));
        for (var i = 0; i < minlen; i++) {
            var value = sequences[0][i];
            for (var seq = 1; seq < sequences.length; seq++) {
                if (sequences[seq][i] != value) {
                    return sequences[seq].slice(0, i);
                }
            }
        }
        return sequences[0].slice(0, minlen);
    }
    Utilities.common_prefix = common_prefix;
    // export function commonPrefix(s1 : string, s2 : string) : string {
    //     var len = Math.min(s1.length, s2.length);
    //     for (var i=0; i < len; i++) {
    //         if (s1[i] !== s2[i])
    //             return s1.slice(0,i);
    //     }
    //     return s1.slice(0,len);
    // }
    // List utilities
    function join() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Array.prototype.slice.apply(args).join('-');
    }
    Utilities.join = join;
    function split(s) {
        return s.split('-');
    }
    Utilities.split = split;
    function array_cmp(a, b) {
        if (a instanceof Array) {
            if (b instanceof Array) {
                var alen = a.length, blen = b.length;
                if (alen < blen)
                    return -1;
                if (alen > blen)
                    return 1;
                for (var i = 0; i < alen; i++) {
                    var cmp = array_cmp(a[i], b[i]);
                    if (cmp)
                        return cmp;
                }
                return 0;
            }
            else {
                return 1;
            }
        }
        else if (b instanceof Array) {
            return -1;
        }
        else {
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
        }
    }
    Utilities.array_cmp = array_cmp;
    function array_eq(a, b) {
        if (a instanceof Array) {
            if (b instanceof Array) {
                var alen = a.length, blen = b.length;
                if (alen !== blen)
                    return false;
                for (var i = 0; i < alen; i++) {
                    var eq = array_eq(a[i], b[i]);
                    if (!eq)
                        return eq;
                }
                return true;
            }
            else {
                return false;
            }
        }
        else if (b instanceof Array) {
            return false;
        }
        else {
            return a == b;
        }
    }
    Utilities.array_eq = array_eq;
    function flatten(obj) {
        if (obj instanceof Array) {
            var list = [];
            for (var i = 0; i < obj.length; i++) {
                list.push.apply(list, flatten(obj[i]));
            }
            return list;
        }
        else {
            return [obj];
        }
    }
    Utilities.flatten = flatten;
    // Converting a list of strings into a string, so that the original list can be retrieved
    function ishash(hash) {
        return (typeof (hash) == "string" && /^\{\[\"[0-9]/.test(hash));
    }
    Utilities.ishash = ishash;
    function hash(args) {
        return JSON.stringify(args);
    }
    Utilities.hash = hash;
    function unhash(hash) {
        return JSON.parse(hash);
    }
    Utilities.unhash = unhash;
    // Timing
    var TIMERS = {};
    function START_TIMER(n, fresh) {
        if (fresh) {
            if (TIMERS[n]) {
                if (TIMERS[n] < -100)
                    STOP_TIMER(n);
                var i = 1;
                while (TIMERS[n + "." + i])
                    i++;
                TIMERS[n + "." + i] = TIMERS[n];
            }
            TIMERS[n] = -Date.now();
        }
        else {
            if (!TIMERS[n])
                TIMERS[n] = 0;
            TIMERS[n] -= Date.now();
        }
    }
    Utilities.START_TIMER = START_TIMER;
    function GET_TIMER(n) {
        return TIMERS[n] + Date.now();
    }
    Utilities.GET_TIMER = GET_TIMER;
    function STOP_TIMER(n) {
        TIMERS[n] += Date.now();
    }
    Utilities.STOP_TIMER = STOP_TIMER;
    function LOG_TIMERS() {
        var out = [];
        for (var key in TIMERS) {
            out.push(key + ": " + Math.round(TIMERS[key] / 100) / 10);
        }
        out.sort();
        console.log("TIMERS", out.join(", "));
        TIMERS = {};
    }
    Utilities.LOG_TIMERS = LOG_TIMERS;
    function getTime() {
        return Date.now();
    }
    Utilities.getTime = getTime;
    function showTime(start) {
        return (getTime() - start).toFixed(1) + " ms";
    }
    Utilities.showTime = showTime;
    // Pretty-printing
    function strObject(obj) {
        var result = [];
        if (obj == null) {
            return "" + obj;
        }
        else if (obj instanceof Array) {
            obj.forEach(function (o) {
                result.push(strObject(o));
            });
            // result = obj.map(function(o){
            //     return strObject(o);
            // });
            return "[" + result.join(", ") + "]";
        }
        else if (obj instanceof Object) {
            for (var key in obj) {
                result.push(key + ": " + strObject(obj[key]));
            }
            return "{" + result.join(", ") + "}";
        }
        else if (typeof obj == "string") {
            return '"' + obj + '"';
        }
        else {
            return "" + obj;
        }
    }
    Utilities.strObject = strObject;
    // Busy indicator
    var BUSY_DELAY = 50;
    var BUSY_STR = "\u25CF";
    // Unicode Character 'BLACK CIRCLE' (U+25CF)
    function BUSY(f) {
        return function () {
            var obj = this; // $(this);
            push_busy();
            setTimeout(function () {
                f(obj);
                pop_busy();
                LOG_TIMERS();
            }, BUSY_DELAY);
        };
    }
    Utilities.BUSY = BUSY;
    function push_busy() {
        var ind = document.getElementById('busy-indicator');
        ind.className = ind.className + BUSY_STR;
        ind.textContent += BUSY_STR;
    }
    Utilities.push_busy = push_busy;
    function pop_busy() {
        var ind = document.getElementById('busy-indicator');
        if (ind.className.slice(-BUSY_STR.length) === BUSY_STR) {
            ind.className = ind.className.slice(0, -BUSY_STR.length);
            ind.textContent = ind.textContent.slice(0, -BUSY_STR.length);
        }
        else {
            console.log("POP ERROR", ind.className, ind.textContent);
        }
    }
    Utilities.pop_busy = pop_busy;
    // Error handling
    function alertError(title, description) {
        alert("*** " + title + "***\n" + description);
    }
    Utilities.alertError = alertError;
})(Utilities || (Utilities = {}));
///<reference path="Utilities.ts"/>
/*
   GF.js, by Peter Ljunglöf
   This file must be loaded BEFORE the GF grammar is loaded!
*/
var GFGrammar = (function () {
    function GFGrammar(abs, cncs) {
        this.abs = abs;
        this.cncs = cncs;
        for (var lang in cncs) {
            this.cncs[lang].abs = abs;
        }
    }
    /** GFGrammar.linearise(tree):
        @param language: a String denoting which concrete syntax to use
        @param tree: a GFTree object
        @return: an Array of {word:String, path:String}
    **/
    GFGrammar.prototype.linearise = function (language, tree) {
        return this.cncs[language].linearise(tree);
    };
    return GFGrammar;
}());
var GFAbstract = (function () {
    function GFAbstract(startcat, types) {
        this.startcat = startcat;
        this.types = types;
        this.cat2funs = {};
        for (var fun in types) {
            var cat = types[fun].abscat;
            if (!this.cat2funs[cat]) {
                this.cat2funs[cat] = [];
            }
            this.cat2funs[cat].push(fun);
        }
        this.typing2funs = {};
        for (var fun in types) {
            var typ = types[fun].abscat;
            var hashargs = Utilities.hash(types[fun].children);
            if (!this.typing2funs[typ])
                this.typing2funs[typ] = {};
            if (!this.typing2funs[typ][hashargs])
                this.typing2funs[typ][hashargs] = [];
            this.typing2funs[typ][hashargs].push(fun);
        }
    }
    /** GFAbstract.typecheck(tree):
        Throws a TypeError if the tree is not type correct.
        If the tree lacks type information, the types are output to the console.
        @param tree: a GFTree object
    **/
    GFAbstract.prototype.typecheck = function (tree, ntype) {
        var ftype = this.types[tree.node];
        if (!ftype) {
            throw (new TypeError("Function not found: " + tree.node));
        }
        if (ntype && ntype != ftype.abscat) {
            throw (new TypeError("Function type mismatch: " + tree.node + ":" + ntype +
                " (should be " + ftype.abscat + ")"));
        }
        // if (tree.type && tree.type != ftype.abscat) {
        //     throw(new TypeError("Function type mismatch: " + tree.node + ":" + tree.type + 
        //                         " (should be " + ftype.abscat + ")"));
        // {
        // if (!tree.type) {
        //     console.log("Missing type of function " + tree.node + " : " + ftype.abscat);
        // }
        if (ftype.children.length != tree.children.length) {
            throw (new TypeError("Children mismatch: " + tree.node + " has " + tree.children.length +
                " children (should be " + ftype.children.length + ")"));
        }
        for (var i = 0; i < tree.children.length; i++) {
            this.typecheck(tree.children[i], ftype.children[i]);
        }
    };
    //////////////////////////////////////////////////////////////////////
    // Random generation
    GFAbstract.prototype.generate = function (cat, maxdepth, maxtries, filter) {
        if (!maxdepth)
            maxdepth = 10;
        if (!maxtries)
            maxtries = 1000;
        var cat2funs = this.cat2funs;
        var types = this.types;
        function _generate(cat, maxdepth) {
            if (maxdepth <= 0)
                return null;
            var funs = cat2funs[cat];
            if (typeof filter == "function") {
                funs = funs.filter(filter);
            }
            if (!funs.length)
                return null;
            var fun = funs[Math.floor(Math.random() * funs.length)];
            if (startswith(fun, "default_"))
                return null;
            var children = types[fun].children;
            var tree = new GFTree(fun, []);
            for (var i = 0; i < children.length; i++) {
                var child = _generate(children[i], maxdepth - 1);
                if (!child)
                    return null;
                tree.children.push(child);
            }
            return tree;
        }
        for (var i = 0; i < maxtries; i++) {
            var result = _generate(cat, maxdepth);
            if (result)
                return result;
        }
        return null;
    };
    return GFAbstract;
}());
var GFConcrete = (function () {
    function GFConcrete(flags, productions, functions, sequences, categories, nr_cats) {
        this.abs = undefined;
        this.productions = {};
        for (var p in productions) {
            this.productions[mkCat(p)] = productions[p];
        }
        this.functions = {};
        for (var i = 0; i < functions.length; i++) {
            this.functions[mkFun(i)] = functions[i];
        }
        this.sequences = {};
        for (var i = 0; i < sequences.length; i++) {
            this.sequences[mkSeq(i)] = sequences[i];
        }
        this.categories = {};
        this.inversecats = {};
        for (var abscat in categories) {
            this.categories[abscat] = [];
            for (var i = categories[abscat].s; i <= categories[abscat].e; i++) {
                this.categories[abscat].push(mkCat(i));
                this.inversecats[mkCat(i)] = abscat;
            }
        }
        this.nr_cats = nr_cats;
        // this.coercions = {cat: [cat, ...], ...}
        // this.lincats = {cat: arity(integer)}
        // this.linfuns = {absfun: {[cat,...]: [{fun:fun, cat:cat, seqs:[seq,...]}, ...], ...} , ...}
        this.coercions = {};
        this.lincats = {};
        this.linfuns = {};
        this.max_arity = 1;
        for (var cat in this.productions) {
            setdefault(this.coercions, cat, []).push(cat);
            var prods = this.productions[cat];
            for (var i = 0; i < prods.length; i++) {
                if (prods[i] instanceof Coerce) {
                    setdefault(this.coercions, prods[i].cat, []).push(cat);
                }
                else if (prods[i] instanceof Apply) {
                    var prod = prods[i];
                    var cncfun = this.functions[prod.fun];
                    var xxx = {};
                    var lf = setdefault(this.linfuns, cncfun.absfun, xxx);
                    var children = [];
                    for (var j = 0; j < prod.children.length; j++) {
                        children.push(prod.children[j].parg);
                    }
                    var yyy = [];
                    setdefault(lf, children + "", yyy).push({ fun: prod.fun, cat: cat, seqs: cncfun.seqs });
                    var arity = cncfun.seqs.length;
                    setdefault(this.lincats, cat, arity);
                    if (this.lincats[cat] != arity) {
                        alert("Mismatching linfun arities for cat: " + cat);
                    }
                    if (arity > this.max_arity) {
                        this.max_arity = arity;
                    }
                }
            }
        }
    }
    //////////////////////////////////////////////////////////////////////
    // GF linearisations
    /** GFConcrete.linearise(tree):
        @param tree: a GFTree instance
        @return: an Array of {word:String, path:String}
    **/
    GFConcrete.prototype.linearise = function (tree) {
        var catlins = this._linearise_nondet(tree, "");
        if (catlins.length > 0) {
            return this._expand_tokens(catlins[0].lin[0]);
        }
    };
    GFConcrete.prototype._expand_tokens = function (lin) {
        if (lin.length == 0) {
            return [];
        }
        else if (lin[0].arg) {
            var newlin = [];
            for (var i = lin.length - 1; i >= 0; i--) {
                var path = lin[i].path;
                var arg = lin[i].arg;
                if (arg instanceof SymNE) {
                    arg = new SymKS("-NONEXIST-");
                }
                if (arg instanceof SymKS) {
                    for (var j = arg.tokens.length - 1; j >= 0; j--) {
                        newlin.push({ 'word': arg.tokens[j], 'path': path });
                    }
                }
                else if (arg instanceof SymKP) {
                    var tokens = arg.tokens;
                    if (newlin.length) {
                        altloop: for (var altix = 0; altix < arg.alts.length; altix++) {
                            var alt = arg.alts[altix];
                            for (var followix = 0; followix < alt.follows.length; followix++) {
                                var prefix = alt.follows[followix];
                                if (startswith(newlin[0].word, prefix)) {
                                    tokens = alt.tokens;
                                    break altloop;
                                }
                            }
                        }
                    }
                    for (var j = tokens.length - 1; j >= 0; j--) {
                        var toks = tokens[j].tokens;
                        for (var k = 0; k < toks.length; k++) {
                            newlin.push({ 'word': toks[k], 'path': path });
                        }
                    }
                }
            }
            return newlin.reverse();
        }
        else {
            lin.map(function (sublin) {
                return this._expand_tokens(sublin);
            });
        }
    };
    GFConcrete.prototype._linearise_nondet = function (tree, path) {
        var result = [];
        if (tree instanceof GFTree && this.linfuns[tree.node]) {
            var linfuns = this.linfuns[tree.node];
            var allchildren = this._linearise_children_nondet(tree, 0, path);
            for (var childrenix = 0; childrenix < allchildren.length; childrenix++) {
                var children = allchildren[childrenix];
                var allfcs = linfuns[children.cats.join()];
                if (allfcs && allfcs.length > 0) {
                    // resultloop:
                    for (var fcsix = 0; fcsix < allfcs.length; fcsix++) {
                        var fcs = allfcs[fcsix];
                        var lin = [];
                        for (var seqix = 0; seqix < fcs.seqs.length; seqix++) {
                            var seqnr = fcs.seqs[seqix];
                            var phrase = [];
                            var seq = this.sequences[seqnr];
                            for (var argix = 0; argix < seq.length; argix++) {
                                var arg = seq[argix];
                                if (arg instanceof SymCat) {
                                    var scarg = arg;
                                    var alltokens = children.lins[scarg.arg][scarg.param];
                                    for (var tokix = 0; tokix < alltokens.length; tokix++) {
                                        var token = alltokens[tokix];
                                        phrase.push(token);
                                    }
                                    // } else if (arg instanceof SymNE) {
                                    //     break resultloop;
                                }
                                else {
                                    phrase.push({ 'arg': arg, 'path': path });
                                }
                            }
                            lin.push(phrase);
                        }
                        result.push({ 'cat': fcs.cat, 'lin': lin });
                    }
                }
            }
        }
        else {
            // var childtype;
            // if (tree instanceof GFTree) {
            var childtype = this.abs.types[tree.node].abscat;
            var treeS = tree.node.toString();
            // } else if (startswith(tree, GFMETA) && tree.length > 1) {
            //     childtype = tree.slice(1);
            // }
            var cats = this.categories[childtype];
            for (var catix = 0; catix < cats.length; catix++) {
                var cat = cats[catix];
                var arity = this.lincats[cat] || this.max_arity;
                var lin = [];
                for (var k = 0; k < arity; k++) {
                    lin.push([{ 'arg': { 'tokens': ["[" + treeS + "]"] }, 'path': path }]);
                }
                result.push({ 'cat': cat, 'lin': lin });
            }
        }
        return result;
    };
    GFConcrete.prototype._linearise_children_nondet = function (tree, i, path) {
        var result = [];
        if (i >= tree.children.length) {
            result.push({ 'cats': [], 'lins': [] });
        }
        else {
            var allchild = this._linearise_nondet(tree.children[i], path + i);
            var allchildren = this._linearise_children_nondet(tree, i + 1, path);
            for (var childix = 0; childix < allchild.length; childix++) {
                var child = allchild[childix];
                for (var childrenix = 0; childrenix < allchildren.length; childrenix++) {
                    var children = allchildren[childrenix];
                    var lins = [child.lin].concat(children.lins);
                    var cats = [child.cat].concat(children.cats);
                    var allcocats = this._coerce_cats(cats, 0);
                    for (var cocatix = 0; cocatix < allcocats.length; cocatix++) {
                        var cocats = allcocats[cocatix];
                        result.push({ 'cats': cocats, 'lins': lins });
                    }
                }
            }
        }
        return result;
    };
    GFConcrete.prototype._coerce_cats = function (cats, i) {
        var result = [];
        if (i >= cats.length) {
            result.push([]);
        }
        else {
            var cocats = this.coercions[cats[i]] || [cats[i]];
            var cocats_rest = this._coerce_cats(cats, i + 1);
            for (var cocatix = 0; cocatix < cocats.length; cocatix++) {
                for (var restix = 0; restix < cocats_rest.length; restix++) {
                    result.push([cocats[cocatix]].concat(cocats_rest[restix]));
                }
            }
        }
        return result;
    };
    return GFConcrete;
}());
/** strLin(lin, ?showpath, ?focuspath, ?prefix, ?suffix)
    @param lin: a linearisation as returned by GFConcrete.linearise()
    @param showpath: boolean, if true then show the path of each word
    @param focuspath: the highlighted node, if any (a string of digits)
    @param prefix, suffix: the string that should be used for highlighting
    @return: a String
**/
function strLin(lin, showpath, focus, prefix, suffix) {
    if (prefix == null)
        prefix = "*";
    if (suffix == null)
        suffix = prefix;
    return lin.map(function (w) {
        var token = w.word;
        if (showpath)
            token += "/" + w.path;
        if (startswith(w.path, focus))
            token = prefix + token + suffix;
        return token;
    }).join(" ");
}
//////////////////////////////////////////////////////////////////////
// GF trees
/** GFTree(node, ?children): creates a GF tree
    @param node, type: String
    @param children: an Array of GFTree's
    @return: a new object
**/
var GFTree = (function () {
    function GFTree(node, children) {
        this.node = node;
        this.children = children;
    }
    GFTree.meta = function (typ) {
        return new GFTree(GFTree.GFMETA + typ, []);
    };
    GFTree.prototype.isMeta = function () {
        return this.node[0] == GFTree.GFMETA && this.node.slice(1);
    };
    GFTree.prototype.size = function () {
        var size = 1;
        for (var i = 0; i < this.children.length; i++) {
            size += this.children[i].size();
        }
        return size;
    };
    GFTree.prototype.toString = function (focuspath, prefix, suffix, maxdepth) {
        if (prefix == null)
            prefix = "*";
        if (suffix == null)
            suffix = prefix;
        if (maxdepth !== null) {
            if (maxdepth <= 0)
                return "...";
            maxdepth--;
        }
        var result = (this.children.length == 0) ? this.node :
            "(" + this.node + " " + this.children.map(function (child, n) {
                if (child == null) {
                    return GFTree.GFMETA;
                }
                else {
                    var newpath = focuspath && focuspath[0] == n + "" ? focuspath.slice(1) : null;
                    return child.toString(newpath, prefix, suffix, maxdepth);
                }
            }).join(" ") + ")";
        if (focuspath === "")
            return prefix + result + suffix;
        else
            return result;
    };
    // /** strTree(tree, ?focuspath, ?prefix, ?suffix)
    //     @param tree: a GF tree
    //     @param focuspath: the highlighted node (a string of digits)
    //     @param prefix, suffix: the string that should be used for highlighting
    //     @return: a String
    // **/
    // function strTree(tree : any, focuspath? : string, prefix? : string, suffix? : string) : string {
    //     if (prefix == null) prefix = "*";
    //     if (suffix == null) suffix = prefix;
    //     var result : string ;
    //     if (tree instanceof Array) {
    //         result = "(" + tree.map((child, n) => {
    //             var newpath = focuspath && focuspath[0] == n ? focuspath.slice(1) : null;
    //             return strTree(child, newpath, prefix, suffix);
    //         }).join(" ") + ")";
    //     } else if (tree == null) {
    //         result = GFMETA;
    //     } else {
    //         result = "" + tree;
    //     }
    //     if (focuspath === "") 
    //         return prefix + result + suffix;
    //     else
    //         return result;
    // }
    GFTree.prototype.copy = function () {
        return new GFTree(this.node, this.children.map(function (child) {
            return (child instanceof GFTree) ? child.copy() : child;
        }));
    };
    // /** copyTree(tree)
    //     @param tree: a GF tree
    //     @return: a deep copy of the tree
    // **/
    // function copyTree(tree : any) : any {
    //     if (tree instanceof Array) {
    //         return tree.map(copyTree);
    //     } else {
    //         return tree;
    //     }
    // }
    GFTree.prototype.getSubtree = function (path) {
        var subtree = this;
        for (var i = 0; i < path.length; i++) {
            var n = path[i];
            // var NODELEAF = ":"
            // if (n !== NODELEAF)
            subtree = subtree.children[n];
            if (!subtree)
                return;
        }
        return subtree;
    };
    // /** getSubtree(tree, path)
    //     @param tree: a GF tree
    //     @param path: node reference (a string of digits)
    //     @return: the subtree specified by the given path
    // **/
    // function getSubtree(tree : any, path : string) : any {
    //     var subtree = tree;
    //     for (var i = 0; i < path.length; i++) {
    //         var n = path[i];
    //         // var NODELEAF = ":"
    //         // if (n !== NODELEAF)
    //         subtree = subtree[n];
    //         if (!subtree) return;
    //     }
    //     return subtree;
    // };
    GFTree.prototype.updateSubtree = function (path, update) {
        if (path.length == 0) {
            var newsub = (update instanceof Function) ? update(this) : update;
            this.node = newsub.node;
            this.children = newsub.children;
        }
        else {
            var n = path[path.length - 1];
            var parent = this.getSubtree(path.slice(0, -1));
            parent[n] = (update instanceof Function) ? update(parent[n]) : update;
        }
    };
    // /** updateSubtree(tree, path, update)
    //     @param tree: a GF tree
    //     @param path: node reference (a string of digits)
    //     @param update: a function that updates the specified subtree
    //     -- or a tree which should replace the existing subtree
    // **/
    // function updateSubtree(tree : any, path : string, update : any) {
    //     var n = path[path.length-1];
    //     path = path.slice(0, -1);
    //     var parent = getSubtree(tree, path);
    //     if (update instanceof Function) {
    //         parent[n] = (update instanceof Function) ? update(parent[n]) : update;
    //     }
    // }
    GFTree.prototype.updateCopy = function (path, update) {
        var plen = path.length;
        function _updateSubtree(sub, i) {
            if (i >= plen) {
                return (update instanceof Function) ? update(sub) : update;
            }
            else {
                var n = parseInt(path[i]);
                return new GFTree(sub.node, sub.children.slice(0, n)
                    .concat([_updateSubtree(sub.children[n], i + 1)])
                    .concat(sub.children.slice(n + 1)));
            }
        }
        return _updateSubtree(this, 0);
    };
    return GFTree;
}());
// function GFTree(node : string, children? : string[]) : any {
//     if (children) {
//         return [node].concat(children);
//     } else {
//         return [node];
//     }
// }
GFTree.GFMETA = "?";
/** parseFocusedGFTree(descr)
    @param descr: a string representing the tree
    @return: a new GFTree
**/
function parseGFTree(descr) {
    return parseFocusedGFTree(descr).tree;
}
/** parseFocusedGFTree(descr)
    @param descr: a string representing the tree
    @return: a record {tree: a new GFTree, focus: a focus node}
**/
function parseFocusedGFTree(descr) {
    var tokens = descr
        .replace(/(\*?)\( */g, " $1(")
        .replace(/\)/g, " ) ")
        .replace(/^ +| +$/g, "")
        .split(/ +/);
    var focus = null;
    var stack = [new GFTree(null, [])];
    tokens.forEach(function (token) {
        if (token[0] == "*") {
            focus = stack.map(function (t) { return t.children.length; }).join("").slice(1);
            token = token.slice(1);
        }
        if (token[0] == "(") {
            if (stack.length == 1 && stack[0].children.length > 0) {
                console.log("PARSE ERROR: Expected end-of-string, found '(': " + descr);
            }
            else if (token.length <= 1) {
                console.log("PARSE ERROR: Expected node, found end-of-string: " + descr);
            }
            else {
                var node = token.slice(1);
                stack.push(new GFTree(node, []));
            }
        }
        else if (token == ")") {
            if (stack.length == 1) {
                var err = (stack[0].children.length == 0)
                    ? "No matching open bracket" : "Expected end-of-string";
                console.log("PARSE ERROR: " + err + ", found ')': " + descr);
            }
            else {
                var tree = stack.pop();
                stack[stack.length - 1].children.push(tree);
            }
        }
        else if (/^\w+$/.test(token)) {
            stack[stack.length - 1].children.push(new GFTree(token, []));
        }
        else if (/^\?\w+$/.test(token)) {
            stack[stack.length - 1].children.push(new GFTree(token, []));
        }
        else {
            console.log("PARSE ERROR: Unknown token " + token + ": " + descr);
        }
    });
    if (stack.length > 1) {
        console.log("PARSE ERROR: Expected close bracket, found end-of-string: " + descr);
    }
    else if (stack[0].children.length == 0) {
        console.log("PARSE ERROR: Expected open bracket, found end-of-string: " + descr);
    }
    else {
        return { tree: stack[0].children[0], focus: focus };
    }
}
//////////////////////////////////////////////////////////////////////
// utility functions
/** setdefault(dict, key, defval): lookup key in dict, and set it to defval if not there
    @param dict: an Object
    @param key: the String key
    @param defval: the default value to set, if key doesn't have a value already
    @return: the result of looking up key in dict
**/
function setdefault(dict, key, defval) {
    if (dict[key] == null)
        dict[key] = defval;
    return dict[key];
}
/** startswith(string, prefix)
    @param string, prefix: Strings
    @return: True if string starts with prefix
**/
function startswith(str, prefix) {
    if (typeof str == "string" && typeof prefix == "string")
        return str.slice(0, prefix.length) == prefix;
}
//////////////////////////////////////////////////////////////////////
// functions for creating GF grammars from auto-generated javascript
// DO NOT RELY ON THESE - they might change whenever GF's output format changes
function mkFun(i) { return "F" + i; }
function mkCat(i) { return "C" + i; }
function mkSeq(i) { return "S" + i; }
var Type = (function () {
    function Type(children, abscat) {
        this.children = children;
        this.abscat = abscat;
    }
    return Type;
}());
var Apply = (function () {
    function Apply(fun, children) {
        this.children = children;
        this.fun = mkFun(fun);
    }
    return Apply;
}());
var Coerce = (function () {
    function Coerce(cat) {
        this.cat = mkCat(cat);
    }
    return Coerce;
}());
var PArg = (function () {
    function PArg(cat) {
        this.parg = mkCat(cat);
    }
    return PArg;
}());
var CncFun = (function () {
    function CncFun(absfun, seqs) {
        this.absfun = absfun;
        this.seqs = [];
        for (var i = 0; i < seqs.length; i++)
            this.seqs.push(mkSeq(seqs[i]));
    }
    return CncFun;
}());
var SymLit = (function () {
    function SymLit(arg, param) {
        this.arg = arg;
        this.param = param;
    }
    return SymLit;
}());
var SymCat = (function () {
    function SymCat(arg, param) {
        this.arg = arg;
        this.param = param;
    }
    return SymCat;
}());
var SymKS = (function () {
    function SymKS() {
        var tokens = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tokens[_i] = arguments[_i];
        }
        this.tokens = tokens;
    }
    return SymKS;
}());
var SymNE = (function () {
    function SymNE() {
    }
    return SymNE;
}());
var SymKP = (function () {
    function SymKP(tokens, alts) {
        this.tokens = tokens;
        this.alts = alts;
    }
    return SymKP;
}());
var Alt = (function () {
    function Alt(tokens, follows) {
        this.tokens = tokens;
        this.follows = follows;
    }
    return Alt;
}());
///<reference path="Utilities.ts"/>
///<reference path="GF.ts"/>
var MAX_DEPTH = 3;
var MENU_TIMEOUT = 1000;
var FunTyping;
var TypingFuns;
var Linearise;
var GeneratedTrees;
function initialize_grammar(grammar) {
    FunTyping = grammar.abs.types;
    TypingFuns = grammar.abs.typing2funs;
    Linearise = function (lang, tree) {
        return grammar.cncs[lang].linearise(tree);
    };
    GeneratedTrees = generate_all_trees();
}
var BracketedLin = (function () {
    function BracketedLin(path, tokens) {
        this.path = path;
        this.tokens = tokens;
    }
    BracketedLin.prototype.toString = function (showpath) {
        var tokstr = this.tokens.map(function (tok) {
            return tok.toString(showpath);
        }).join(" ");
        if (showpath) {
            return "[" + this.path + ": " + tokstr + "]";
        }
        else {
            return "[" + tokstr + "]";
        }
    };
    return BracketedLin;
}());
var BracketedToken = (function () {
    function BracketedToken(word, n) {
        this.word = word;
        this.n = n;
    }
    BracketedToken.prototype.toString = function (showpath) {
        return this.word;
    };
    return BracketedToken;
}());
function bracketise(lin) {
    var stack = [new BracketedLin("", [])];
    var n = 0;
    var path = '';
    while (true) {
        var linpath = n < lin.length && lin[n].path + 'w';
        if (startswith(linpath, path)) {
            if (path === linpath) {
                var linword = lin[n].word;
                stack[stack.length - 1].tokens.push(new BracketedToken(linword, n));
                n++;
            }
            else {
                for (var i = path.length + 1; i <= linpath.length; i++) {
                    stack.push(new BracketedLin(linpath.slice(0, i), []));
                }
                path = linpath;
            }
        }
        else {
            var bracklin = stack.pop();
            stack[stack.length - 1].tokens.push(bracklin);
            path = path.slice(0, -1);
            if (!path)
                break;
        }
    }
    if (lin.length !== n || stack.length !== 1) {
        console.log("INTERNAL ERROR: ", lin.length, "!=", n, "//", stack.length, "!=", 1);
    }
    return stack[0];
}
function get_subtrees(tree, path, subtrees) {
    if (!path)
        path = "";
    if (!subtrees)
        subtrees = [];
    subtrees.push({ 'path': path, 'tree': tree });
    for (var i = 0; i < tree.children.length; i++) {
        get_subtrees(tree.children[i], path + i, subtrees);
    }
    return subtrees;
}
function equal_phrases(L1, tree1, L2, tree2) {
    var equals = {};
    equals[L1] = {};
    equals[L2] = {};
    var subs1 = get_subtrees(tree1);
    var subs2 = get_subtrees(tree2);
    for (var i = 0; i < subs1.length; i++) {
        var s1 = subs1[i];
        for (var j = 0; j < subs2.length; j++) {
            var s2 = subs2[j];
            if (s1.tree.toString() == s2.tree.toString()) {
                equals[L1][s1.path] = s2.path;
                equals[L2][s2.path] = s1.path;
                break;
            }
        }
    }
    return equals;
}
function initialize_menus(lang, tree) {
    Utilities.START_TIMER(lang, true);
    var final_menus = {};
    var lin = Linearise(lang, tree);
    var all_phrase_paths_D = {};
    for (var i = 0; i < lin.length; i++) {
        var path = lin[i].path;
        for (var j = path.length; j > 0; j--) {
            all_phrase_paths_D[path.slice(0, j)] = true;
        }
    }
    var all_phrase_paths = Object.keys(all_phrase_paths_D);
    all_phrase_paths.sort(function (a, b) { return b.length - a.length; });
    var visited = {};
    visited[tree.toString()] = all_phrase_paths;
    Utilities.START_TIMER(lang + ":similars", true);
    var all_similars = {};
    var all_menus = {};
    var max_cost = 0;
    for (var i = 0; i < all_phrase_paths.length; i++) {
        var phrase_path = all_phrase_paths[i];
        var phrase_tree = tree.getSubtree(phrase_path);
        all_similars[phrase_path] = similar_trees(phrase_tree);
        max_cost = Math.max(max_cost, all_similars[phrase_path].length);
        all_menus[phrase_path] = {};
    }
    Utilities.STOP_TIMER(lang + ":similars");
    Utilities.START_TIMER(lang + ":menugroup", true);
    var ctr = 0;
    menuloop: for (var cost = 1; cost <= max_cost; cost++) {
        for (var i = 0; i < all_phrase_paths.length; i++) {
            var phrase_path = all_phrase_paths[i];
            var phrase_left = restrict_left(lin, phrase_path);
            var phrase_right = restrict_right(lin, phrase_path);
            var phrase_lin = lin.slice(phrase_left, phrase_right + 1);
            var menus = all_menus[phrase_path];
            var similars = all_similars[phrase_path];
            var simphrs = similars[cost];
            if (simphrs) {
                Utilities.START_TIMER(lang + ":cost-" + cost);
                itemloop: for (var simix = 0; simix < simphrs.length; simix++) {
                    if (Utilities.GET_TIMER(lang + ":menugroup") > MENU_TIMEOUT) {
                        console.log("TIMEOUT: breaking menuloop, cost " + cost +
                            ", path " + phrase_path + ", menu items " + ctr);
                        Utilities.STOP_TIMER(lang + ":cost-" + cost);
                        break menuloop;
                    }
                    Utilities.START_TIMER(lang + ":visited");
                    var sim = simphrs[simix];
                    var simtree = tree.updateCopy(phrase_path, sim);
                    var stree = simtree.toString();
                    var visitlist = visited[stree];
                    if (!visitlist) {
                        visitlist = visited[stree] = [];
                    }
                    else {
                        for (var sti = 0; sti < visitlist.length; sti++) {
                            if (startswith(visitlist[sti], phrase_path)) {
                                Utilities.STOP_TIMER(lang + ":visited");
                                continue itemloop;
                            }
                        }
                    }
                    visitlist.push(phrase_path);
                    Utilities.STOP_TIMER(lang + ":visited");
                    Utilities.START_TIMER(lang + ":simlin");
                    var simlin = Linearise(lang, simtree);
                    Utilities.STOP_TIMER(lang + ":simlin");
                    var pleft = phrase_left;
                    var pright = phrase_right;
                    var sleft = restrict_left(simlin, phrase_path);
                    var sright = restrict_right(simlin, phrase_path);
                    while (pleft <= pright && sleft <= sright && lin[pleft].word == simlin[sleft].word) {
                        pleft++;
                        sleft++;
                    }
                    while (pleft <= pright && sleft <= sright && lin[pright].word == simlin[sright].word) {
                        pright--;
                        sright--;
                    }
                    var phrase_simlin = simlin.slice(sleft, sright + 1);
                    var slin = Utilities.hash(mapwords(phrase_simlin));
                    var plin = Utilities.hash(mapwords(lin.slice(pleft, pright + 1)));
                    if (plin == slin)
                        continue;
                    var pspan = pleft + ":" + pright;
                    // var pspan : string = Utilities.hash([pleft, pright]);
                    if (!menus[pspan])
                        menus[pspan] = {};
                    var current = menus[pspan][slin];
                    if (current && current.cost <= cost)
                        continue;
                    menus[pspan][slin] = {
                        'cost': cost, 'tree': simtree, 'lin': phrase_simlin, 'path': phrase_path,
                        'pleft': pleft, 'pright': pright, 'sleft': sleft, 'sright': sright
                    };
                    ctr++;
                }
                Utilities.STOP_TIMER(lang + ":cost-" + cost);
            }
        }
    }
    Utilities.STOP_TIMER(lang + ":menugroup");
    Utilities.START_TIMER(lang + ":finalize", true);
    for (var i = 0; i < all_phrase_paths.length; i++) {
        var phrase_path = all_phrase_paths[i];
        var ctr = 0;
        var menus = all_menus[phrase_path];
        for (var ppspan in menus) {
            var menu = menus[ppspan];
            var slins = Object.keys(menu);
            slins.sort(function (a, b) {
                var ma = menu[a], mb = menu[b];
                return ma.cost - mb.cost || (ma.sright - ma.sleft) - (mb.sright - mb.sleft) ||
                    mapwords(ma.lin).join().localeCompare(mapwords(mb.lin).join());
            });
            if (!final_menus[ppspan])
                final_menus[ppspan] = {};
            var menu_items = final_menus[ppspan][phrase_path] = [];
            for (var n = 0; n < slins.length; n++) {
                var item = menu[slins[n]];
                menu_items.push(item);
            }
        }
    }
    Utilities.STOP_TIMER(lang + ":finalize");
    Utilities.STOP_TIMER(lang);
    return final_menus;
}
function similar_trees(tree) {
    var all_pruned = prune_tree(tree);
    var result = [];
    for (var pi = 0; pi < all_pruned.length; pi++) {
        var pruned = all_pruned[pi];
        var fun = pruned.tree.node;
        var typ = pruned.tree.isMeta();
        if (!typ) {
            typ = FunTyping[fun].abscat;
        }
        simloop: for (var si = 0; si < GeneratedTrees[typ].length; si++) {
            var simtree = GeneratedTrees[typ][si];
            var cost = pruned.cost + simtree.cost;
            // this should be optimized
            var new_tree = simtree.tree;
            for (var simtyp in simtree.metas) {
                var simmetas = simtree.metas[simtyp];
                var prunedmetas = pruned.metas[simtyp];
                if (!prunedmetas || prunedmetas.length < simmetas.length) {
                    continue simloop;
                }
                for (var j = 0; j < prunedmetas.length; j++) {
                    if (j < simmetas.length) {
                        var old_path = prunedmetas[j].path;
                        var new_path = simmetas[j].path;
                        var sub = tree.getSubtree(old_path);
                        new_tree = new_tree.updateCopy(new_path, sub);
                    }
                    else {
                        cost += prunedmetas[j].cost;
                    }
                }
            }
            for (var extyp in pruned.metas) {
                if (!simtree.metas[extyp]) {
                    for (var j = 0; j < pruned.metas[extyp].length; j++) {
                        cost += pruned.metas[extyp][j].cost;
                    }
                }
            }
            if (!result[cost])
                result[cost] = [];
            result[cost].push(new_tree);
        }
    }
    return result;
}
function prune_tree(tree) {
    function prune(sub, path, depth) {
        if (depth >= MAX_DEPTH)
            return [];
        var fun = sub.node;
        var typ = FunTyping[fun].abscat;
        return prunechildren(sub, path, 0, depth + 1).concat({ 'tree': GFTree.meta(typ),
            'cost': 0,
            'metas': [{ 'path': path, 'type': typ, 'cost': sub.size() }]
        });
    }
    function prunechildren(sub, path, i, depth) {
        var result = [];
        if (i >= sub.children.length) {
            result.push({ 'tree': sub, 'cost': 1, 'metas': [] });
        }
        else {
            var allchild = prune(sub.children[i], path + i, depth);
            var allchildren = prunechildren(sub, path, i + 1, depth);
            for (var childix = 0; childix < allchild.length; childix++) {
                var child = allchild[childix];
                for (var childrenix = 0; childrenix < allchildren.length; childrenix++) {
                    var children = allchildren[childrenix];
                    result.push({ 'tree': sub.updateCopy(i + '', child.tree),
                        'cost': child.cost + children.cost,
                        'metas': child.metas.concat(children.metas) });
                }
            }
        }
        return result;
    }
    var result0 = prune(tree, "", 0);
    var result = [];
    for (var i = 0; i < result0.length; i++) {
        var metas = {};
        for (var j = 0; j < result0[i].metas.length; j++) {
            var meta = result0[i].metas[j];
            if (!metas[meta.type])
                metas[meta.type] = [];
            metas[meta.type].push(meta);
        }
        result.push({ tree: result0[i].tree,
            cost: result0[i].cost,
            metas: metas });
    }
    return result;
}
function gentrees(typ, path, depth, visited) {
    var result = [];
    if (contains_word(typ, visited))
        return result;
    if (depth == 0) {
        // generate a tree of the form: ?t
        result.push({ 'tree': GFTree.meta(typ),
            'cost': 0,
            'metas': [{ 'path': path, 'type': typ, cost: 0 }] });
    }
    var fun = "default_" + typ;
    var fargs = depth > 0 && FunTyping[fun];
    if (fargs && fargs.children) {
        if (fargs.children.length == 0) {
            result.push({ 'tree': new GFTree(fun, []),
                'cost': 1,
                'metas': [] });
        }
        else {
            console.warn("Internal error: you shouldn't have got here", fun, fargs);
        }
    }
    else {
        var newvisited = visited + " " + typ + " ";
        for (var argshash in TypingFuns[typ] || {}) {
            var funs = TypingFuns[typ][argshash];
            var targs = Utilities.unhash(argshash);
            var metatrees = [];
            var metas = [];
            for (var i = 0; i < targs.length; i++) {
                var argtyp = targs[i];
                metatrees.push(GFTree.meta(argtyp));
                metas.push({ 'path': path + i, 'type': argtyp, cost: 0 });
            }
            // generate trees of the form: (f ?t1 ... ?tn)
            for (var funix = 0; funix < funs.length; funix++) {
                var fun = funs[funix];
                result.push({ 'tree': new GFTree(fun, metatrees), 'cost': 1, 'metas': metas });
            }
            // generate trees of the form: (f (t1) ?t2 ... ?tn), (f ?t1 (t2) ?t3 ... ?tn), ...
            for (var argix = 0; argix < targs.length; argix++) {
                var argtyp = targs[argix];
                var allchildren = gentrees(argtyp, path + argix, depth + 1, newvisited);
                for (var chix = 0; chix < allchildren.length; chix++) {
                    var child = allchildren[chix];
                    var childtrees = metatrees.slice(0, argix).concat([child.tree]).concat(metatrees.slice(argix + 1));
                    var childmetas = metas.slice(0, argix).concat(child.metas).concat(metas.slice(argix + 1));
                    for (var funix = 0; funix < funs.length; funix++) {
                        var fun = funs[funix];
                        result.push({ 'tree': new GFTree(fun, childtrees),
                            'cost': child.cost + 1,
                            'metas': childmetas });
                    }
                }
            }
        }
    }
    return result;
}
function generate_all_trees() {
    Utilities.START_TIMER("generate", true);
    var total_trees = 0;
    var generated_trees = {};
    for (var typ in TypingFuns) {
        var trees0 = gentrees(typ, '', 0, '');
        var trees = generated_trees[typ] = [];
        for (var i = 0; i < trees0.length; i++) {
            var metas = {};
            for (var j = 0; j < trees0[i].metas.length; j++) {
                var meta = trees0[i].metas[j];
                if (!metas[meta.type])
                    metas[meta.type] = [];
                metas[meta.type].push(meta);
            }
            var treeinfo = { tree: trees0[i].tree,
                cost: trees0[i].cost,
                metas: metas };
            trees.push(treeinfo);
        }
        total_trees += generated_trees[typ].length;
    }
    Utilities.STOP_TIMER("generate");
    return generated_trees;
}
function contains_word(word, words) {
    return new RegExp(" " + word + " ").test(words);
}
function restrict_left(lin, path) {
    for (var i = 0; i < lin.length; i++) {
        if (startswith(lin[i].path, path))
            return i;
    }
}
function restrict_right(lin, path) {
    for (var i = lin.length - 1; i >= 0; i--) {
        if (startswith(lin[i].path, path))
            return i;
    }
}
function linearise_abstract(tree) {
    // flattened abstract tree
    var lin = [];
    function lintree_(tree, path) {
        if (tree instanceof Array) {
            lin.push({ 'word': "(", 'path': path });
            for (var i in tree) {
                lintree_(tree[i], path); // i>0 ? path+i : path);
            }
            lin.push({ 'word': ")", 'path': path });
        }
        else {
            lin.push({ 'word': tree, 'path': path });
        }
    }
    lintree_(tree, "");
    return lin;
}
function mapwords(lin) {
    return lin.map(function (token) { return token.word; });
}
var Grasp = new GFGrammar(new GFAbstract("Start", { AdAP: new Type(["AdA", "AP"], "AP"), AdvNP: new Type(["NP", "Adv"], "NP"), AdvVP: new Type(["VP", "Adv"], "VP"), ComplVS: new Type(["GraspVS", "S"], "VP"), ComplVV: new Type(["GraspVV", "VP"], "VP"), DefArt: new Type([], "Quant"), DetCN: new Type(["Det", "CN"], "NP"), DetQuant: new Type(["Quant", "Num"], "Det"), IndefArt: new Type([], "Quant"), ModCN: new Type(["AP", "CN"], "CN"), Neg: new Type([], "Pol"), NumPl: new Type([], "Num"), NumSg: new Type([], "Num"), Past: new Type([], "Temp"), Perf: new Type([], "Temp"), Pos: new Type([], "Pol"), PredVP: new Type(["NP", "VP"], "Cl"), PrepNP: new Type(["Prep", "NP"], "Adv"), Pres: new Type([], "Temp"), QuestCl: new Type(["Cl"], "QCl"), QuestIAdv: new Type(["IAdv", "Cl"], "QCl"), QuestVP: new Type(["IP", "VP"], "QCl"), StartUtt: new Type(["Utt"], "Start"), UseA: new Type(["A"], "AP"), UseAdverb: new Type(["Adverb"], "Adv"), UseCl: new Type(["Temp", "Pol", "Cl"], "S"), UseN: new Type(["N"], "CN"), UsePN: new Type(["PN"], "NP"), UsePron: new Type(["Pron"], "NP"), UseV: new Type(["GraspV"], "VP"), UseVA: new Type(["GraspV", "AP"], "VP"), UseVN: new Type(["GraspV", "NP"], "VP"), UseVNA: new Type(["GraspV", "NP", "AP"], "VP"), UseVNN: new Type(["GraspV", "NP", "NP"], "VP"), UttS: new Type(["S"], "Utt"), VerbVS: new Type(["GraspVS"], "GraspV"), VerbVV: new Type(["GraspVV"], "GraspV"), although_Subj: new Type([], "Subj"), and_Conj: new Type([], "Conj"), animal_N: new Type([], "N"), apple_N: new Type([], "N"), because_Subj: new Type([], "Subj"), beer_N: new Type([], "N"), berlin_PN: new Type([], "PN"), big_A: new Type([], "A"), bike_N: new Type([], "N"), bird_N: new Type([], "N"), black_A: new Type([], "A"), blue_A: new Type([], "A"), boat_N: new Type([], "N"), book_N: new Type([], "N"), boy_N: new Type([], "N"), break_V: new Type([], "GraspV"), britain_PN: new Type([], "PN"), buy_V: new Type([], "GraspV"), by8agent_Prep: new Type([], "Prep"), car_N: new Type([], "N"), cat_N: new Type([], "N"), chair_N: new Type([], "N"), copula: new Type([], "GraspV"), cow_N: new Type([], "N"), default_A: new Type([], "A"), default_N: new Type([], "N"), default_NP: new Type([], "NP"), default_PN: new Type([], "PN"), dog_N: new Type([], "N"), drink_V: new Type([], "GraspV"), eat_V: new Type([], "GraspV"), every_Det: new Type([], "Det"), everywhere_Adverb: new Type([], "Adverb"), fish_N: new Type([], "N"), fly_V: new Type([], "GraspV"), foot_N: new Type([], "N"), forest_N: new Type([], "N"), fruit_N: new Type([], "N"), germany_PN: new Type([], "PN"), girl_N: new Type([], "N"), gothenburg_PN: new Type([], "PN"), green_A: new Type([], "A"), hair_N: new Type([], "N"), hand_N: new Type([], "N"), hat_N: new Type([], "N"), hate_V: new Type([], "GraspV"), he_Pron: new Type([], "Pron"), head_N: new Type([], "N"), hear_V: new Type([], "GraspV"), heavy_A: new Type([], "A"), here_Adverb: new Type([], "Adverb"), hope_VS: new Type([], "GraspVS"), horse_N: new Type([], "N"), house_N: new Type([], "N"), hunt_V: new Type([], "GraspV"), i_Pron: new Type([], "Pron"), in_Prep: new Type([], "Prep"), john_PN: new Type([], "PN"), know_VQ: new Type([], "GraspVQ"), know_VS: new Type([], "GraspVS"), like_V: new Type([], "GraspV"), listen_V: new Type([], "GraspV"), london_PN: new Type([], "PN"), long_A: new Type([], "A"), man_N: new Type([], "N"), mary_PN: new Type([], "PN"), milk_N: new Type([], "N"), or_Conj: new Type([], "Conj"), person_N: new Type([], "N"), possess_Prep: new Type([], "Prep"), red_A: new Type([], "A"), run_V: new Type([], "GraspV"), say_VS: new Type([], "GraspVS"), see_V: new Type([], "GraspV"), she_Pron: new Type([], "Pron"), shirt_N: new Type([], "N"), shoe_N: new Type([], "N"), short_A: new Type([], "A"), sit_V: new Type([], "GraspV"), sleep_V: new Type([], "GraspV"), small_A: new Type([], "A"), so_AdA: new Type([], "AdA"), somewhere_Adverb: new Type([], "Adverb"), stone_N: new Type([], "N"), sweden_PN: new Type([], "PN"), swim_V: new Type([], "GraspV"), table_N: new Type([], "N"), that_Quant: new Type([], "Quant"), there_Adverb: new Type([], "Adverb"), they_Pron: new Type([], "Pron"), thick_A: new Type([], "A"), thin_A: new Type([], "A"), this_Quant: new Type([], "Quant"), throw_V: new Type([], "GraspV"), too_AdA: new Type([], "AdA"), tree_N: new Type([], "N"), very_AdA: new Type([], "AdA"), walk_V: new Type([], "GraspV"), want_VV: new Type([], "GraspVV"), watch_V: new Type([], "GraspV"), water_N: new Type([], "N"), we_Pron: new Type([], "Pron"), when_IAdv: new Type([], "IAdv"), when_Subj: new Type([], "Subj"), where_IAdv: new Type([], "IAdv"), white_A: new Type([], "A"), whoSg_IP: new Type([], "IP"), why_IAdv: new Type([], "IAdv"), wine_N: new Type([], "N"), with_Prep: new Type([], "Prep"), woman_N: new Type([], "N"), wonder_VQ: new Type([], "GraspVQ"), yellow_A: new Type([], "A") }), { GraspEng: new GFConcrete({}, { 0: [new Apply(157, []), new Apply(158, []), new Apply(159, []), new Apply(160, []), new Apply(161, []), new Apply(162, []), new Apply(163, []), new Apply(164, []), new Apply(165, []), new Apply(166, []), new Apply(167, []), new Apply(168, []), new Apply(169, []), new Apply(170, [])], 3: [new Apply(171, [new PArg(4), new PArg(3)]), new Apply(172, [new PArg(0)])], 4: [new Apply(173, []), new Apply(174, []), new Apply(175, [])], 7: [new Apply(176, [new PArg(95), new PArg(189)]), new Apply(177, [new PArg(8)])], 8: [new Apply(178, []), new Apply(179, []), new Apply(180, []), new Apply(181, [])], 12: [new Apply(182, [new PArg(3), new PArg(12)]), new Apply(183, [new PArg(59)])], 13: [new Apply(183, [new PArg(60)]), new Apply(184, [new PArg(3), new PArg(13)])], 14: [new Apply(183, [new PArg(61)]), new Apply(185, [new PArg(3), new PArg(14)])], 17: [new Apply(186, [new PArg(68), new PArg(181)]), new Apply(187, [new PArg(69), new PArg(181)]), new Apply(188, [new PArg(72), new PArg(181)]), new Apply(189, [new PArg(73), new PArg(181)]), new Apply(190, [new PArg(74), new PArg(181)]), new Apply(191, [new PArg(75), new PArg(181)]), new Apply(192, [new PArg(76), new PArg(181)]), new Apply(193, [new PArg(77), new PArg(181)])], 20: [new Apply(194, [])], 21: [new Apply(195, [])], 24: [new Apply(196, [new PArg(108), new PArg(78)]), new Apply(197, [])], 26: [new Apply(198, [new PArg(108), new PArg(80)])], 34: [new Apply(199, [new PArg(191)]), new Apply(200, [new PArg(193)]), new Apply(201, []), new Apply(202, []), new Apply(203, []), new Apply(204, []), new Apply(205, []), new Apply(206, []), new Apply(207, []), new Apply(208, []), new Apply(209, []), new Apply(210, []), new Apply(211, []), new Apply(212, []), new Apply(213, []), new Apply(214, []), new Apply(215, []), new Apply(216, []), new Apply(217, []), new Apply(218, []), new Apply(219, [])], 36: [new Apply(220, []), new Apply(221, [])], 40: [new Apply(222, []), new Apply(223, []), new Apply(224, [])], 46: [new Apply(225, [])], 50: [new Apply(226, []), new Apply(227, []), new Apply(228, [])], 54: [new Apply(229, [])], 59: [new Apply(230, []), new Apply(231, []), new Apply(232, []), new Apply(233, []), new Apply(234, []), new Apply(235, []), new Apply(236, []), new Apply(237, []), new Apply(238, []), new Apply(239, []), new Apply(240, []), new Apply(241, []), new Apply(242, []), new Apply(243, []), new Apply(244, []), new Apply(245, []), new Apply(246, []), new Apply(247, []), new Apply(248, []), new Apply(249, []), new Apply(250, []), new Apply(251, []), new Apply(252, []), new Apply(253, []), new Apply(254, []), new Apply(255, []), new Apply(256, []), new Apply(257, []), new Apply(258, []), new Apply(259, []), new Apply(260, [])], 60: [new Apply(261, []), new Apply(262, []), new Apply(263, [])], 61: [new Apply(264, []), new Apply(265, [])], 68: [new Apply(266, [new PArg(68), new PArg(7)]), new Apply(267, [new PArg(96)])], 69: [new Apply(266, [new PArg(69), new PArg(7)]), new Apply(267, [new PArg(97)])], 72: [new Apply(266, [new PArg(72), new PArg(7)]), new Apply(268, [new PArg(187), new PArg(12)]), new Apply(269, [new PArg(86)]), new Apply(270, [])], 73: [new Apply(266, [new PArg(73), new PArg(7)]), new Apply(267, [new PArg(101)]), new Apply(268, [new PArg(187), new PArg(13)]), new Apply(269, [new PArg(87)])], 74: [new Apply(266, [new PArg(74), new PArg(7)]), new Apply(267, [new PArg(102)]), new Apply(268, [new PArg(187), new PArg(14)]), new Apply(269, [new PArg(88)])], 75: [new Apply(266, [new PArg(75), new PArg(7)]), new Apply(271, [new PArg(188), new PArg(12)])], 76: [new Apply(266, [new PArg(76), new PArg(7)]), new Apply(267, [new PArg(104)]), new Apply(271, [new PArg(188), new PArg(13)])], 77: [new Apply(266, [new PArg(77), new PArg(7)]), new Apply(271, [new PArg(188), new PArg(14)])], 78: [new Apply(272, [])], 80: [new Apply(273, [])], 86: [new Apply(274, []), new Apply(275, []), new Apply(276, []), new Apply(277, []), new Apply(278, []), new Apply(279, []), new Apply(280, [])], 87: [new Apply(281, [])], 88: [new Apply(282, [])], 90: [new Apply(283, [])], 92: [new Apply(284, [])], 95: [new Apply(285, []), new Apply(286, []), new Apply(287, []), new Apply(288, [])], 96: [new Apply(289, [])], 97: [new Apply(290, [])], 101: [new Apply(291, [])], 102: [new Apply(292, [])], 104: [new Apply(293, [])], 106: [new Apply(294, [new PArg(17)]), new Apply(295, [new PArg(50), new PArg(17)]), new Apply(296, [new PArg(54), new PArg(181)])], 108: [new Apply(297, []), new Apply(298, []), new Apply(299, []), new Apply(300, [])], 128: [new Apply(301, [new PArg(133), new PArg(90), new PArg(17)]), new Apply(302, [new PArg(135), new PArg(90), new PArg(17)]), new Apply(303, [new PArg(134), new PArg(90), new PArg(17)]), new Apply(304, [new PArg(133), new PArg(92), new PArg(17)]), new Apply(305, [new PArg(135), new PArg(92), new PArg(17)]), new Apply(306, [new PArg(134), new PArg(92), new PArg(17)])], 131: [new Apply(307, [new PArg(146)])], 132: [new Apply(308, []), new Apply(309, []), new Apply(310, [])], 133: [new Apply(311, [])], 134: [new Apply(312, [])], 135: [new Apply(313, [])], 146: [new Apply(314, [new PArg(128)])], 167: [new Apply(315, [new PArg(181), new PArg(7)]), new Apply(316, [new PArg(182), new PArg(128)]), new Apply(317, [new PArg(185), new PArg(181)]), new Apply(318, [new PArg(34), new PArg(190)]), new Apply(319, [new PArg(34), new PArg(189)]), new Apply(320, [new PArg(34), new PArg(189), new PArg(190)]), new Apply(321, [new PArg(34), new PArg(189), new PArg(189)])], 168: [new Apply(322, [new PArg(34)])], 181: [new Coerce(167), new Coerce(168)], 182: [new Coerce(40)], 185: [new Coerce(46)], 187: [new Coerce(24)], 188: [new Coerce(26)], 189: [new Coerce(68), new Coerce(69), new Coerce(72), new Coerce(73), new Coerce(74), new Coerce(75), new Coerce(76), new Coerce(77)], 190: [new Coerce(3)], 191: [new Coerce(40)], 193: [new Coerce(46)] }, [new CncFun("'lindef A'", [0]), new CncFun("'lindef A2'", []), new CncFun("'lindef AP'", [0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef AdA'", [0]), new CncFun("'lindef AdN'", []), new CncFun("'lindef AdV'", []), new CncFun("'lindef Adv'", [0]), new CncFun("'lindef Adverb'", [0]), new CncFun("'lindef Ant'", []), new CncFun("'lindef CAdv'", []), new CncFun("'lindef CN'", [0, 0]), new CncFun("'lindef Card'", []), new CncFun("'lindef Cl'", [0, 0, 0, 0, 0, 0]), new CncFun("'lindef ClSlash'", []), new CncFun("'lindef Comp'", []), new CncFun("'lindef Conj'", []), new CncFun("'lindef DAP'", []), new CncFun("'lindef Det'", [0]), new CncFun("'lindef Digits'", []), new CncFun("'lindef GraspV'", [0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef GraspVQ'", []), new CncFun("'lindef GraspVS'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef GraspVV'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef IAdv'", []), new CncFun("'lindef IComp'", []), new CncFun("'lindef IDet'", []), new CncFun("'lindef IP'", []), new CncFun("'lindef IQuant'", []), new CncFun("'lindef Imp'", []), new CncFun("'lindef Interj'", []), new CncFun("'lindef N'", [0, 0]), new CncFun("'lindef N2'", []), new CncFun("'lindef N3'", []), new CncFun("'lindef NP'", [0, 0]), new CncFun("'lindef Num'", [0]), new CncFun("'lindef Numeral'", []), new CncFun("'lindef Ord'", []), new CncFun("'lindef PConj'", []), new CncFun("'lindef PN'", [0]), new CncFun("'lindef Phr'", []), new CncFun("'lindef Pol'", [0]), new CncFun("'lindef Predet'", []), new CncFun("'lindef Prep'", [0]), new CncFun("'lindef Pron'", [0, 0]), new CncFun("'lindef QCl'", []), new CncFun("'lindef QS'", []), new CncFun("'lindef Quant'", [0, 0]), new CncFun("'lindef RCl'", []), new CncFun("'lindef RP'", []), new CncFun("'lindef RS'", []), new CncFun("'lindef S'", [0]), new CncFun("'lindef SC'", []), new CncFun("'lindef SSlash'", []), new CncFun("'lindef Start'", [0]), new CncFun("'lindef Subj'", []), new CncFun("'lindef Temp'", [0]), new CncFun("'lindef Tense'", []), new CncFun("'lindef Text'", []), new CncFun("'lindef Utt'", [0]), new CncFun("'lindef V'", []), new CncFun("'lindef V2'", []), new CncFun("'lindef V2A'", []), new CncFun("'lindef V2Q'", []), new CncFun("'lindef V2S'", []), new CncFun("'lindef V2V'", []), new CncFun("'lindef V3'", []), new CncFun("'lindef VA'", []), new CncFun("'lindef VP'", [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2, 1, 0, 1, 2, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 5, 1, 0, 1, 5, 1, 0, 1, 5, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 6, 1, 0, 1, 6, 1, 0, 1, 7, 1, 0, 1, 7, 1, 0, 1, 7, 1, 0, 1, 6, 1, 0, 1, 6, 1, 0, 1, 6, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 8, 1, 0, 1, 8, 1, 0, 1, 8, 1, 0, 1, 8, 1, 0, 1, 8, 1, 0, 1, 8, 1, 0, 1, 8, 1, 0, 1, 8, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]), new CncFun("'lindef VPSlash'", []), new CncFun("'lindef VQ'", []), new CncFun("'lindef VS'", []), new CncFun("'lindef VV'", []), new CncFun("'lindef Voc'", []), new CncFun("'lindef A'", [9]), new CncFun("'lindef A2'", [10]), new CncFun("'lindef AP'", [9]), new CncFun("'lindef AdA'", [9]), new CncFun("'lindef AdN'", [11]), new CncFun("'lindef AdV'", [11]), new CncFun("'lindef Adv'", [9]), new CncFun("'lindef Adverb'", [9]), new CncFun("'lindef Ant'", [11]), new CncFun("'lindef CAdv'", [11]), new CncFun("'lindef CN'", [9]), new CncFun("'lindef Card'", [11]), new CncFun("'lindef Cl'", [9]), new CncFun("'lindef ClSlash'", [10]), new CncFun("'lindef Comp'", [11]), new CncFun("'lindef Conj'", [10]), new CncFun("'lindef DAP'", [11]), new CncFun("'lindef Det'", [9]), new CncFun("'lindef Digits'", [11]), new CncFun("'lindef GraspV'", [9]), new CncFun("'lindef GraspVQ'", [11]), new CncFun("'lindef GraspVS'", [9]), new CncFun("'lindef GraspVV'", [9]), new CncFun("'lindef IAdv'", [11]), new CncFun("'lindef IComp'", [11]), new CncFun("'lindef IDet'", [11]), new CncFun("'lindef IP'", [11]), new CncFun("'lindef IQuant'", [11]), new CncFun("'lindef Imp'", [11]), new CncFun("'lindef Interj'", [11]), new CncFun("'lindef N'", [9]), new CncFun("'lindef N2'", [10]), new CncFun("'lindef N3'", [12]), new CncFun("'lindef NP'", [9]), new CncFun("'lindef Num'", [9]), new CncFun("'lindef Numeral'", [11]), new CncFun("'lindef Ord'", [11]), new CncFun("'lindef PConj'", [11]), new CncFun("'lindef PN'", [9]), new CncFun("'lindef Phr'", [11]), new CncFun("'lindef Pol'", [9]), new CncFun("'lindef Predet'", [11]), new CncFun("'lindef Prep'", [9]), new CncFun("'lindef Pron'", [9]), new CncFun("'lindef QCl'", [11]), new CncFun("'lindef QS'", [11]), new CncFun("'lindef Quant'", [9]), new CncFun("'lindef RCl'", [11]), new CncFun("'lindef RP'", [11]), new CncFun("'lindef RS'", [11]), new CncFun("'lindef S'", [9]), new CncFun("'lindef SC'", [11]), new CncFun("'lindef SSlash'", [10]), new CncFun("'lindef Start'", [9]), new CncFun("'lindef Subj'", [11]), new CncFun("'lindef Temp'", [9]), new CncFun("'lindef Tense'", [11]), new CncFun("'lindef Text'", [11]), new CncFun("'lindef Utt'", [9]), new CncFun("'lindef V'", [10]), new CncFun("'lindef V'", [13]), new CncFun("'lindef V2'", [12]), new CncFun("'lindef V2'", [14]), new CncFun("'lindef V2A'", [12]), new CncFun("'lindef V2A'", [14]), new CncFun("'lindef V2Q'", [12]), new CncFun("'lindef V2Q'", [14]), new CncFun("'lindef V2S'", [12]), new CncFun("'lindef V2S'", [14]), new CncFun("'lindef V2V'", [10]), new CncFun("'lindef V2V'", [13]), new CncFun("'lindef V3'", [15]), new CncFun("'lindef V3'", [16]), new CncFun("'lindef VA'", [10]), new CncFun("'lindef VA'", [13]), new CncFun("'lindef VP'", [17]), new CncFun("'lindef VPSlash'", [18]), new CncFun("'lindef VQ'", [10]), new CncFun("'lindef VQ'", [13]), new CncFun("'lindef VS'", [10]), new CncFun("'lindef VS'", [13]), new CncFun("'lindef VV'", [11]), new CncFun("'lindef VV'", [10]), new CncFun("'lindef Voc'", [11]), new CncFun("big_A", [19]), new CncFun("black_A", [20]), new CncFun("blue_A", [21]), new CncFun("default_A", [22]), new CncFun("green_A", [23]), new CncFun("heavy_A", [24]), new CncFun("long_A", [25]), new CncFun("red_A", [26]), new CncFun("short_A", [27]), new CncFun("small_A", [28]), new CncFun("thick_A", [29]), new CncFun("thin_A", [30]), new CncFun("white_A", [31]), new CncFun("yellow_A", [32]), new CncFun("AdAP", [33, 34, 35, 36, 37, 38, 39, 40]), new CncFun("UseA", [9, 9, 9, 9, 9, 9, 9, 9]), new CncFun("so_AdA", [41]), new CncFun("too_AdA", [42]), new CncFun("very_AdA", [43]), new CncFun("PrepNP", [34]), new CncFun("UseAdverb", [9]), new CncFun("everywhere_Adverb", [44]), new CncFun("here_Adverb", [45]), new CncFun("somewhere_Adverb", [46]), new CncFun("there_Adverb", [47]), new CncFun("ModCN", [48, 49]), new CncFun("UseN", [9, 50]), new CncFun("ModCN", [51, 52]), new CncFun("ModCN", [53, 54]), new CncFun("PredVP", [55, 56, 57, 58, 59, 60]), new CncFun("PredVP", [61, 62, 63, 64, 65, 66]), new CncFun("PredVP", [67, 68, 69, 70, 71, 72]), new CncFun("PredVP", [73, 74, 75, 76, 77, 78]), new CncFun("PredVP", [79, 80, 81, 82, 83, 84]), new CncFun("PredVP", [85, 86, 87, 88, 89, 90]), new CncFun("PredVP", [91, 92, 93, 94, 95, 96]), new CncFun("PredVP", [97, 98, 99, 100, 101, 102]), new CncFun("or_Conj", []), new CncFun("and_Conj", []), new CncFun("DetQuant", [33]), new CncFun("every_Det", [103]), new CncFun("DetQuant", [104]), new CncFun("VerbVS", [9, 50, 105, 106, 107, 108, 109]), new CncFun("VerbVV", [9, 50, 105, 106, 107, 108, 109]), new CncFun("break_V", [110, 111, 112, 113, 1, 1, 1]), new CncFun("buy_V", [114, 115, 116, 116, 1, 1, 1]), new CncFun("copula", [117, 118, 119, 120, 1, 1, 1]), new CncFun("drink_V", [121, 122, 123, 124, 1, 1, 1]), new CncFun("eat_V", [125, 126, 127, 128, 1, 1, 1]), new CncFun("fly_V", [129, 130, 131, 132, 1, 1, 1]), new CncFun("hate_V", [133, 134, 135, 135, 1, 1, 1]), new CncFun("hear_V", [136, 137, 138, 138, 1, 1, 1]), new CncFun("hunt_V", [139, 140, 141, 141, 1, 1, 1]), new CncFun("like_V", [142, 143, 144, 144, 1, 1, 1]), new CncFun("listen_V", [145, 146, 147, 147, 1, 148, 1]), new CncFun("run_V", [149, 150, 149, 151, 1, 1, 1]), new CncFun("see_V", [152, 153, 154, 155, 1, 1, 1]), new CncFun("sit_V", [156, 157, 158, 158, 1, 1, 1]), new CncFun("sleep_V", [159, 160, 161, 161, 1, 1, 1]), new CncFun("swim_V", [162, 163, 164, 165, 1, 1, 1]), new CncFun("throw_V", [166, 167, 168, 169, 1, 1, 1]), new CncFun("walk_V", [170, 171, 172, 172, 1, 1, 1]), new CncFun("watch_V", [173, 174, 175, 175, 1, 1, 1]), new CncFun("know_VQ", []), new CncFun("wonder_VQ", []), new CncFun("hope_VS", [176, 177, 178, 178, 1, 1, 1, 176, 177, 178, 178, 1]), new CncFun("know_VS", [179, 180, 181, 182, 1, 1, 1, 179, 180, 181, 182, 1]), new CncFun("say_VS", [183, 184, 185, 185, 1, 1, 1, 183, 184, 185, 185, 1]), new CncFun("want_VV", [186, 187, 188, 188, 1, 1, 1, 186, 187, 188, 188, 1]), new CncFun("when_IAdv", []), new CncFun("where_IAdv", []), new CncFun("why_IAdv", []), new CncFun("whoSg_IP", []), new CncFun("animal_N", [189, 190]), new CncFun("apple_N", [191, 192]), new CncFun("beer_N", [193, 194]), new CncFun("bike_N", [195, 196]), new CncFun("bird_N", [197, 198]), new CncFun("boat_N", [199, 200]), new CncFun("book_N", [201, 202]), new CncFun("car_N", [203, 204]), new CncFun("cat_N", [205, 206]), new CncFun("chair_N", [207, 208]), new CncFun("cow_N", [209, 210]), new CncFun("default_N", [211, 212]), new CncFun("dog_N", [213, 214]), new CncFun("fish_N", [215, 215]), new CncFun("foot_N", [216, 217]), new CncFun("forest_N", [218, 219]), new CncFun("fruit_N", [220, 220]), new CncFun("hair_N", [221, 222]), new CncFun("hand_N", [223, 224]), new CncFun("hat_N", [225, 226]), new CncFun("head_N", [227, 228]), new CncFun("horse_N", [229, 230]), new CncFun("house_N", [231, 232]), new CncFun("milk_N", [233, 234]), new CncFun("shirt_N", [235, 236]), new CncFun("shoe_N", [237, 238]), new CncFun("stone_N", [239, 240]), new CncFun("table_N", [241, 242]), new CncFun("tree_N", [243, 244]), new CncFun("water_N", [245, 246]), new CncFun("wine_N", [247, 248]), new CncFun("boy_N", [249, 250]), new CncFun("man_N", [251, 252]), new CncFun("person_N", [253, 254]), new CncFun("girl_N", [255, 256]), new CncFun("woman_N", [257, 258]), new CncFun("AdvNP", [33, 104]), new CncFun("UsePron", [9, 50]), new CncFun("DetCN", [33, 33]), new CncFun("UsePN", [9, 9]), new CncFun("default_NP", [259, 259]), new CncFun("DetCN", [34, 34]), new CncFun("NumSg", [1]), new CncFun("NumPl", [1]), new CncFun("berlin_PN", [260]), new CncFun("britain_PN", [261]), new CncFun("default_PN", [262]), new CncFun("germany_PN", [263]), new CncFun("gothenburg_PN", [264]), new CncFun("london_PN", [265]), new CncFun("sweden_PN", [266]), new CncFun("john_PN", [267]), new CncFun("mary_PN", [268]), new CncFun("Pos", [1]), new CncFun("Neg", [1]), new CncFun("by8agent_Prep", [269]), new CncFun("in_Prep", [270]), new CncFun("possess_Prep", [271]), new CncFun("with_Prep", [272]), new CncFun("i_Pron", [273, 274]), new CncFun("we_Pron", [275, 276]), new CncFun("he_Pron", [277, 278]), new CncFun("she_Pron", [279, 280]), new CncFun("they_Pron", [281, 282]), new CncFun("QuestCl", []), new CncFun("QuestIAdv", []), new CncFun("QuestVP", []), new CncFun("DefArt", [283, 283]), new CncFun("IndefArt", [284, 1]), new CncFun("that_Quant", [285, 286]), new CncFun("this_Quant", [287, 288]), new CncFun("UseCl", [289]), new CncFun("UseCl", [290]), new CncFun("UseCl", [291]), new CncFun("UseCl", [292]), new CncFun("UseCl", [293]), new CncFun("UseCl", [294]), new CncFun("StartUtt", [9]), new CncFun("although_Subj", []), new CncFun("because_Subj", []), new CncFun("when_Subj", []), new CncFun("Pres", [1]), new CncFun("Perf", [1]), new CncFun("Past", [1]), new CncFun("UttS", [295]), new CncFun("AdvVP", [9, 50, 105, 106, 107, 108, 109, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499]), new CncFun("ComplVS", [1, 1, 296, 1, 1, 1, 296, 1, 1, 1, 297, 1, 1, 1, 297, 1, 1, 1, 297, 1, 1, 1, 296, 1, 1, 1, 296, 1, 1, 1, 296, 1, 1, 2, 1, 296, 1, 2, 1, 296, 1, 3, 1, 296, 1, 3, 1, 296, 1, 3, 1, 296, 1, 2, 1, 296, 1, 2, 1, 296, 1, 2, 1, 296, 1, 4, 1, 298, 1, 4, 1, 298, 1, 5, 1, 298, 1, 5, 1, 298, 1, 5, 1, 298, 1, 4, 1, 298, 1, 4, 1, 298, 1, 4, 1, 298, 1, 6, 1, 298, 1, 6, 1, 298, 1, 7, 1, 298, 1, 7, 1, 298, 1, 7, 1, 298, 1, 6, 1, 298, 1, 6, 1, 298, 1, 6, 1, 298, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 1, 1, 1, 1, 1, 1, 1, 500, 296, 300, 1, 1, 1, 1, 1, 1, 1, 1]), new CncFun("ComplVV", [1, 1, 296, 1, 1, 1, 296, 1, 1, 1, 297, 1, 1, 1, 297, 1, 1, 1, 297, 1, 1, 1, 296, 1, 1, 1, 296, 1, 1, 1, 296, 1, 1, 2, 1, 296, 1, 2, 1, 296, 1, 3, 1, 296, 1, 3, 1, 296, 1, 3, 1, 296, 1, 2, 1, 296, 1, 2, 1, 296, 1, 2, 1, 296, 1, 4, 1, 298, 1, 4, 1, 298, 1, 5, 1, 298, 1, 5, 1, 298, 1, 5, 1, 298, 1, 4, 1, 298, 1, 4, 1, 298, 1, 4, 1, 298, 1, 6, 1, 298, 1, 6, 1, 298, 1, 7, 1, 298, 1, 7, 1, 298, 1, 7, 1, 298, 1, 6, 1, 298, 1, 6, 1, 298, 1, 6, 1, 298, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 1, 299, 1, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 8, 1, 296, 1, 1, 1, 1, 1, 1, 1, 1, 1, 296, 300, 501, 502, 503, 504, 505, 506, 507, 508]), new CncFun("UseVA", [1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 2, 1, 9, 1, 2, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 4, 1, 105, 1, 4, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 109, 509, 510, 511, 512, 513, 514, 515, 516]), new CncFun("UseVN", [1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 2, 1, 9, 1, 2, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 4, 1, 105, 1, 4, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 109, 517, 517, 517, 517, 517, 517, 517, 517]), new CncFun("UseVNA", [1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 2, 1, 9, 1, 2, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 4, 1, 105, 1, 4, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 109, 518, 519, 520, 521, 522, 523, 524, 525]), new CncFun("UseVNN", [1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 2, 1, 9, 1, 2, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 4, 1, 105, 1, 4, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 109, 526, 526, 526, 526, 526, 526, 526, 526]), new CncFun("UseV", [1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 50, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 1, 9, 1, 1, 2, 1, 9, 1, 2, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 3, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 2, 1, 9, 1, 4, 1, 105, 1, 4, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 5, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 4, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 7, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 6, 1, 105, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 1, 106, 1, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 8, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 109, 1, 1, 1, 1, 1, 1, 1, 1])], [[new SymLit(0, 0)], [], [new SymKS("don't")], [new SymKS("doesn't")], [new SymKS("have")], [new SymKS("has")], [new SymKS("haven't")], [new SymKS("hasn't")], [new SymKS("didn't")], [new SymCat(0, 0)], [new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymKS("itself")], [new SymCat(0, -1), new SymCat(0, -1), new SymKS("itself"), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymKS("itself"), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, 194), new SymCat(0, 201), new SymCat(0, 202), new SymCat(0, 205), new SymCat(0, 200)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("big")], [new SymKS("black")], [new SymKS("blue")], [new SymKS("[adjective]")], [new SymKS("green")], [new SymKS("heavy")], [new SymKS("long")], [new SymKS("red")], [new SymKS("short")], [new SymKS("small")], [new SymKS("thick")], [new SymKS("thin")], [new SymKS("white")], [new SymKS("yellow")], [new SymCat(0, 0), new SymCat(1, 0)], [new SymCat(0, 0), new SymCat(1, 1)], [new SymCat(0, 0), new SymCat(1, 2)], [new SymCat(0, 0), new SymCat(1, 3)], [new SymCat(0, 0), new SymCat(1, 4)], [new SymCat(0, 0), new SymCat(1, 5)], [new SymCat(0, 0), new SymCat(1, 6)], [new SymCat(0, 0), new SymCat(1, 7)], [new SymKS("so")], [new SymKS("too")], [new SymKS("very")], [new SymKS("everywhere")], [new SymKS("here")], [new SymKS("somewhere")], [new SymKS("there")], [new SymCat(0, 2), new SymCat(1, 0)], [new SymCat(0, 5), new SymCat(1, 1)], [new SymCat(0, 1)], [new SymCat(0, 3), new SymCat(1, 0)], [new SymCat(0, 6), new SymCat(1, 1)], [new SymCat(0, 4), new SymCat(1, 0)], [new SymCat(0, 7), new SymCat(1, 1)], [new SymCat(0, 0), new SymCat(1, 1), new SymCat(1, 0), new SymCat(1, 192), new SymCat(1, 2), new SymCat(1, 3), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 33), new SymCat(1, 32), new SymCat(1, 192), new SymCat(1, 34), new SymCat(1, 35), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 65), new SymCat(1, 64), new SymCat(1, 192), new SymCat(1, 66), new SymCat(1, 67), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 97), new SymCat(1, 96), new SymCat(1, 192), new SymCat(1, 98), new SymCat(1, 99), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 129), new SymCat(1, 128), new SymCat(1, 192), new SymCat(1, 130), new SymCat(1, 131), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 161), new SymCat(1, 160), new SymCat(1, 192), new SymCat(1, 162), new SymCat(1, 163), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 5), new SymCat(1, 4), new SymCat(1, 193), new SymCat(1, 6), new SymCat(1, 7), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 37), new SymCat(1, 36), new SymCat(1, 193), new SymCat(1, 38), new SymCat(1, 39), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 69), new SymCat(1, 68), new SymCat(1, 193), new SymCat(1, 70), new SymCat(1, 71), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 101), new SymCat(1, 100), new SymCat(1, 193), new SymCat(1, 102), new SymCat(1, 103), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 133), new SymCat(1, 132), new SymCat(1, 193), new SymCat(1, 134), new SymCat(1, 135), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 165), new SymCat(1, 164), new SymCat(1, 193), new SymCat(1, 166), new SymCat(1, 167), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 9), new SymCat(1, 8), new SymCat(1, 194), new SymCat(1, 10), new SymCat(1, 11), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 41), new SymCat(1, 40), new SymCat(1, 194), new SymCat(1, 42), new SymCat(1, 43), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 73), new SymCat(1, 72), new SymCat(1, 194), new SymCat(1, 74), new SymCat(1, 75), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 105), new SymCat(1, 104), new SymCat(1, 194), new SymCat(1, 106), new SymCat(1, 107), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 137), new SymCat(1, 136), new SymCat(1, 194), new SymCat(1, 138), new SymCat(1, 139), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 169), new SymCat(1, 168), new SymCat(1, 194), new SymCat(1, 170), new SymCat(1, 171), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 13), new SymCat(1, 12), new SymCat(1, 195), new SymCat(1, 14), new SymCat(1, 15), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 45), new SymCat(1, 44), new SymCat(1, 195), new SymCat(1, 46), new SymCat(1, 47), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 77), new SymCat(1, 76), new SymCat(1, 195), new SymCat(1, 78), new SymCat(1, 79), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 109), new SymCat(1, 108), new SymCat(1, 195), new SymCat(1, 110), new SymCat(1, 111), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 141), new SymCat(1, 140), new SymCat(1, 195), new SymCat(1, 142), new SymCat(1, 143), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 173), new SymCat(1, 172), new SymCat(1, 195), new SymCat(1, 174), new SymCat(1, 175), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 17), new SymCat(1, 16), new SymCat(1, 196), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 49), new SymCat(1, 48), new SymCat(1, 196), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 81), new SymCat(1, 80), new SymCat(1, 196), new SymCat(1, 82), new SymCat(1, 83), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 113), new SymCat(1, 112), new SymCat(1, 196), new SymCat(1, 114), new SymCat(1, 115), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 145), new SymCat(1, 144), new SymCat(1, 196), new SymCat(1, 146), new SymCat(1, 147), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 177), new SymCat(1, 176), new SymCat(1, 196), new SymCat(1, 178), new SymCat(1, 179), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 21), new SymCat(1, 20), new SymCat(1, 197), new SymCat(1, 22), new SymCat(1, 23), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 53), new SymCat(1, 52), new SymCat(1, 197), new SymCat(1, 54), new SymCat(1, 55), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 85), new SymCat(1, 84), new SymCat(1, 197), new SymCat(1, 86), new SymCat(1, 87), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 117), new SymCat(1, 116), new SymCat(1, 197), new SymCat(1, 118), new SymCat(1, 119), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 149), new SymCat(1, 148), new SymCat(1, 197), new SymCat(1, 150), new SymCat(1, 151), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 181), new SymCat(1, 180), new SymCat(1, 197), new SymCat(1, 182), new SymCat(1, 183), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 25), new SymCat(1, 24), new SymCat(1, 198), new SymCat(1, 26), new SymCat(1, 27), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 57), new SymCat(1, 56), new SymCat(1, 198), new SymCat(1, 58), new SymCat(1, 59), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 89), new SymCat(1, 88), new SymCat(1, 198), new SymCat(1, 90), new SymCat(1, 91), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 121), new SymCat(1, 120), new SymCat(1, 198), new SymCat(1, 122), new SymCat(1, 123), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 153), new SymCat(1, 152), new SymCat(1, 198), new SymCat(1, 154), new SymCat(1, 155), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 185), new SymCat(1, 184), new SymCat(1, 198), new SymCat(1, 186), new SymCat(1, 187), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 29), new SymCat(1, 28), new SymCat(1, 199), new SymCat(1, 30), new SymCat(1, 31), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 61), new SymCat(1, 60), new SymCat(1, 199), new SymCat(1, 62), new SymCat(1, 63), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 93), new SymCat(1, 92), new SymCat(1, 199), new SymCat(1, 94), new SymCat(1, 95), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 125), new SymCat(1, 124), new SymCat(1, 199), new SymCat(1, 126), new SymCat(1, 127), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 157), new SymCat(1, 156), new SymCat(1, 199), new SymCat(1, 158), new SymCat(1, 159), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymCat(0, 0), new SymCat(1, 189), new SymCat(1, 188), new SymCat(1, 199), new SymCat(1, 190), new SymCat(1, 191), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymKS("every")], [new SymCat(0, 1), new SymCat(1, 0)], [new SymCat(0, 2)], [new SymCat(0, 3)], [new SymCat(0, 4)], [new SymCat(0, 5)], [new SymCat(0, 6)], [new SymKS("break")], [new SymKS("breaks")], [new SymKS("broken")], [new SymKS("broke")], [new SymKS("buy")], [new SymKS("buys")], [new SymKS("bought")], [new SymKS("be/am/are")], [new SymKS("is")], [new SymKS("been")], [new SymKS("was/were")], [new SymKS("drink")], [new SymKS("drinks")], [new SymKS("drunk")], [new SymKS("drank")], [new SymKS("eat")], [new SymKS("eats")], [new SymKS("eaten")], [new SymKS("ate")], [new SymKS("fly")], [new SymKS("flies")], [new SymKS("flown")], [new SymKS("flew")], [new SymKS("hate")], [new SymKS("hates")], [new SymKS("hated")], [new SymKS("hear")], [new SymKS("hears")], [new SymKS("heard")], [new SymKS("hunt")], [new SymKS("hunts")], [new SymKS("hunted")], [new SymKS("like")], [new SymKS("likes")], [new SymKS("liked")], [new SymKS("listen")], [new SymKS("listens")], [new SymKS("listened")], [new SymKS("to")], [new SymKS("run")], [new SymKS("runs")], [new SymKS("ran")], [new SymKS("see")], [new SymKS("sees")], [new SymKS("seen")], [new SymKS("saw")], [new SymKS("sit")], [new SymKS("sits")], [new SymKS("sat")], [new SymKS("sleep")], [new SymKS("sleeps")], [new SymKS("slept")], [new SymKS("swim")], [new SymKS("swims")], [new SymKS("swum")], [new SymKS("swam")], [new SymKS("throw")], [new SymKS("throws")], [new SymKS("thrown")], [new SymKS("threw")], [new SymKS("walk")], [new SymKS("walks")], [new SymKS("walked")], [new SymKS("watch")], [new SymKS("watches")], [new SymKS("watched")], [new SymKS("hope")], [new SymKS("hopes")], [new SymKS("hoped")], [new SymKS("know")], [new SymKS("knows")], [new SymKS("known")], [new SymKS("knew")], [new SymKS("say")], [new SymKS("says")], [new SymKS("said")], [new SymKS("want")], [new SymKS("wants")], [new SymKS("wanted")], [new SymKS("animal")], [new SymKS("animals")], [new SymKS("apple")], [new SymKS("apples")], [new SymKS("beer")], [new SymKS("beers")], [new SymKS("bike")], [new SymKS("bikes")], [new SymKS("bird")], [new SymKS("birds")], [new SymKS("boat")], [new SymKS("boats")], [new SymKS("book")], [new SymKS("books")], [new SymKS("car")], [new SymKS("cars")], [new SymKS("cat")], [new SymKS("cats")], [new SymKS("chair")], [new SymKS("chairs")], [new SymKS("cow")], [new SymKS("cows")], [new SymKS("[thing]")], [new SymKS("[thing]s")], [new SymKS("dog")], [new SymKS("dogs")], [new SymKS("fish")], [new SymKS("foot")], [new SymKS("feet")], [new SymKS("forest")], [new SymKS("forests")], [new SymKS("fruit")], [new SymKS("hair")], [new SymKS("hairs")], [new SymKS("hand")], [new SymKS("hands")], [new SymKS("hat")], [new SymKS("hats")], [new SymKS("head")], [new SymKS("heads")], [new SymKS("horse")], [new SymKS("horses")], [new SymKS("house")], [new SymKS("houses")], [new SymKS("milk")], [new SymKS("milks")], [new SymKS("shirt")], [new SymKS("shirts")], [new SymKS("shoe")], [new SymKS("shoes")], [new SymKS("stone")], [new SymKS("stones")], [new SymKS("table")], [new SymKS("tables")], [new SymKS("tree")], [new SymKS("trees")], [new SymKS("water")], [new SymKS("waters")], [new SymKS("wine")], [new SymKS("wines")], [new SymKS("boy")], [new SymKS("boys")], [new SymKS("man")], [new SymKS("men")], [new SymKS("person")], [new SymKS("persons")], [new SymKS("girl")], [new SymKS("girls")], [new SymKS("woman")], [new SymKS("women")], [new SymKS("[something]")], [new SymNE()], [new SymKS("Britain")], [new SymKS("[name]")], [new SymKS("Germany")], [new SymKS("Gothenburg")], [new SymKS("London")], [new SymKS("Sweden")], [new SymKS("John")], [new SymKS("Mary")], [new SymKS("by")], [new SymKS("in")], [new SymKS("of")], [new SymKS("with")], [new SymKS("I")], [new SymKS("me")], [new SymKS("we")], [new SymKS("us")], [new SymKS("he")], [new SymKS("him")], [new SymKS("she")], [new SymKS("her")], [new SymKS("they")], [new SymKS("them")], [new SymKS("the")], [new SymKP([new SymKS("a")], [new Alt([new SymKS("a")], ["eu", "Eu", "uni", "up"]), new Alt([new SymKS("an")], ["un"]), new Alt([new SymKS("an")], ["a", "e", "i", "o", "A", "E", "I", "O"]), new Alt([new SymKS("an")], ["SMS", "sms"])])], [new SymKS("that")], [new SymKS("those")], [new SymKS("this")], [new SymKS("these")], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 0)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 4)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 2)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 1)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 5)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 3)], [new SymCat(0, 0), new SymKS(".")], [new SymCat(0, 7)], [new SymCat(0, 8)], [new SymCat(0, 9)], [new SymCat(0, 10)], [new SymCat(0, 11)], [new SymCat(0, 12)], [new SymCat(0, 13)], [new SymCat(0, 14)], [new SymCat(0, 15)], [new SymCat(0, 16)], [new SymCat(0, 17)], [new SymCat(0, 18)], [new SymCat(0, 19)], [new SymCat(0, 20)], [new SymCat(0, 21)], [new SymCat(0, 22)], [new SymCat(0, 23)], [new SymCat(0, 24)], [new SymCat(0, 25)], [new SymCat(0, 26)], [new SymCat(0, 27)], [new SymCat(0, 28)], [new SymCat(0, 29)], [new SymCat(0, 30)], [new SymCat(0, 31)], [new SymCat(0, 32)], [new SymCat(0, 33)], [new SymCat(0, 34)], [new SymCat(0, 35)], [new SymCat(0, 36)], [new SymCat(0, 37)], [new SymCat(0, 38)], [new SymCat(0, 39)], [new SymCat(0, 40)], [new SymCat(0, 41)], [new SymCat(0, 42)], [new SymCat(0, 43)], [new SymCat(0, 44)], [new SymCat(0, 45)], [new SymCat(0, 46)], [new SymCat(0, 47)], [new SymCat(0, 48)], [new SymCat(0, 49)], [new SymCat(0, 50)], [new SymCat(0, 51)], [new SymCat(0, 52)], [new SymCat(0, 53)], [new SymCat(0, 54)], [new SymCat(0, 55)], [new SymCat(0, 56)], [new SymCat(0, 57)], [new SymCat(0, 58)], [new SymCat(0, 59)], [new SymCat(0, 60)], [new SymCat(0, 61)], [new SymCat(0, 62)], [new SymCat(0, 63)], [new SymCat(0, 64)], [new SymCat(0, 65)], [new SymCat(0, 66)], [new SymCat(0, 67)], [new SymCat(0, 68)], [new SymCat(0, 69)], [new SymCat(0, 70)], [new SymCat(0, 71)], [new SymCat(0, 72)], [new SymCat(0, 73)], [new SymCat(0, 74)], [new SymCat(0, 75)], [new SymCat(0, 76)], [new SymCat(0, 77)], [new SymCat(0, 78)], [new SymCat(0, 79)], [new SymCat(0, 80)], [new SymCat(0, 81)], [new SymCat(0, 82)], [new SymCat(0, 83)], [new SymCat(0, 84)], [new SymCat(0, 85)], [new SymCat(0, 86)], [new SymCat(0, 87)], [new SymCat(0, 88)], [new SymCat(0, 89)], [new SymCat(0, 90)], [new SymCat(0, 91)], [new SymCat(0, 92)], [new SymCat(0, 93)], [new SymCat(0, 94)], [new SymCat(0, 95)], [new SymCat(0, 96)], [new SymCat(0, 97)], [new SymCat(0, 98)], [new SymCat(0, 99)], [new SymCat(0, 100)], [new SymCat(0, 101)], [new SymCat(0, 102)], [new SymCat(0, 103)], [new SymCat(0, 104)], [new SymCat(0, 105)], [new SymCat(0, 106)], [new SymCat(0, 107)], [new SymCat(0, 108)], [new SymCat(0, 109)], [new SymCat(0, 110)], [new SymCat(0, 111)], [new SymCat(0, 112)], [new SymCat(0, 113)], [new SymCat(0, 114)], [new SymCat(0, 115)], [new SymCat(0, 116)], [new SymCat(0, 117)], [new SymCat(0, 118)], [new SymCat(0, 119)], [new SymCat(0, 120)], [new SymCat(0, 121)], [new SymCat(0, 122)], [new SymCat(0, 123)], [new SymCat(0, 124)], [new SymCat(0, 125)], [new SymCat(0, 126)], [new SymCat(0, 127)], [new SymCat(0, 128)], [new SymCat(0, 129)], [new SymCat(0, 130)], [new SymCat(0, 131)], [new SymCat(0, 132)], [new SymCat(0, 133)], [new SymCat(0, 134)], [new SymCat(0, 135)], [new SymCat(0, 136)], [new SymCat(0, 137)], [new SymCat(0, 138)], [new SymCat(0, 139)], [new SymCat(0, 140)], [new SymCat(0, 141)], [new SymCat(0, 142)], [new SymCat(0, 143)], [new SymCat(0, 144)], [new SymCat(0, 145)], [new SymCat(0, 146)], [new SymCat(0, 147)], [new SymCat(0, 148)], [new SymCat(0, 149)], [new SymCat(0, 150)], [new SymCat(0, 151)], [new SymCat(0, 152)], [new SymCat(0, 153)], [new SymCat(0, 154)], [new SymCat(0, 155)], [new SymCat(0, 156)], [new SymCat(0, 157)], [new SymCat(0, 158)], [new SymCat(0, 159)], [new SymCat(0, 160)], [new SymCat(0, 161)], [new SymCat(0, 162)], [new SymCat(0, 163)], [new SymCat(0, 164)], [new SymCat(0, 165)], [new SymCat(0, 166)], [new SymCat(0, 167)], [new SymCat(0, 168)], [new SymCat(0, 169)], [new SymCat(0, 170)], [new SymCat(0, 171)], [new SymCat(0, 172)], [new SymCat(0, 173)], [new SymCat(0, 174)], [new SymCat(0, 175)], [new SymCat(0, 176)], [new SymCat(0, 177)], [new SymCat(0, 178)], [new SymCat(0, 179)], [new SymCat(0, 180)], [new SymCat(0, 181)], [new SymCat(0, 182)], [new SymCat(0, 183)], [new SymCat(0, 184)], [new SymCat(0, 185)], [new SymCat(0, 186)], [new SymCat(0, 187)], [new SymCat(0, 188)], [new SymCat(0, 189)], [new SymCat(0, 190)], [new SymCat(0, 191)], [new SymCat(0, 192)], [new SymCat(0, 193)], [new SymCat(0, 194)], [new SymCat(0, 195)], [new SymCat(0, 196)], [new SymCat(0, 197)], [new SymCat(0, 198)], [new SymCat(0, 199)], [new SymCat(0, 200)], [new SymCat(0, 201)], [new SymCat(0, 202)], [new SymCat(0, 203), new SymCat(1, 0)], [new SymCat(0, 204), new SymCat(1, 0)], [new SymCat(0, 205), new SymCat(1, 0)], [new SymCat(0, 206), new SymCat(1, 0)], [new SymCat(0, 207), new SymCat(1, 0)], [new SymCat(0, 208), new SymCat(1, 0)], [new SymCat(0, 209), new SymCat(1, 0)], [new SymCat(0, 210), new SymCat(1, 0)], [new SymKS("that"), new SymCat(1, 0)], [new SymKS("to"), new SymCat(1, 192), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 203), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 193), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 204), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 194), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 205), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 195), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 206), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 196), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 207), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 197), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 208), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 198), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 209), new SymCat(1, 200)], [new SymKS("to"), new SymCat(1, 199), new SymCat(1, 201), new SymCat(1, 202), new SymCat(1, 210), new SymCat(1, 200)], [new SymCat(1, 0)], [new SymCat(1, 1)], [new SymCat(1, 2)], [new SymCat(1, 3)], [new SymCat(1, 4)], [new SymCat(1, 5)], [new SymCat(1, 6)], [new SymCat(1, 7)], [new SymCat(0, 4), new SymCat(1, 1)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 0)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 1)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 2)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 3)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 4)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 5)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 6)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(2, 7)], [new SymCat(0, 4), new SymCat(1, 1), new SymCat(0, 5), new SymCat(2, 1)]], { A: { s: 0, e: 0 }, A2: { s: 1, e: 1 }, AP: { s: 2, e: 3 }, AdA: { s: 4, e: 4 }, AdN: { s: 5, e: 5 }, AdV: { s: 6, e: 6 }, Adv: { s: 7, e: 7 }, Adverb: { s: 8, e: 8 }, Ant: { s: 9, e: 10 }, CAdv: { s: 11, e: 11 }, CN: { s: 12, e: 14 }, Card: { s: 15, e: 16 }, Cl: { s: 17, e: 17 }, ClSlash: { s: 18, e: 18 }, Comp: { s: 19, e: 19 }, Conj: { s: 20, e: 21 }, DAP: { s: 22, e: 23 }, Det: { s: 24, e: 27 }, Digits: { s: 28, e: 33 }, Float: { s: -3, e: -3 }, GraspV: { s: 34, e: 35 }, GraspVQ: { s: 36, e: 39 }, GraspVS: { s: 40, e: 43 }, GraspVV: { s: 44, e: 49 }, IAdv: { s: 50, e: 50 }, IComp: { s: 51, e: 51 }, IDet: { s: 52, e: 53 }, IP: { s: 54, e: 55 }, IQuant: { s: 56, e: 56 }, Imp: { s: 57, e: 57 }, Int: { s: -2, e: -2 }, Interj: { s: 58, e: 58 }, N: { s: 59, e: 61 }, N2: { s: 62, e: 64 }, N3: { s: 65, e: 67 }, NP: { s: 68, e: 77 }, Num: { s: 78, e: 81 }, Numeral: { s: 82, e: 83 }, Ord: { s: 84, e: 84 }, PConj: { s: 85, e: 85 }, PN: { s: 86, e: 88 }, Phr: { s: 89, e: 89 }, Pol: { s: 90, e: 92 }, Predet: { s: 93, e: 93 }, Prep: { s: 94, e: 95 }, Pron: { s: 96, e: 105 }, QCl: { s: 106, e: 106 }, QS: { s: 107, e: 107 }, Quant: { s: 108, e: 108 }, RCl: { s: 109, e: 112 }, RP: { s: 113, e: 123 }, RS: { s: 124, e: 127 }, S: { s: 128, e: 128 }, SC: { s: 129, e: 129 }, SSlash: { s: 130, e: 130 }, Start: { s: 131, e: 131 }, String: { s: -1, e: -1 }, Subj: { s: 132, e: 132 }, Temp: { s: 133, e: 140 }, Tense: { s: 141, e: 144 }, Text: { s: 145, e: 145 }, Utt: { s: 146, e: 146 }, V: { s: 147, e: 148 }, V2: { s: 149, e: 150 }, V2A: { s: 151, e: 152 }, V2Q: { s: 153, e: 154 }, V2S: { s: 155, e: 156 }, V2V: { s: 157, e: 162 }, V3: { s: 163, e: 164 }, VA: { s: 165, e: 166 }, VP: { s: 167, e: 168 }, VPSlash: { s: 169, e: 172 }, VQ: { s: 173, e: 174 }, VS: { s: 175, e: 176 }, VV: { s: 177, e: 179 }, Voc: { s: 180, e: 180 } }, 195), GraspGer: new GFConcrete({}, { 0: [new Apply(179, []), new Apply(180, []), new Apply(181, []), new Apply(182, []), new Apply(183, []), new Apply(184, []), new Apply(185, []), new Apply(186, []), new Apply(187, []), new Apply(188, []), new Apply(189, []), new Apply(190, []), new Apply(191, []), new Apply(192, [])], 20: [new Apply(193, [new PArg(21), new PArg(20)]), new Apply(194, [new PArg(0)])], 21: [new Apply(195, []), new Apply(196, []), new Apply(197, [])], 24: [new Apply(198, [new PArg(145440), new PArg(145406)]), new Apply(199, [new PArg(145441), new PArg(145406)]), new Apply(200, [new PArg(145445), new PArg(145406)]), new Apply(201, [new PArg(145447), new PArg(145406)]), new Apply(202, [new PArg(25)])], 25: [new Apply(203, []), new Apply(204, []), new Apply(205, []), new Apply(206, []), new Apply(207, [])], 29: [new Apply(208, [new PArg(20), new PArg(29)]), new Apply(209, [new PArg(132916)])], 30: [new Apply(209, [new PArg(132917)]), new Apply(210, [new PArg(20), new PArg(30)])], 31: [new Apply(209, [new PArg(132918)]), new Apply(211, [new PArg(20), new PArg(31)])], 34: [new Apply(212, [new PArg(145351), new PArg(145402)]), new Apply(213, [new PArg(145351), new PArg(145403)]), new Apply(214, [new PArg(145351), new PArg(145404)]), new Apply(215, [new PArg(145353), new PArg(145402)]), new Apply(216, [new PArg(145353), new PArg(145403)]), new Apply(217, [new PArg(145353), new PArg(145404)]), new Apply(218, [new PArg(145356), new PArg(145402)]), new Apply(219, [new PArg(145356), new PArg(145403)]), new Apply(220, [new PArg(145356), new PArg(145404)]), new Apply(221, [new PArg(145359), new PArg(145402)]), new Apply(222, [new PArg(145359), new PArg(145403)]), new Apply(223, [new PArg(145359), new PArg(145404)]), new Apply(224, [new PArg(145360), new PArg(145402)]), new Apply(225, [new PArg(145360), new PArg(145403)]), new Apply(226, [new PArg(145360), new PArg(145404)]), new Apply(227, [new PArg(145362), new PArg(145402)]), new Apply(228, [new PArg(145362), new PArg(145403)]), new Apply(229, [new PArg(145362), new PArg(145404)]), new Apply(230, [new PArg(145365), new PArg(145402)]), new Apply(231, [new PArg(145365), new PArg(145403)]), new Apply(232, [new PArg(145365), new PArg(145404)]), new Apply(233, [new PArg(145368), new PArg(145402)]), new Apply(234, [new PArg(145368), new PArg(145403)]), new Apply(235, [new PArg(145368), new PArg(145404)])], 54: [new Apply(236, [])], 55: [new Apply(237, [])], 57: [new Apply(238, [new PArg(134063), new PArg(133981)])], 58: [new Apply(239, [])], 60: [new Apply(238, [new PArg(145400), new PArg(133981)])], 61: [new Apply(240, [new PArg(134063), new PArg(133983)])], 64: [new Apply(240, [new PArg(145401), new PArg(133983)])], 123: [new Apply(241, []), new Apply(242, []), new Apply(243, []), new Apply(244, []), new Apply(245, []), new Apply(246, []), new Apply(247, []), new Apply(248, []), new Apply(249, []), new Apply(250, []), new Apply(251, [])], 141: [new Apply(252, [new PArg(148240)]), new Apply(253, [new PArg(151480)]), new Apply(254, []), new Apply(255, [])], 142: [new Apply(256, []), new Apply(257, []), new Apply(258, []), new Apply(259, []), new Apply(260, [])], 159: [new Apply(261, [])], 3381: [new Apply(262, [])], 17637: [new Apply(263, [])], 35781: [new Apply(264, []), new Apply(265, []), new Apply(266, [])], 74661: [new Apply(267, [])], 132907: [new Apply(268, []), new Apply(269, []), new Apply(270, [])], 132911: [new Apply(271, [])], 132916: [new Apply(272, []), new Apply(273, []), new Apply(274, []), new Apply(275, []), new Apply(276, []), new Apply(277, []), new Apply(278, []), new Apply(279, []), new Apply(280, []), new Apply(281, []), new Apply(282, []), new Apply(283, []), new Apply(284, []), new Apply(285, []), new Apply(286, []), new Apply(287, []), new Apply(288, []), new Apply(289, [])], 132917: [new Apply(290, []), new Apply(291, []), new Apply(292, []), new Apply(293, []), new Apply(294, []), new Apply(295, []), new Apply(296, [])], 132918: [new Apply(297, []), new Apply(298, []), new Apply(299, []), new Apply(300, []), new Apply(301, []), new Apply(302, []), new Apply(303, []), new Apply(304, []), new Apply(305, []), new Apply(306, []), new Apply(307, []), new Apply(308, [])], 133945: [new Apply(309, [new PArg(145351), new PArg(24)])], 133947: [new Apply(309, [new PArg(145353), new PArg(24)]), new Apply(310, [new PArg(57), new PArg(29)]), new Apply(311, [new PArg(58), new PArg(29)])], 133950: [new Apply(309, [new PArg(145356), new PArg(24)]), new Apply(312, [new PArg(61), new PArg(29)])], 133953: [new Apply(309, [new PArg(145359), new PArg(24)]), new Apply(313, [new PArg(57), new PArg(30)]), new Apply(314, [new PArg(58), new PArg(30)])], 133954: [new Apply(309, [new PArg(145360), new PArg(24)])], 133956: [new Apply(309, [new PArg(145362), new PArg(24)]), new Apply(315, [new PArg(61), new PArg(30)])], 133959: [new Apply(309, [new PArg(145365), new PArg(24)]), new Apply(316, [new PArg(57), new PArg(31)]), new Apply(317, [new PArg(58), new PArg(31)])], 133962: [new Apply(309, [new PArg(145368), new PArg(24)]), new Apply(318, [new PArg(61), new PArg(31)])], 133963: [new Apply(319, [new PArg(134043)])], 133965: [new Apply(311, [new PArg(60), new PArg(29)]), new Apply(319, [new PArg(134045)]), new Apply(320, [new PArg(133989)])], 133968: [new Apply(321, [new PArg(64), new PArg(29)])], 133971: [new Apply(314, [new PArg(60), new PArg(30)]), new Apply(319, [new PArg(134051)])], 133972: [new Apply(319, [new PArg(134052)])], 133974: [new Apply(319, [new PArg(134054)]), new Apply(322, [new PArg(64), new PArg(30)])], 133977: [new Apply(317, [new PArg(60), new PArg(31)]), new Apply(323, [])], 133980: [new Apply(324, [new PArg(64), new PArg(31)])], 133981: [new Apply(325, [])], 133983: [new Apply(326, [])], 133989: [new Apply(327, []), new Apply(328, []), new Apply(329, []), new Apply(330, []), new Apply(331, []), new Apply(332, []), new Apply(333, []), new Apply(334, []), new Apply(335, [])], 133993: [new Apply(336, [])], 133994: [new Apply(337, [])], 134035: [new Apply(338, [])], 134036: [new Apply(339, [])], 134040: [new Apply(340, [])], 134042: [new Apply(341, [])], 134043: [new Apply(342, [])], 134045: [new Apply(343, [])], 134051: [new Apply(344, [])], 134052: [new Apply(345, [])], 134054: [new Apply(346, [])], 134061: [new Apply(347, [new PArg(34)]), new Apply(348, [new PArg(132907), new PArg(34)]), new Apply(349, [new PArg(132911), new PArg(145448)]), new Apply(349, [new PArg(132911), new PArg(145449)]), new Apply(349, [new PArg(132911), new PArg(145450)])], 134063: [new Apply(350, [])], 134066: [new Apply(351, []), new Apply(352, []), new Apply(353, [])], 134082: [new Apply(354, [new PArg(134104), new PArg(133993), new PArg(34)]), new Apply(355, [new PArg(134108), new PArg(133993), new PArg(34)]), new Apply(356, [new PArg(134105), new PArg(133993), new PArg(34)]), new Apply(357, [new PArg(134104), new PArg(133994), new PArg(34)]), new Apply(358, [new PArg(134108), new PArg(133994), new PArg(34)]), new Apply(359, [new PArg(134105), new PArg(133994), new PArg(34)])], 134102: [new Apply(360, [new PArg(134129)])], 134103: [new Apply(361, []), new Apply(362, []), new Apply(363, [])], 134104: [new Apply(364, [])], 134105: [new Apply(365, [])], 134108: [new Apply(366, [])], 134129: [new Apply(367, [new PArg(134082)])], 138470: [new Apply(368, [new PArg(138470), new PArg(24)]), new Apply(369, [new PArg(145369), new PArg(134082)]), new Apply(370, [new PArg(145452)]), new Apply(371, [new PArg(145452), new PArg(145462)]), new Apply(372, [new PArg(145467), new PArg(145464)]), new Apply(372, [new PArg(145468), new PArg(145466)]), new Apply(373, [new PArg(145484), new PArg(145464)]), new Apply(374, [new PArg(145467), new PArg(145464), new PArg(145462)]), new Apply(374, [new PArg(145468), new PArg(145466), new PArg(145462)]), new Apply(375, [new PArg(145484), new PArg(145464), new PArg(145462)]), new Apply(376, [new PArg(145756), new PArg(145464), new PArg(145736)]), new Apply(376, [new PArg(145757), new PArg(145466), new PArg(145736)]), new Apply(377, [new PArg(145758), new PArg(145464), new PArg(145736)]), new Apply(377, [new PArg(145759), new PArg(145466), new PArg(145736)]), new Apply(378, [new PArg(145917), new PArg(145464), new PArg(145406)])], 138471: [new Apply(368, [new PArg(138471), new PArg(24)]), new Apply(370, [new PArg(145453)]), new Apply(371, [new PArg(145453), new PArg(145462)]), new Apply(372, [new PArg(145495), new PArg(145466)]), new Apply(373, [new PArg(145511), new PArg(145464)]), new Apply(374, [new PArg(145495), new PArg(145466), new PArg(145462)]), new Apply(375, [new PArg(145511), new PArg(145464), new PArg(145462)]), new Apply(377, [new PArg(146002), new PArg(145466), new PArg(145736)]), new Apply(378, [new PArg(146160), new PArg(145464), new PArg(145406)])], 138480: [new Apply(368, [new PArg(138480), new PArg(24)]), new Apply(379, [new PArg(145390), new PArg(145380)])], 145351: [new Coerce(133945), new Coerce(133963)], 145353: [new Coerce(133947), new Coerce(133965)], 145356: [new Coerce(133950), new Coerce(133968)], 145359: [new Coerce(133953), new Coerce(133971)], 145360: [new Coerce(133954), new Coerce(133972)], 145362: [new Coerce(133956), new Coerce(133974)], 145365: [new Coerce(133959), new Coerce(133977)], 145368: [new Coerce(133962), new Coerce(133980)], 145369: [new Coerce(35781)], 145380: [new Coerce(138470), new Coerce(138471), new Coerce(138480)], 145390: [new Coerce(74661)], 145400: [new Coerce(134066)], 145401: [new Coerce(134066)], 145402: [new Coerce(138470)], 145403: [new Coerce(138471)], 145404: [new Coerce(138480)], 145406: [new Coerce(133945), new Coerce(133947), new Coerce(133950), new Coerce(133953), new Coerce(133954), new Coerce(133956), new Coerce(133959), new Coerce(133962), new Coerce(133963), new Coerce(133965), new Coerce(133968), new Coerce(133971), new Coerce(133972), new Coerce(133974), new Coerce(133977), new Coerce(133980)], 145440: [new Coerce(134035)], 145441: [new Coerce(134036)], 145445: [new Coerce(134040)], 145447: [new Coerce(134042)], 145448: [new Coerce(138470)], 145449: [new Coerce(138471)], 145450: [new Coerce(138480)], 145452: [new Coerce(123), new Coerce(141), new Coerce(159)], 145453: [new Coerce(142)], 145462: [new Coerce(20)], 145464: [new Coerce(133963), new Coerce(133965), new Coerce(133968), new Coerce(133971), new Coerce(133972), new Coerce(133974), new Coerce(133977), new Coerce(133980)], 145466: [new Coerce(133945), new Coerce(133947), new Coerce(133950), new Coerce(133953), new Coerce(133954), new Coerce(133956), new Coerce(133959), new Coerce(133962)], 145467: [new Coerce(123), new Coerce(159)], 145468: [new Coerce(123), new Coerce(141), new Coerce(159)], 145484: [new Coerce(141)], 145495: [new Coerce(142)], 145511: [new Coerce(142)], 145736: [new Coerce(133945), new Coerce(133947), new Coerce(133950), new Coerce(133953), new Coerce(133954), new Coerce(133956), new Coerce(133959), new Coerce(133962), new Coerce(133963), new Coerce(133965), new Coerce(133968), new Coerce(133971), new Coerce(133972), new Coerce(133974), new Coerce(133977), new Coerce(133980)], 145756: [new Coerce(123)], 145757: [new Coerce(123)], 145758: [new Coerce(159)], 145759: [new Coerce(141), new Coerce(159)], 145917: [new Coerce(141)], 146002: [new Coerce(142)], 146160: [new Coerce(142)], 148240: [new Coerce(35781)], 151480: [new Coerce(74661)] }, [new CncFun("'lindef A'", [0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef A2'", []), new CncFun("'lindef AP'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef AdA'", [0]), new CncFun("'lindef AdN'", []), new CncFun("'lindef AdV'", []), new CncFun("'lindef Adv'", [0]), new CncFun("'lindef Adverb'", [0]), new CncFun("'lindef Ant'", []), new CncFun("'lindef CAdv'", []), new CncFun("'lindef CN'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef Card'", []), new CncFun("'lindef Cl'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef ClSlash'", []), new CncFun("'lindef Comp'", []), new CncFun("'lindef Conj'", []), new CncFun("'lindef DAP'", []), new CncFun("'lindef Det'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef Digits'", []), new CncFun("'lindef GraspV'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef GraspVQ'", []), new CncFun("'lindef GraspVS'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef GraspVV'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef IAdv'", []), new CncFun("'lindef IComp'", []), new CncFun("'lindef IDet'", []), new CncFun("'lindef IP'", []), new CncFun("'lindef IQuant'", []), new CncFun("'lindef Imp'", []), new CncFun("'lindef Interj'", []), new CncFun("'lindef N'", [0, 0, 0, 0, 0, 0]), new CncFun("'lindef N2'", []), new CncFun("'lindef N3'", []), new CncFun("'lindef NP'", [0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef Num'", [0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef Numeral'", []), new CncFun("'lindef Ord'", []), new CncFun("'lindef PConj'", []), new CncFun("'lindef PN'", [0, 0, 0]), new CncFun("'lindef Phr'", []), new CncFun("'lindef Pol'", [0]), new CncFun("'lindef Predet'", []), new CncFun("'lindef Prep'", [0, 0]), new CncFun("'lindef Pron'", [0, 0, 0]), new CncFun("'lindef QCl'", []), new CncFun("'lindef QS'", []), new CncFun("'lindef Quant'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef RCl'", []), new CncFun("'lindef RP'", []), new CncFun("'lindef RS'", []), new CncFun("'lindef S'", [0, 0]), new CncFun("'lindef SC'", []), new CncFun("'lindef SSlash'", []), new CncFun("'lindef Start'", [0]), new CncFun("'lindef Subj'", []), new CncFun("'lindef Temp'", [0]), new CncFun("'lindef Tense'", []), new CncFun("'lindef Text'", []), new CncFun("'lindef Utt'", [0]), new CncFun("'lindef V'", []), new CncFun("'lindef V2'", []), new CncFun("'lindef V2A'", []), new CncFun("'lindef V2Q'", []), new CncFun("'lindef V2S'", []), new CncFun("'lindef V2V'", []), new CncFun("'lindef V3'", []), new CncFun("'lindef VA'", []), new CncFun("'lindef VP'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef VPSlash'", []), new CncFun("'lindef VQ'", []), new CncFun("'lindef VS'", []), new CncFun("'lindef VV'", []), new CncFun("'lindef Voc'", []), new CncFun("'lindef A'", [1]), new CncFun("'lindef A2'", [2]), new CncFun("'lindef AP'", [1]), new CncFun("'lindef AdA'", [1]), new CncFun("'lindef AdN'", [2]), new CncFun("'lindef AdV'", [2]), new CncFun("'lindef Adv'", [1]), new CncFun("'lindef Adverb'", [1]), new CncFun("'lindef Ant'", [2]), new CncFun("'lindef CAdv'", [2]), new CncFun("'lindef CN'", [1]), new CncFun("'lindef Card'", [2]), new CncFun("'lindef Cl'", [1]), new CncFun("'lindef ClSlash'", [3]), new CncFun("'lindef Comp'", [2]), new CncFun("'lindef Conj'", [3]), new CncFun("'lindef DAP'", [2]), new CncFun("'lindef Det'", [1]), new CncFun("'lindef Digits'", [2]), new CncFun("'lindef GraspV'", [1]), new CncFun("'lindef GraspVQ'", [2]), new CncFun("'lindef GraspVS'", [1]), new CncFun("'lindef GraspVV'", [1]), new CncFun("'lindef IAdv'", [2]), new CncFun("'lindef IComp'", [2]), new CncFun("'lindef IDet'", [2]), new CncFun("'lindef IP'", [2]), new CncFun("'lindef IQuant'", [2]), new CncFun("'lindef Imp'", [2]), new CncFun("'lindef Interj'", [2]), new CncFun("'lindef N'", [1]), new CncFun("'lindef N2'", [2]), new CncFun("'lindef N3'", [2]), new CncFun("'lindef NP'", [1]), new CncFun("'lindef Num'", [1]), new CncFun("'lindef Numeral'", [2]), new CncFun("'lindef Ord'", [2]), new CncFun("'lindef PConj'", [2]), new CncFun("'lindef PN'", [1]), new CncFun("'lindef Phr'", [2]), new CncFun("'lindef Pol'", [1]), new CncFun("'lindef Predet'", [2]), new CncFun("'lindef Prep'", [1]), new CncFun("'lindef Pron'", [1]), new CncFun("'lindef QCl'", [2]), new CncFun("'lindef QS'", [2]), new CncFun("'lindef Quant'", [1]), new CncFun("'lindef RCl'", [2]), new CncFun("'lindef RP'", [2]), new CncFun("'lindef RS'", [2]), new CncFun("'lindef S'", [1]), new CncFun("'lindef SC'", [2]), new CncFun("'lindef SSlash'", [3]), new CncFun("'lindef Start'", [1]), new CncFun("'lindef Subj'", [2]), new CncFun("'lindef Temp'", [1]), new CncFun("'lindef Tense'", [2]), new CncFun("'lindef Text'", [2]), new CncFun("'lindef Utt'", [1]), new CncFun("'lindef V'", [3]), new CncFun("'lindef V'", [4]), new CncFun("'lindef V'", [5]), new CncFun("'lindef V'", [6]), new CncFun("'lindef V2'", [7]), new CncFun("'lindef V2'", [8]), new CncFun("'lindef V2'", [9]), new CncFun("'lindef V2'", [10]), new CncFun("'lindef V2A'", [7]), new CncFun("'lindef V2A'", [8]), new CncFun("'lindef V2A'", [9]), new CncFun("'lindef V2A'", [10]), new CncFun("'lindef V2Q'", [7]), new CncFun("'lindef V2Q'", [8]), new CncFun("'lindef V2Q'", [9]), new CncFun("'lindef V2Q'", [10]), new CncFun("'lindef V2S'", [7]), new CncFun("'lindef V2S'", [8]), new CncFun("'lindef V2S'", [9]), new CncFun("'lindef V2S'", [10]), new CncFun("'lindef V2V'", [7]), new CncFun("'lindef V2V'", [8]), new CncFun("'lindef V2V'", [9]), new CncFun("'lindef V2V'", [10]), new CncFun("'lindef V3'", [11]), new CncFun("'lindef V3'", [12]), new CncFun("'lindef V3'", [13]), new CncFun("'lindef V3'", [14]), new CncFun("'lindef VA'", [3]), new CncFun("'lindef VA'", [4]), new CncFun("'lindef VA'", [5]), new CncFun("'lindef VA'", [6]), new CncFun("'lindef VP'", [15]), new CncFun("'lindef VPSlash'", [16]), new CncFun("'lindef VQ'", [3]), new CncFun("'lindef VQ'", [4]), new CncFun("'lindef VQ'", [5]), new CncFun("'lindef VQ'", [6]), new CncFun("'lindef VS'", [3]), new CncFun("'lindef VS'", [4]), new CncFun("'lindef VS'", [5]), new CncFun("'lindef VS'", [6]), new CncFun("'lindef VV'", [3]), new CncFun("'lindef VV'", [4]), new CncFun("'lindef VV'", [5]), new CncFun("'lindef VV'", [6]), new CncFun("'lindef Voc'", [2]), new CncFun("big_A", [17, 18, 19, 20, 20, 21, 21, 20, 20]), new CncFun("black_A", [22, 23, 24, 25, 25, 26, 26, 25, 25]), new CncFun("blue_A", [27, 28, 29, 30, 30, 31, 31, 30, 30]), new CncFun("default_A", [32, 33, 34, 35, 35, 36, 36, 35, 35]), new CncFun("green_A", [37, 38, 39, 40, 40, 41, 41, 40, 40]), new CncFun("heavy_A", [42, 43, 44, 45, 45, 46, 46, 45, 45]), new CncFun("long_A", [47, 48, 49, 50, 50, 51, 51, 50, 50]), new CncFun("red_A", [52, 53, 54, 55, 55, 56, 56, 55, 55]), new CncFun("short_A", [57, 58, 59, 60, 60, 61, 61, 60, 60]), new CncFun("small_A", [62, 63, 64, 65, 65, 66, 66, 65, 65]), new CncFun("thick_A", [67, 68, 69, 70, 70, 71, 71, 70, 70]), new CncFun("thin_A", [72, 73, 74, 75, 75, 76, 76, 75, 75]), new CncFun("white_A", [77, 78, 79, 80, 80, 81, 81, 80, 80]), new CncFun("yellow_A", [82, 83, 84, 85, 85, 86, 86, 85, 85]), new CncFun("AdAP", [87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98]), new CncFun("UseA", [1, 99, 100, 101, 102, 103, 104, 105, 106, 107, 107, 107]), new CncFun("so_AdA", [108]), new CncFun("too_AdA", [109]), new CncFun("very_AdA", [110]), new CncFun("PrepNP", [111]), new CncFun("PrepNP", [112]), new CncFun("PrepNP", [113]), new CncFun("PrepNP", [114]), new CncFun("UseAdverb", [1]), new CncFun("everywhere_Adverb", [115]), new CncFun("here_Adverb", [116]), new CncFun("somewhere_Adverb", [117]), new CncFun("there_Adverb", [118]), new CncFun("there_Adverb", [119]), new CncFun("ModCN", [120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 97, 98, 130, 131]), new CncFun("UseN", [1, 99, 101, 102, 1, 99, 100, 101, 102, 103, 107, 107, 107, 107]), new CncFun("ModCN", [132, 133, 122, 123, 124, 134, 126, 127, 128, 129, 97, 98, 130, 131]), new CncFun("ModCN", [135, 136, 122, 123, 124, 134, 126, 127, 128, 129, 97, 98, 130, 131]), new CncFun("PredVP", [137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148]), new CncFun("PredVP", [137, 138, 139, 140, 149, 150, 151, 152, 145, 146, 147, 148]), new CncFun("PredVP", [137, 138, 139, 140, 153, 154, 155, 156, 145, 146, 147, 148]), new CncFun("PredVP", [157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168]), new CncFun("PredVP", [157, 158, 159, 160, 169, 170, 171, 172, 165, 166, 167, 168]), new CncFun("PredVP", [157, 158, 159, 160, 173, 174, 175, 176, 165, 166, 167, 168]), new CncFun("PredVP", [177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188]), new CncFun("PredVP", [177, 178, 179, 180, 189, 190, 191, 192, 185, 186, 187, 188]), new CncFun("PredVP", [177, 178, 179, 180, 193, 194, 195, 196, 185, 186, 187, 188]), new CncFun("PredVP", [197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208]), new CncFun("PredVP", [197, 198, 199, 200, 209, 210, 211, 212, 205, 206, 207, 208]), new CncFun("PredVP", [197, 198, 199, 200, 213, 214, 215, 216, 205, 206, 207, 208]), new CncFun("PredVP", [217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228]), new CncFun("PredVP", [217, 218, 219, 220, 229, 230, 231, 232, 225, 226, 227, 228]), new CncFun("PredVP", [217, 218, 219, 220, 233, 234, 235, 236, 225, 226, 227, 228]), new CncFun("PredVP", [237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248]), new CncFun("PredVP", [237, 238, 239, 240, 249, 250, 251, 252, 245, 246, 247, 248]), new CncFun("PredVP", [237, 238, 239, 240, 253, 254, 255, 256, 245, 246, 247, 248]), new CncFun("PredVP", [257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268]), new CncFun("PredVP", [257, 258, 259, 260, 269, 270, 271, 272, 265, 266, 267, 268]), new CncFun("PredVP", [257, 258, 259, 260, 273, 274, 275, 276, 265, 266, 267, 268]), new CncFun("PredVP", [277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288]), new CncFun("PredVP", [277, 278, 279, 280, 289, 290, 291, 292, 285, 286, 287, 288]), new CncFun("PredVP", [277, 278, 279, 280, 293, 294, 295, 296, 285, 286, 287, 288]), new CncFun("or_Conj", []), new CncFun("and_Conj", []), new CncFun("DetQuant", [87, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310]), new CncFun("every_Det", [311, 312, 313, 314, 315, 316, 316, 311, 317, 318, 319, 319, 313, 314, 315]), new CncFun("DetQuant", [320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334]), new CncFun("break_V", [335, 336, 337, 335, 335, 338, 338, 339, 339, 336, 337, 335, 335, 338, 338, 339, 339, 335, 107, 107, 107, 107, 107, 107]), new CncFun("buy_V", [340, 341, 342, 340, 340, 343, 343, 344, 344, 341, 342, 340, 340, 343, 343, 344, 344, 345, 107, 107, 107, 107, 107, 107]), new CncFun("drink_V", [346, 347, 348, 346, 346, 349, 349, 350, 350, 347, 348, 346, 346, 349, 349, 350, 350, 351, 107, 107, 107, 107, 107, 107]), new CncFun("eat_V", [352, 353, 354, 352, 352, 355, 355, 356, 356, 353, 354, 352, 352, 355, 355, 356, 356, 357, 107, 107, 107, 107, 107, 107]), new CncFun("hate_V", [358, 359, 360, 358, 358, 361, 361, 362, 362, 359, 360, 358, 358, 361, 361, 362, 362, 363, 107, 107, 107, 107, 107, 107]), new CncFun("hear_V", [364, 365, 366, 364, 364, 367, 367, 368, 368, 365, 366, 364, 364, 367, 367, 368, 368, 369, 107, 107, 107, 107, 107, 107]), new CncFun("hunt_V", [370, 371, 372, 370, 370, 373, 373, 374, 374, 371, 372, 370, 370, 373, 373, 374, 374, 375, 107, 107, 107, 107, 107, 107]), new CncFun("like_V", [376, 377, 377, 376, 376, 378, 378, 379, 379, 377, 377, 376, 376, 378, 378, 379, 379, 380, 107, 107, 107, 107, 107, 107]), new CncFun("see_V", [381, 382, 383, 381, 381, 384, 384, 385, 385, 382, 383, 381, 381, 384, 384, 385, 385, 386, 107, 107, 107, 107, 107, 107]), new CncFun("throw_V", [387, 388, 389, 387, 387, 390, 390, 391, 391, 388, 389, 387, 387, 390, 390, 391, 391, 392, 107, 107, 107, 107, 107, 107]), new CncFun("watch_V", [393, 394, 395, 396, 396, 397, 397, 398, 398, 399, 400, 393, 393, 401, 401, 402, 402, 403, 107, 107, 107, 107, 107, 404]), new CncFun("VerbVS", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419]), new CncFun("VerbVV", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419]), new CncFun("sit_V", [420, 421, 422, 420, 420, 423, 423, 424, 424, 421, 422, 420, 420, 423, 423, 424, 424, 425, 107, 107, 107, 107, 107, 107]), new CncFun("sleep_V", [426, 427, 428, 426, 426, 429, 429, 430, 430, 427, 428, 426, 426, 429, 429, 430, 430, 431, 107, 107, 107, 107, 107, 107]), new CncFun("copula", [432, 433, 434, 435, 435, 436, 436, 437, 437, 433, 434, 435, 435, 436, 436, 437, 437, 438, 107, 107, 107, 107, 107, 107]), new CncFun("fly_V", [439, 440, 441, 439, 439, 442, 442, 443, 443, 440, 441, 439, 439, 442, 442, 443, 443, 444, 107, 107, 107, 107, 107, 107]), new CncFun("run_V", [445, 446, 447, 445, 445, 448, 448, 449, 449, 446, 447, 445, 445, 448, 448, 449, 449, 450, 107, 107, 107, 107, 107, 107]), new CncFun("swim_V", [451, 452, 453, 451, 451, 454, 454, 455, 455, 452, 453, 451, 451, 454, 454, 455, 455, 456, 107, 107, 107, 107, 107, 107]), new CncFun("walk_V", [457, 458, 459, 457, 457, 460, 460, 461, 461, 458, 459, 457, 457, 460, 460, 461, 461, 462, 107, 107, 107, 107, 107, 107]), new CncFun("listen_V", [463, 365, 366, 364, 364, 367, 367, 368, 368, 464, 465, 463, 463, 466, 466, 467, 467, 468, 107, 107, 107, 107, 107, 109]), new CncFun("know_VQ", []), new CncFun("wonder_VQ", []), new CncFun("hope_VS", [469, 470, 471, 469, 469, 472, 472, 473, 473, 470, 471, 469, 469, 472, 472, 473, 473, 474, 107, 107, 107, 107, 107, 107, 469, 470, 471, 469, 469, 472, 472, 473, 473, 470, 471, 469, 469, 472, 472, 473, 473, 474, 107, 107]), new CncFun("know_VS", [475, 77, 77, 475, 475, 476, 476, 477, 477, 77, 77, 475, 475, 476, 476, 477, 477, 478, 107, 107, 107, 107, 107, 107, 475, 77, 77, 475, 475, 476, 476, 477, 477, 77, 77, 475, 475, 476, 476, 477, 477, 478, 107, 107]), new CncFun("say_VS", [479, 480, 481, 479, 479, 482, 482, 483, 483, 480, 481, 479, 479, 482, 482, 483, 483, 484, 107, 107, 107, 107, 107, 107, 479, 480, 481, 479, 479, 482, 482, 483, 483, 480, 481, 479, 479, 482, 482, 483, 483, 484, 107, 107]), new CncFun("want_VV", [485, 486, 486, 485, 485, 487, 487, 488, 488, 486, 486, 485, 485, 487, 487, 488, 488, 489, 107, 107, 107, 107, 107, 107, 485, 486, 486, 485, 485, 487, 487, 488, 488, 486, 486, 485, 485, 487, 487, 488, 488, 489, 107, 107]), new CncFun("when_IAdv", []), new CncFun("where_IAdv", []), new CncFun("why_IAdv", []), new CncFun("whoSg_IP", []), new CncFun("apple_N", [490, 490, 490, 491, 491, 492]), new CncFun("bird_N", [493, 493, 493, 494, 494, 495]), new CncFun("boy_N", [496, 497, 497, 497, 497, 497]), new CncFun("car_N", [498, 498, 498, 498, 498, 498]), new CncFun("chair_N", [499, 499, 499, 500, 500, 501]), new CncFun("default_N", [502, 502, 502, 503, 503, 504]), new CncFun("dog_N", [505, 505, 505, 506, 506, 507]), new CncFun("fish_N", [508, 508, 508, 509, 509, 510]), new CncFun("foot_N", [511, 511, 511, 512, 512, 513]), new CncFun("forest_N", [514, 514, 514, 515, 515, 516]), new CncFun("hat_N", [517, 517, 517, 518, 518, 519]), new CncFun("head_N", [520, 520, 520, 521, 521, 522]), new CncFun("man_N", [523, 523, 523, 524, 524, 525]), new CncFun("shoe_N", [526, 526, 526, 527, 527, 528]), new CncFun("stone_N", [529, 529, 529, 530, 530, 531]), new CncFun("table_N", [532, 532, 532, 533, 533, 534]), new CncFun("tree_N", [535, 535, 535, 536, 536, 537]), new CncFun("wine_N", [538, 538, 538, 539, 539, 540]), new CncFun("cat_N", [541, 541, 541, 542, 542, 542]), new CncFun("cow_N", [543, 543, 543, 544, 544, 545]), new CncFun("fruit_N", [546, 546, 546, 547, 547, 548]), new CncFun("hand_N", [549, 549, 549, 550, 550, 551]), new CncFun("milk_N", [552, 552, 552, 553, 553, 554]), new CncFun("person_N", [555, 555, 555, 556, 556, 556]), new CncFun("woman_N", [557, 557, 557, 558, 558, 558]), new CncFun("animal_N", [559, 559, 559, 560, 560, 561]), new CncFun("beer_N", [562, 562, 562, 563, 563, 564]), new CncFun("bike_N", [565, 565, 565, 566, 566, 567]), new CncFun("boat_N", [568, 568, 568, 569, 569, 570]), new CncFun("book_N", [571, 571, 571, 572, 572, 573]), new CncFun("car_N", [574, 574, 574, 575, 575, 575]), new CncFun("girl_N", [576, 576, 576, 576, 576, 576]), new CncFun("hair_N", [577, 577, 577, 578, 578, 579]), new CncFun("horse_N", [580, 580, 580, 581, 581, 582]), new CncFun("house_N", [583, 583, 583, 584, 584, 585]), new CncFun("shirt_N", [586, 586, 586, 587, 587, 587]), new CncFun("water_N", [588, 588, 588, 588, 588, 589]), new CncFun("AdvNP", [1, 99, 100, 101, 102, 590, 104, 105]), new CncFun("DetCN", [87, 297, 591, 592, 593, 97, 98, 130]), new CncFun("DetCN", [91, 594, 591, 592, 593, 97, 98, 130]), new CncFun("DetCN", [89, 595, 596, 597, 598, 97, 98, 131]), new CncFun("DetCN", [590, 599, 600, 601, 602, 97, 98, 130]), new CncFun("DetCN", [603, 604, 600, 601, 602, 97, 98, 130]), new CncFun("DetCN", [605, 606, 607, 608, 609, 97, 98, 131]), new CncFun("DetCN", [610, 611, 612, 613, 614, 97, 98, 130]), new CncFun("DetCN", [615, 616, 612, 613, 614, 97, 98, 130]), new CncFun("DetCN", [617, 618, 619, 620, 621, 97, 98, 131]), new CncFun("UsePron", [1, 99, 100, 622, 623, 107, 107, 107]), new CncFun("UsePN", [1, 99, 100, 622, 623, 107, 107, 107]), new CncFun("DetCN", [94, 624, 596, 597, 598, 97, 98, 131]), new CncFun("DetCN", [625, 626, 607, 608, 609, 97, 98, 131]), new CncFun("default_NP", [627, 627, 627, 628, 629, 107, 107, 107]), new CncFun("DetCN", [630, 631, 619, 620, 621, 97, 98, 131]), new CncFun("NumSg", [107, 107, 107, 107, 107, 107, 107, 107, 107]), new CncFun("NumPl", [107, 107, 107, 107, 107, 107, 107, 107, 107]), new CncFun("berlin_PN", [632, 632, 632]), new CncFun("britain_PN", [633, 633, 633]), new CncFun("default_PN", [634, 634, 634]), new CncFun("germany_PN", [635, 635, 635]), new CncFun("gothenburg_PN", [636, 636, 636]), new CncFun("john_PN", [637, 637, 637]), new CncFun("london_PN", [638, 638, 638]), new CncFun("mary_PN", [639, 639, 639]), new CncFun("sweden_PN", [640, 640, 640]), new CncFun("Pos", [107]), new CncFun("Neg", [107]), new CncFun("by8agent_Prep", [641, 107]), new CncFun("with_Prep", [642, 107]), new CncFun("in_Prep", [107, 107]), new CncFun("possess_Prep", [107, 107]), new CncFun("i_Pron", [643, 644, 645]), new CncFun("he_Pron", [646, 647, 648]), new CncFun("she_Pron", [649, 649, 650]), new CncFun("we_Pron", [651, 652, 652]), new CncFun("they_Pron", [649, 649, 653]), new CncFun("QuestCl", []), new CncFun("QuestIAdv", []), new CncFun("QuestVP", []), new CncFun("IndefArt", [654, 655, 656, 657, 658, 659, 659, 660, 661, 662, 654, 654, 656, 657, 658, 107, 107, 107, 663, 664, 107, 107, 107, 663, 664, 107, 107, 107, 663, 664]), new CncFun("DefArt", [665, 666, 667, 668, 669, 670, 670, 665, 671, 672, 673, 673, 667, 668, 669, 670, 670, 666, 674, 675, 670, 670, 666, 674, 675, 670, 670, 666, 674, 675]), new CncFun("that_Quant", [676, 677, 678, 679, 680, 681, 681, 676, 682, 683, 684, 684, 678, 679, 680, 681, 681, 677, 685, 686, 681, 681, 677, 685, 686, 681, 681, 677, 685, 686]), new CncFun("this_Quant", [687, 688, 689, 690, 691, 692, 692, 687, 693, 694, 695, 695, 689, 690, 691, 692, 692, 688, 696, 697, 692, 692, 688, 696, 697, 692, 692, 688, 696, 697]), new CncFun("UseCl", [698, 699]), new CncFun("UseCl", [700, 701]), new CncFun("UseCl", [702, 703]), new CncFun("UseCl", [704, 705]), new CncFun("UseCl", [706, 707]), new CncFun("UseCl", [708, 709]), new CncFun("StartUtt", [1]), new CncFun("although_Subj", []), new CncFun("because_Subj", []), new CncFun("when_Subj", []), new CncFun("Pres", [107]), new CncFun("Perf", [107]), new CncFun("Past", [107]), new CncFun("UttS", [710]), new CncFun("AdvVP", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 711, 419, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732]), new CncFun("ComplVS", [712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 107, 733, 107, 107, 734, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107]), new CncFun("UseV", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107]), new CncFun("UseVA", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 735, 98, 107, 107, 96, 107, 96, 107, 96, 107, 96, 107, 96, 107, 96, 107, 96, 107, 96, 107, 107, 107]), new CncFun("UseVN", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 107, 107, 107, 107, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 107]), new CncFun("UseVN", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 107, 107, 107, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 736, 107, 107, 107]), new CncFun("UseVNA", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 737, 738, 107, 107, 739, 736, 739, 736, 739, 736, 739, 736, 739, 736, 739, 736, 739, 736, 739, 736, 107, 107]), new CncFun("UseVNA", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 737, 738, 107, 107, 740, 107, 740, 107, 740, 107, 740, 107, 740, 107, 740, 107, 740, 107, 740, 107, 107, 107]), new CncFun("UseVNN", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 107, 107, 107, 107, 107, 741, 107, 741, 107, 741, 107, 741, 107, 741, 107, 741, 107, 741, 107, 741, 107, 107]), new CncFun("UseVNN", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 107, 107, 107, 107, 107, 742, 107, 742, 107, 742, 107, 742, 107, 742, 107, 742, 107, 742, 107, 742, 107, 107]), new CncFun("UseVNN", [1, 99, 100, 101, 102, 103, 104, 105, 106, 405, 406, 407, 408, 409, 410, 411, 412, 413, 418, 419, 107, 733, 107, 107, 107, 107, 107, 736, 743, 736, 743, 736, 743, 736, 743, 736, 743, 736, 743, 736, 743, 736, 743, 107, 107]), new CncFun("ComplVV", [712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 107, 733, 107, 107, 744, 745, 746, 107, 747, 107, 748, 107, 749, 107, 750, 107, 751, 107, 752, 107, 753, 107, 754, 107, 107])], [[new SymLit(0, 0)], [new SymCat(0, 0)], [new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("es"), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("sich"), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("seiner"), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("es"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("sich"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("seiner"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("es"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("sich"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("seiner"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, 39), new SymCat(0, 40), new SymCat(0, 22), new SymCat(0, 25), new SymCat(0, 20), new SymCat(0, 18), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("groß")], [new SymKS("großer")], [new SymKS("großen")], [new SymKS("große")], [new SymKS("großes")], [new SymKS("schwarz")], [new SymKS("schwarzer")], [new SymKS("schwarzen")], [new SymKS("schwarze")], [new SymKS("schwarzes")], [new SymKS("blau")], [new SymKS("blauer")], [new SymKS("blauen")], [new SymKS("blaue")], [new SymKS("blaues")], [new SymKS("[adjektiv]")], [new SymKS("[adjektiv]er")], [new SymKS("[adjektiv]en")], [new SymKS("[adjektiv]e")], [new SymKS("[adjektiv]es")], [new SymKS("grün")], [new SymKS("grüner")], [new SymKS("grünen")], [new SymKS("grüne")], [new SymKS("grünes")], [new SymKS("schwer")], [new SymKS("schwereer")], [new SymKS("schwereen")], [new SymKS("schweree")], [new SymKS("schwerees")], [new SymKS("lang")], [new SymKS("langer")], [new SymKS("langen")], [new SymKS("lange")], [new SymKS("langes")], [new SymKS("rot")], [new SymKS("roter")], [new SymKS("roten")], [new SymKS("rote")], [new SymKS("rotes")], [new SymKS("kurz")], [new SymKS("kurzer")], [new SymKS("kurzen")], [new SymKS("kurze")], [new SymKS("kurzes")], [new SymKS("klein")], [new SymKS("kleiner")], [new SymKS("kleinen")], [new SymKS("kleine")], [new SymKS("kleines")], [new SymKS("dick")], [new SymKS("dicker")], [new SymKS("dicken")], [new SymKS("dicke")], [new SymKS("dickes")], [new SymKS("dünn")], [new SymKS("dünner")], [new SymKS("dünnen")], [new SymKS("dünne")], [new SymKS("dünnes")], [new SymKS("weiß")], [new SymKS("weißer")], [new SymKS("weißen")], [new SymKS("weiße")], [new SymKS("weißes")], [new SymKS("gelb")], [new SymKS("gelber")], [new SymKS("gelben")], [new SymKS("gelbe")], [new SymKS("gelbes")], [new SymCat(0, 0), new SymCat(1, 0)], [new SymCat(0, 0), new SymCat(1, 1)], [new SymCat(0, 0), new SymCat(1, 2)], [new SymCat(0, 0), new SymCat(1, 3)], [new SymCat(0, 0), new SymCat(1, 4)], [new SymCat(0, 0), new SymCat(1, 5)], [new SymCat(0, 0), new SymCat(1, 6)], [new SymCat(0, 0), new SymCat(1, 7)], [new SymCat(0, 0), new SymCat(1, 8)], [new SymCat(1, 9)], [new SymCat(1, 10)], [new SymCat(1, 11)], [new SymCat(0, 1)], [new SymCat(0, 2)], [new SymCat(0, 3)], [new SymCat(0, 4)], [new SymCat(0, 5)], [new SymCat(0, 6)], [new SymCat(0, 7)], [new SymCat(0, 8)], [], [new SymKS("so")], [new SymKS("zu")], [new SymKS("sehr")], [new SymCat(0, 0), new SymCat(1, 1), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 1)], [new SymCat(0, 0), new SymCat(1, 2), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 1)], [new SymCat(0, 0), new SymCat(1, 3), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 1)], [new SymCat(0, 0), new SymCat(1, 4), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 1)], [new SymKS("überall")], [new SymKS("hier")], [new SymKS("irgendwo")], [new SymKS("da")], [new SymKS("dort")], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 1), new SymCat(0, 11), new SymCat(1, 0)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 2), new SymCat(0, 11), new SymCat(1, 1)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 7), new SymCat(0, 11), new SymCat(1, 2)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 8), new SymCat(0, 11), new SymCat(1, 3)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 3), new SymCat(0, 11), new SymCat(1, 4)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 2), new SymCat(0, 11), new SymCat(1, 5)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 2), new SymCat(0, 11), new SymCat(1, 6)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 2), new SymCat(0, 11), new SymCat(1, 7)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 2), new SymCat(0, 11), new SymCat(1, 8)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 2), new SymCat(0, 11), new SymCat(1, 9)], [new SymCat(1, 12)], [new SymCat(1, 13)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 3), new SymCat(0, 11), new SymCat(1, 0)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 4), new SymCat(0, 11), new SymCat(1, 1)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 3), new SymCat(0, 11), new SymCat(1, 5)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 5), new SymCat(0, 11), new SymCat(1, 0)], [new SymCat(0, 9), new SymCat(0, 10), new SymCat(0, 6), new SymCat(0, 11), new SymCat(1, 1)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 1), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 9), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 1), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 9), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("habe"), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("habe"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("habe"), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("habe"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 5), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 13), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 5), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 13), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("bin"), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("bin"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("bin"), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("bin"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("habe"), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymKS("habe"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("habe"), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 27), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 28), new SymCat(1, 22), new SymCat(1, 26), new SymKS("habe"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 2), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 10), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 2), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 10), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("hat"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("hat"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 6), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 14), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 6), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 14), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("ist"), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("ist"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("ist"), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("ist"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymKS("hat"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 29), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 30), new SymCat(1, 22), new SymCat(1, 26), new SymKS("hat"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 4), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 12), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 4), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 12), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 8), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 16), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 8), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 16), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 31), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 32), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 2), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 10), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 2), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 10), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("hat"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("hat"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 6), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 14), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 6), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 14), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("ist"), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("ist"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("ist"), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("ist"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymKS("hat"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 33), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 34), new SymCat(1, 22), new SymCat(1, 26), new SymKS("hat"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 3), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 11), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 3), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 11), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 7), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 15), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 7), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 15), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 35), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 36), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 4), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 12), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 4), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 12), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 8), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 16), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 8), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 16), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 37), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 38), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 2), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 10), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 2), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 10), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("hat"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("hat"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 6), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 14), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 6), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 14), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("ist"), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("ist"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("ist"), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("ist"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymKS("hat"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("hat"), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 39), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 40), new SymCat(1, 22), new SymCat(1, 26), new SymKS("hat"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 4), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 12), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 4), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 12), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("haben"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 8), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 16), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 8), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 16), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("sind"), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 17), new SymKS("sind"), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 20), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymKS("haben"), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24), new SymCat(1, 25)], [new SymCat(1, 43), new SymCat(0, 0), new SymCat(0, 5), new SymCat(0, 6), new SymCat(0, 7), new SymCat(1, 44), new SymCat(1, 41), new SymCat(1, 21), new SymCat(1, 23), new SymCat(1, 42), new SymCat(1, 22), new SymCat(1, 26), new SymKS("haben"), new SymCat(1, 25), new SymCat(1, 18), new SymCat(1, 0), new SymCat(1, 24)], [new SymCat(0, 1), new SymCat(1, 1)], [new SymCat(0, 2), new SymCat(1, 2)], [new SymCat(0, 3), new SymCat(1, 2)], [new SymCat(0, 4), new SymCat(1, 2)], [new SymCat(0, 5), new SymCat(1, 3)], [new SymCat(0, 6), new SymCat(1, 4)], [new SymCat(0, 7), new SymCat(1, 5)], [new SymCat(0, 8), new SymCat(1, 5)], [new SymCat(0, 9), new SymCat(1, 5)], [new SymCat(0, 10), new SymCat(1, 6)], [new SymCat(0, 11), new SymCat(1, 7)], [new SymCat(0, 12), new SymCat(1, 8)], [new SymCat(0, 13), new SymCat(1, 8)], [new SymCat(0, 14), new SymCat(1, 8)], [new SymKS("jeder")], [new SymKS("jeden")], [new SymKS("jedem")], [new SymKS("in"), new SymKS("jedem")], [new SymKS("von"), new SymKS("jedem")], [new SymKS("jede")], [new SymKS("in"), new SymKS("jeder")], [new SymKS("von"), new SymKS("jeder")], [new SymKS("jedes")], [new SymCat(0, 15), new SymCat(1, 0)], [new SymCat(0, 16), new SymCat(1, 1)], [new SymCat(0, 17), new SymCat(1, 2)], [new SymCat(0, 18), new SymCat(1, 2)], [new SymCat(0, 19), new SymCat(1, 2)], [new SymCat(0, 20), new SymCat(1, 3)], [new SymCat(0, 21), new SymCat(1, 4)], [new SymCat(0, 22), new SymCat(1, 5)], [new SymCat(0, 23), new SymCat(1, 5)], [new SymCat(0, 24), new SymCat(1, 5)], [new SymCat(0, 25), new SymCat(1, 6)], [new SymCat(0, 26), new SymCat(1, 7)], [new SymCat(0, 27), new SymCat(1, 8)], [new SymCat(0, 28), new SymCat(1, 8)], [new SymCat(0, 29), new SymCat(1, 8)], [new SymKS("zerschlagen")], [new SymKS("zerschlage")], [new SymKS("zerschlägt")], [new SymKS("zerschlug")], [new SymKS("zerschlugen")], [new SymKS("kaufen")], [new SymKS("kaufe")], [new SymKS("kauft")], [new SymKS("kaufte")], [new SymKS("kauften")], [new SymKS("gekauft")], [new SymKS("trinken")], [new SymKS("trinke")], [new SymKS("trinkt")], [new SymKS("trank")], [new SymKS("tranken")], [new SymKS("getrunken")], [new SymKS("essen")], [new SymKS("esse")], [new SymKS("isst")], [new SymKS("aß")], [new SymKS("aßen")], [new SymKS("gegessen")], [new SymKS("hassen")], [new SymKS("hasse")], [new SymKS("hasst")], [new SymKS("hasste")], [new SymKS("hassten")], [new SymKS("gehasst")], [new SymKS("hören")], [new SymKS("höre")], [new SymKS("hört")], [new SymKS("hörte")], [new SymKS("hörten")], [new SymKS("gehört")], [new SymKS("jagen")], [new SymKS("jage")], [new SymKS("jagt")], [new SymKS("jagte")], [new SymKS("jagten")], [new SymKS("gejagt")], [new SymKS("mögen")], [new SymKS("mag")], [new SymKS("mochte")], [new SymKS("mochten")], [new SymKS("gemocht")], [new SymKS("sehen")], [new SymKS("sehe")], [new SymKS("sieht")], [new SymKS("sah")], [new SymKS("sahen")], [new SymKS("gesehen")], [new SymKS("werfen")], [new SymKS("werfe")], [new SymKS("wirft")], [new SymKS("warf")], [new SymKS("warfen")], [new SymKS("geworfen")], [new SymKS("anschauen")], [new SymKS("schaue")], [new SymKS("schaut")], [new SymKS("schauen")], [new SymKS("schaute")], [new SymKS("schauten")], [new SymKS("anschaue")], [new SymKS("anschaut")], [new SymKS("anschaute")], [new SymKS("anschauten")], [new SymKS("angeschaut")], [new SymKS("an")], [new SymCat(0, 9)], [new SymCat(0, 10)], [new SymCat(0, 11)], [new SymCat(0, 12)], [new SymCat(0, 13)], [new SymCat(0, 14)], [new SymCat(0, 15)], [new SymCat(0, 16)], [new SymCat(0, 17)], [new SymCat(0, 18)], [new SymCat(0, 19)], [new SymCat(0, 20)], [new SymCat(0, 21)], [new SymCat(0, 22)], [new SymCat(0, 23)], [new SymKS("sitzen")], [new SymKS("sitze")], [new SymKS("sitzt")], [new SymKS("saß")], [new SymKS("saßen")], [new SymKS("gesessen")], [new SymKS("schlafen")], [new SymKS("schlafe")], [new SymKS("schläft")], [new SymKS("schlief")], [new SymKS("schliefen")], [new SymKS("geschlafen")], [new SymKS("sein")], [new SymKS("bin")], [new SymKS("ist")], [new SymKS("sind")], [new SymKS("war")], [new SymKS("waren")], [new SymKS("gewesen")], [new SymKS("fliegen")], [new SymKS("fliege")], [new SymKS("fliegt")], [new SymKS("flog")], [new SymKS("flogen")], [new SymKS("geflogen")], [new SymKS("laufen")], [new SymKS("laufe")], [new SymKS("läuft")], [new SymKS("lief")], [new SymKS("liefen")], [new SymKS("gelaufen")], [new SymKS("schwimmen")], [new SymKS("schwimme")], [new SymKS("schwimmt")], [new SymKS("schwamm")], [new SymKS("schwammen")], [new SymKS("geschwommen")], [new SymKS("gehen")], [new SymKS("gehe")], [new SymKS("geht")], [new SymKS("ging")], [new SymKS("gingen")], [new SymKS("gegangen")], [new SymKS("zuhören")], [new SymKS("zuhöre")], [new SymKS("zuhört")], [new SymKS("zuhörte")], [new SymKS("zuhörten")], [new SymKS("zugehört")], [new SymKS("hoffen")], [new SymKS("hoffe")], [new SymKS("hofft")], [new SymKS("hoffte")], [new SymKS("hofften")], [new SymKS("gehofft")], [new SymKS("wissen")], [new SymKS("wusste")], [new SymKS("wussten")], [new SymKS("gewusst")], [new SymKS("sagen")], [new SymKS("sage")], [new SymKS("sagt")], [new SymKS("sagte")], [new SymKS("sagten")], [new SymKS("gesagt")], [new SymKS("wollen")], [new SymKS("will")], [new SymKS("wollte")], [new SymKS("wollten")], [new SymKS("gewollt")], [new SymKS("Apfel")], [new SymKS("Äpfel")], [new SymKS("Äpfeln")], [new SymKS("Vogel")], [new SymKS("Vögel")], [new SymKS("Vögeln")], [new SymKS("Junge")], [new SymKS("Jungen")], [new SymKS("Wagen")], [new SymKS("Stuhl")], [new SymKS("Stühle")], [new SymKS("Stühlen")], [new SymKS("[Ding]")], [new SymKS("[Ding]e")], [new SymKS("[Ding]en")], [new SymKS("Hund")], [new SymKS("Hunde")], [new SymKS("Hunden")], [new SymKS("Fisch")], [new SymKS("Fische")], [new SymKS("Fischen")], [new SymKS("Fuß")], [new SymKS("Füße")], [new SymKS("Füßen")], [new SymKS("Wald")], [new SymKS("Wälder")], [new SymKS("Wäldern")], [new SymKS("Hut")], [new SymKS("Hüte")], [new SymKS("Hüten")], [new SymKS("Kopf")], [new SymKS("Köpfe")], [new SymKS("Köpfen")], [new SymKS("Mann")], [new SymKS("Männer")], [new SymKS("Männern")], [new SymKS("Schuh")], [new SymKS("Schuhe")], [new SymKS("Schuhen")], [new SymKS("Stein")], [new SymKS("Steine")], [new SymKS("Steinen")], [new SymKS("Tisch")], [new SymKS("Tische")], [new SymKS("Tischen")], [new SymKS("Baum")], [new SymKS("Bäume")], [new SymKS("Bäumen")], [new SymKS("Wein")], [new SymKS("Weine")], [new SymKS("Weinen")], [new SymKS("Katze")], [new SymKS("Katzen")], [new SymKS("Kuh")], [new SymKS("Kühe")], [new SymKS("Kühen")], [new SymKS("Frucht")], [new SymKS("Früchte")], [new SymKS("Früchten")], [new SymKS("Hand")], [new SymKS("Hände")], [new SymKS("Händen")], [new SymKS("Milch")], [new SymKS("Milche")], [new SymKS("Milchen")], [new SymKS("Person")], [new SymKS("Personen")], [new SymKS("Frau")], [new SymKS("Frauen")], [new SymKS("Tier")], [new SymKS("Tiere")], [new SymKS("Tieren")], [new SymKS("Bier")], [new SymKS("Biere")], [new SymKS("Bieren")], [new SymKS("Fahrrad")], [new SymKS("Fahrräder")], [new SymKS("Fahrrädern")], [new SymKS("Boot")], [new SymKS("Boote")], [new SymKS("Booten")], [new SymKS("Buch")], [new SymKS("Bücher")], [new SymKS("Büchern")], [new SymKS("Auto")], [new SymKS("Autos")], [new SymKS("Mädchen")], [new SymKS("Haar")], [new SymKS("Haare")], [new SymKS("Haaren")], [new SymKS("Pferd")], [new SymKS("Pferde")], [new SymKS("Pferden")], [new SymKS("Haus")], [new SymKS("Häuser")], [new SymKS("Häusern")], [new SymKS("Hemd")], [new SymKS("Hemden")], [new SymKS("Wasser")], [new SymKS("Wassern")], [new SymCat(0, 5), new SymCat(1, 0)], [new SymCat(0, 2), new SymCat(1, 6)], [new SymCat(0, 3), new SymCat(1, 6)], [new SymCat(0, 4), new SymCat(1, 6)], [new SymCat(0, 1), new SymCat(1, 5)], [new SymCat(0, 1), new SymCat(1, 3)], [new SymCat(0, 2), new SymCat(1, 9)], [new SymCat(0, 3), new SymCat(1, 9)], [new SymCat(0, 4), new SymCat(1, 9)], [new SymCat(0, 6), new SymCat(1, 1)], [new SymCat(0, 7), new SymCat(1, 6)], [new SymCat(0, 8), new SymCat(1, 6)], [new SymCat(0, 9), new SymCat(1, 6)], [new SymCat(0, 5), new SymCat(1, 4)], [new SymCat(0, 6), new SymCat(1, 5)], [new SymCat(0, 5), new SymCat(1, 2)], [new SymCat(0, 6), new SymCat(1, 3)], [new SymCat(0, 7), new SymCat(1, 9)], [new SymCat(0, 8), new SymCat(1, 9)], [new SymCat(0, 9), new SymCat(1, 9)], [new SymCat(0, 10), new SymCat(1, 0)], [new SymCat(0, 11), new SymCat(1, 1)], [new SymCat(0, 12), new SymCat(1, 6)], [new SymCat(0, 13), new SymCat(1, 6)], [new SymCat(0, 14), new SymCat(1, 6)], [new SymCat(0, 10), new SymCat(1, 4)], [new SymCat(0, 11), new SymCat(1, 5)], [new SymCat(0, 10), new SymCat(1, 2)], [new SymCat(0, 11), new SymCat(1, 3)], [new SymCat(0, 12), new SymCat(1, 9)], [new SymCat(0, 13), new SymCat(1, 9)], [new SymCat(0, 14), new SymCat(1, 9)], [new SymKS("in"), new SymCat(0, 2)], [new SymKS("von"), new SymCat(0, 2)], [new SymCat(0, 1), new SymCat(1, 8)], [new SymCat(0, 5), new SymCat(1, 7)], [new SymCat(0, 6), new SymCat(1, 8)], [new SymKS("[irgendwas]")], [new SymKS("in"), new SymKS("[irgendwas]")], [new SymKS("von"), new SymKS("[irgendwas]")], [new SymCat(0, 10), new SymCat(1, 7)], [new SymCat(0, 11), new SymCat(1, 8)], [new SymKS("Berlin")], [new SymKS("England")], [new SymKS("[Nahme]")], [new SymKS("Deutschland")], [new SymKS("Göteburg")], [new SymKS("Johann")], [new SymKS("London")], [new SymKS("Maria")], [new SymKS("Schweden")], [new SymKS("durch")], [new SymKS("mit")], [new SymKS("ich")], [new SymKS("mich")], [new SymKS("mir")], [new SymKS("er")], [new SymKS("ihn")], [new SymKS("ihm")], [new SymKS("sie")], [new SymKS("ihr")], [new SymKS("wir")], [new SymKS("uns")], [new SymKS("ihnen")], [new SymKS("ein")], [new SymKS("einen")], [new SymKS("einem")], [new SymKS("in"), new SymKS("einem")], [new SymKS("von"), new SymKS("einem")], [new SymKS("eine")], [new SymKS("einer")], [new SymKS("in"), new SymKS("einer")], [new SymKS("von"), new SymKS("einer")], [new SymKS("in")], [new SymKS("von")], [new SymKS("der")], [new SymKS("den")], [new SymKS("dem")], [new SymKS("im")], [new SymKS("vom")], [new SymKS("die")], [new SymKS("in"), new SymKS("der")], [new SymKS("von"), new SymKS("der")], [new SymKS("das")], [new SymKS("in"), new SymKS("den")], [new SymKS("von"), new SymKS("den")], [new SymKS("jener")], [new SymKS("jenen")], [new SymKS("jenem")], [new SymKS("in"), new SymKS("jenem")], [new SymKS("von"), new SymKS("jenem")], [new SymKS("jene")], [new SymKS("in"), new SymKS("jener")], [new SymKS("von"), new SymKS("jener")], [new SymKS("jenes")], [new SymKS("in"), new SymKS("jenen")], [new SymKS("von"), new SymKS("jenen")], [new SymKS("dieser")], [new SymKS("diesen")], [new SymKS("diesem")], [new SymKS("in"), new SymKS("diesem")], [new SymKS("von"), new SymKS("diesem")], [new SymKS("diese")], [new SymKS("in"), new SymKS("dieser")], [new SymKS("von"), new SymKS("dieser")], [new SymKS("dieses")], [new SymKS("in"), new SymKS("diesen")], [new SymKS("von"), new SymKS("diesen")], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 0)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 1)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 8)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 9)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 4)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 5)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 2)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 3)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 10)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 11)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 6)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 7)], [new SymCat(0, 0), new SymKS(".")], [new SymCat(0, 22), new SymCat(1, 0)], [new SymCat(0, 24)], [new SymCat(0, 25)], [new SymCat(0, 26)], [new SymCat(0, 27)], [new SymCat(0, 28)], [new SymCat(0, 29)], [new SymCat(0, 30)], [new SymCat(0, 31)], [new SymCat(0, 32)], [new SymCat(0, 33)], [new SymCat(0, 34)], [new SymCat(0, 35)], [new SymCat(0, 36)], [new SymCat(0, 37)], [new SymCat(0, 38)], [new SymCat(0, 39)], [new SymCat(0, 40)], [new SymCat(0, 41)], [new SymCat(0, 42)], [new SymCat(0, 43)], [new SymCat(0, 44)], [new SymKS("nicht")], [new SymKS(","), new SymKS("dass"), new SymCat(1, 1)], [new SymCat(1, 0), new SymCat(1, 10)], [new SymCat(0, 18), new SymCat(1, 1), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 19)], [new SymCat(2, 0), new SymCat(2, 10)], [new SymCat(2, 11)], [new SymCat(2, 9)], [new SymCat(0, 18), new SymCat(1, 1), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 19), new SymCat(2, 9)], [new SymCat(0, 18), new SymCat(1, 1), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 19), new SymCat(0, 20), new SymCat(2, 1), new SymCat(2, 5), new SymCat(2, 6), new SymCat(2, 7), new SymCat(0, 21)], [new SymCat(0, 18), new SymCat(1, 1), new SymCat(1, 5), new SymCat(1, 6), new SymCat(1, 7), new SymCat(0, 19), new SymCat(0, 20), new SymCat(2, 2), new SymCat(2, 5), new SymCat(2, 6), new SymCat(2, 7), new SymCat(0, 21)], [new SymCat(0, 20), new SymCat(2, 2), new SymCat(2, 5), new SymCat(2, 6), new SymCat(2, 7), new SymCat(0, 21)], [new SymCat(1, 24)], [new SymCat(1, 20), new SymCat(1, 18), new SymCat(1, 0)], [new SymCat(1, 25)], [new SymCat(1, 27), new SymCat(1, 28), new SymCat(1, 22)], [new SymCat(1, 29), new SymCat(1, 30), new SymCat(1, 22)], [new SymCat(1, 31), new SymCat(1, 32), new SymCat(1, 22)], [new SymCat(1, 33), new SymCat(1, 34), new SymCat(1, 22)], [new SymCat(1, 35), new SymCat(1, 36), new SymCat(1, 22)], [new SymCat(1, 37), new SymCat(1, 38), new SymCat(1, 22)], [new SymCat(1, 39), new SymCat(1, 40), new SymCat(1, 22)], [new SymCat(1, 41), new SymCat(1, 42), new SymCat(1, 22)]], { A: { s: 0, e: 0 }, A2: { s: 1, e: 18 }, AP: { s: 19, e: 20 }, AdA: { s: 21, e: 21 }, AdN: { s: 22, e: 22 }, AdV: { s: 23, e: 23 }, Adv: { s: 24, e: 24 }, Adverb: { s: 25, e: 25 }, Ant: { s: 26, e: 27 }, CAdv: { s: 28, e: 28 }, CN: { s: 29, e: 31 }, Card: { s: 32, e: 33 }, Cl: { s: 34, e: 34 }, ClSlash: { s: 35, e: 52 }, Comp: { s: 53, e: 53 }, Conj: { s: 54, e: 55 }, DAP: { s: 56, e: 56 }, Det: { s: 57, e: 64 }, Digits: { s: 65, e: 66 }, Float: { s: -3, e: -3 }, GraspV: { s: 67, e: 3306 }, GraspVQ: { s: 3307, e: 35706 }, GraspVS: { s: 35707, e: 68106 }, GraspVV: { s: 68107, e: 132906 }, IAdv: { s: 132907, e: 132907 }, IComp: { s: 132908, e: 132908 }, IDet: { s: 132909, e: 132910 }, IP: { s: 132911, e: 132912 }, IQuant: { s: 132913, e: 132913 }, Imp: { s: 132914, e: 132914 }, Int: { s: -2, e: -2 }, Interj: { s: 132915, e: 132915 }, N: { s: 132916, e: 132918 }, N2: { s: 132919, e: 132972 }, N3: { s: 132973, e: 133944 }, NP: { s: 133945, e: 133980 }, Num: { s: 133981, e: 133984 }, Numeral: { s: 133985, e: 133986 }, Ord: { s: 133987, e: 133987 }, PConj: { s: 133988, e: 133988 }, PN: { s: 133989, e: 133991 }, Phr: { s: 133992, e: 133992 }, Pol: { s: 133993, e: 133994 }, Predet: { s: 133995, e: 134024 }, Prep: { s: 134025, e: 134042 }, Pron: { s: 134043, e: 134060 }, QCl: { s: 134061, e: 134061 }, QS: { s: 134062, e: 134062 }, Quant: { s: 134063, e: 134066 }, RCl: { s: 134067, e: 134070 }, RP: { s: 134071, e: 134077 }, RS: { s: 134078, e: 134081 }, S: { s: 134082, e: 134082 }, SC: { s: 134083, e: 134083 }, SSlash: { s: 134084, e: 134101 }, Start: { s: 134102, e: 134102 }, String: { s: -1, e: -1 }, Subj: { s: 134103, e: 134103 }, Temp: { s: 134104, e: 134119 }, Tense: { s: 134120, e: 134127 }, Text: { s: 134128, e: 134128 }, Utt: { s: 134129, e: 134129 }, V: { s: 134130, e: 134139 }, V2: { s: 134140, e: 134319 }, V2A: { s: 134320, e: 134499 }, V2Q: { s: 134500, e: 134679 }, V2S: { s: 134680, e: 134859 }, V2V: { s: 134860, e: 135219 }, V3: { s: 135220, e: 138459 }, VA: { s: 138460, e: 138469 }, VP: { s: 138470, e: 138829 }, VPSlash: { s: 138830, e: 145309 }, VQ: { s: 145310, e: 145319 }, VS: { s: 145320, e: 145329 }, VV: { s: 145330, e: 145349 }, Voc: { s: 145350, e: 145350 } }, 154646), GraspSwe: new GFConcrete({}, { 0: [new Apply(157, []), new Apply(158, []), new Apply(159, []), new Apply(160, []), new Apply(161, []), new Apply(162, []), new Apply(163, []), new Apply(164, []), new Apply(165, []), new Apply(166, []), new Apply(167, []), new Apply(168, []), new Apply(169, []), new Apply(170, [])], 7: [new Apply(171, [new PArg(8), new PArg(7)]), new Apply(172, [new PArg(458)])], 8: [new Apply(173, []), new Apply(174, []), new Apply(175, [])], 11: [new Apply(176, [new PArg(271), new PArg(457)]), new Apply(177, [new PArg(12)])], 12: [new Apply(178, []), new Apply(179, []), new Apply(180, []), new Apply(181, [])], 16: [new Apply(182, [new PArg(217)])], 17: [new Apply(182, [new PArg(218)])], 18: [new Apply(183, [new PArg(7), new PArg(455)])], 19: [new Apply(184, [new PArg(7), new PArg(456)])], 22: [new Apply(185, [new PArg(432), new PArg(452)]), new Apply(186, [new PArg(440), new PArg(452)]), new Apply(187, [new PArg(434), new PArg(452)]), new Apply(188, [new PArg(442), new PArg(452)]), new Apply(189, [new PArg(441), new PArg(452)]), new Apply(190, [new PArg(443), new PArg(452)])], 26: [new Apply(191, [])], 28: [new Apply(192, [])], 36: [new Apply(193, [new PArg(286), new PArg(255)]), new Apply(194, [])], 38: [new Apply(195, [new PArg(288), new PArg(255)])], 39: [new Apply(196, [new PArg(286), new PArg(257)])], 41: [new Apply(197, [new PArg(288), new PArg(257)])], 44: [new Apply(198, [new PArg(477)]), new Apply(199, [new PArg(489)]), new Apply(200, []), new Apply(201, []), new Apply(202, []), new Apply(203, []), new Apply(204, []), new Apply(205, []), new Apply(206, []), new Apply(207, []), new Apply(208, []), new Apply(209, []), new Apply(210, []), new Apply(211, []), new Apply(212, []), new Apply(213, []), new Apply(214, []), new Apply(215, [])], 46: [new Apply(216, []), new Apply(217, []), new Apply(218, [])], 48: [new Apply(198, [new PArg(481)])], 56: [new Apply(219, []), new Apply(220, [])], 92: [new Apply(221, []), new Apply(222, [])], 108: [new Apply(223, [])], 128: [new Apply(224, [])], 200: [new Apply(225, []), new Apply(226, []), new Apply(227, [])], 208: [new Apply(228, [])], 217: [new Apply(229, []), new Apply(230, []), new Apply(231, []), new Apply(232, []), new Apply(233, []), new Apply(234, []), new Apply(235, []), new Apply(236, []), new Apply(237, []), new Apply(238, []), new Apply(239, []), new Apply(240, []), new Apply(241, []), new Apply(242, []), new Apply(243, []), new Apply(244, []), new Apply(245, []), new Apply(246, []), new Apply(247, []), new Apply(248, []), new Apply(249, []), new Apply(250, []), new Apply(251, []), new Apply(252, []), new Apply(253, [])], 218: [new Apply(254, []), new Apply(255, []), new Apply(256, []), new Apply(257, []), new Apply(258, []), new Apply(259, []), new Apply(260, []), new Apply(261, []), new Apply(262, []), new Apply(263, []), new Apply(264, [])], 231: [new Apply(265, [new PArg(432), new PArg(11)])], 233: [new Apply(265, [new PArg(434), new PArg(11)])], 239: [new Apply(265, [new PArg(440), new PArg(11)]), new Apply(266, [new PArg(36), new PArg(16)]), new Apply(267, [new PArg(38), new PArg(16)]), new Apply(268, [new PArg(36), new PArg(18)]), new Apply(269, [new PArg(38), new PArg(18)]), new Apply(270, [new PArg(263)]), new Apply(271, [])], 240: [new Apply(265, [new PArg(441), new PArg(11)]), new Apply(272, [new PArg(36), new PArg(17)]), new Apply(273, [new PArg(38), new PArg(17)]), new Apply(274, [new PArg(36), new PArg(19)]), new Apply(275, [new PArg(38), new PArg(19)])], 241: [new Apply(265, [new PArg(442), new PArg(11)]), new Apply(276, [new PArg(39), new PArg(16)]), new Apply(277, [new PArg(41), new PArg(16)]), new Apply(278, [new PArg(39), new PArg(18)]), new Apply(279, [new PArg(41), new PArg(18)])], 242: [new Apply(265, [new PArg(443), new PArg(11)]), new Apply(280, [new PArg(39), new PArg(17)]), new Apply(281, [new PArg(41), new PArg(17)]), new Apply(282, [new PArg(39), new PArg(19)]), new Apply(283, [new PArg(41), new PArg(19)])], 243: [new Apply(284, [new PArg(272)])], 245: [new Apply(284, [new PArg(274)])], 251: [new Apply(284, [new PArg(280)])], 255: [new Apply(285, [])], 257: [new Apply(286, [])], 263: [new Apply(287, []), new Apply(288, []), new Apply(289, []), new Apply(290, []), new Apply(291, []), new Apply(292, []), new Apply(293, []), new Apply(294, []), new Apply(295, [])], 266: [new Apply(296, [])], 267: [new Apply(297, [])], 271: [new Apply(298, []), new Apply(299, []), new Apply(300, []), new Apply(301, [])], 272: [new Apply(302, [])], 274: [new Apply(303, []), new Apply(304, [])], 280: [new Apply(305, []), new Apply(306, [])], 284: [new Apply(307, [new PArg(22)]), new Apply(308, [new PArg(200), new PArg(22)]), new Apply(309, [new PArg(208), new PArg(452)])], 286: [new Apply(310, [])], 288: [new Apply(311, []), new Apply(312, []), new Apply(313, [])], 318: [new Apply(314, [new PArg(324), new PArg(266), new PArg(22)]), new Apply(315, [new PArg(326), new PArg(266), new PArg(22)]), new Apply(316, [new PArg(325), new PArg(266), new PArg(22)]), new Apply(317, [new PArg(324), new PArg(267), new PArg(22)]), new Apply(318, [new PArg(326), new PArg(267), new PArg(22)]), new Apply(319, [new PArg(325), new PArg(267), new PArg(22)])], 322: [new Apply(320, [new PArg(340)])], 323: [new Apply(321, []), new Apply(322, []), new Apply(323, [])], 324: [new Apply(324, [])], 325: [new Apply(325, [])], 326: [new Apply(326, [])], 340: [new Apply(327, [new PArg(318)])], 395: [new Apply(328, [new PArg(459)]), new Apply(329, [new PArg(460)])], 396: [new Apply(330, [new PArg(444), new PArg(11)])], 399: [new Apply(331, [new PArg(448), new PArg(318)]), new Apply(332, [new PArg(449), new PArg(318)]), new Apply(333, [new PArg(451), new PArg(452)]), new Apply(334, [new PArg(459), new PArg(462)]), new Apply(335, [new PArg(460), new PArg(462)]), new Apply(336, [new PArg(464), new PArg(231)]), new Apply(336, [new PArg(464), new PArg(233)]), new Apply(336, [new PArg(464), new PArg(239)]), new Apply(336, [new PArg(464), new PArg(240)]), new Apply(336, [new PArg(464), new PArg(241)]), new Apply(336, [new PArg(464), new PArg(242)]), new Apply(337, [new PArg(466), new PArg(231)]), new Apply(337, [new PArg(466), new PArg(233)]), new Apply(337, [new PArg(466), new PArg(239)]), new Apply(337, [new PArg(466), new PArg(240)]), new Apply(337, [new PArg(466), new PArg(241)]), new Apply(337, [new PArg(466), new PArg(242)]), new Apply(338, [new PArg(469), new PArg(470)]), new Apply(339, [new PArg(471), new PArg(470)]), new Apply(340, [new PArg(464), new PArg(231), new PArg(462)]), new Apply(340, [new PArg(464), new PArg(239), new PArg(462)]), new Apply(341, [new PArg(466), new PArg(231), new PArg(462)]), new Apply(341, [new PArg(466), new PArg(239), new PArg(462)]), new Apply(342, [new PArg(464), new PArg(233), new PArg(462)]), new Apply(342, [new PArg(464), new PArg(241), new PArg(462)]), new Apply(342, [new PArg(464), new PArg(242), new PArg(462)]), new Apply(343, [new PArg(466), new PArg(233), new PArg(462)]), new Apply(343, [new PArg(466), new PArg(241), new PArg(462)]), new Apply(343, [new PArg(466), new PArg(242), new PArg(462)]), new Apply(344, [new PArg(464), new PArg(240), new PArg(462)]), new Apply(345, [new PArg(466), new PArg(240), new PArg(462)]), new Apply(346, [new PArg(469), new PArg(473), new PArg(462)]), new Apply(347, [new PArg(471), new PArg(473), new PArg(462)]), new Apply(348, [new PArg(469), new PArg(474), new PArg(462)]), new Apply(349, [new PArg(471), new PArg(474), new PArg(462)]), new Apply(350, [new PArg(464), new PArg(231), new PArg(476)]), new Apply(350, [new PArg(464), new PArg(233), new PArg(476)]), new Apply(350, [new PArg(464), new PArg(239), new PArg(476)]), new Apply(350, [new PArg(464), new PArg(240), new PArg(476)]), new Apply(350, [new PArg(464), new PArg(241), new PArg(476)]), new Apply(350, [new PArg(464), new PArg(242), new PArg(476)]), new Apply(351, [new PArg(466), new PArg(231), new PArg(476)]), new Apply(351, [new PArg(466), new PArg(233), new PArg(476)]), new Apply(351, [new PArg(466), new PArg(239), new PArg(476)]), new Apply(351, [new PArg(466), new PArg(240), new PArg(476)]), new Apply(351, [new PArg(466), new PArg(241), new PArg(476)]), new Apply(351, [new PArg(466), new PArg(242), new PArg(476)]), new Apply(352, [new PArg(469), new PArg(470), new PArg(457)]), new Apply(353, [new PArg(471), new PArg(470), new PArg(457)])], 400: [new Apply(330, [new PArg(446), new PArg(11)])], 432: [new Coerce(231), new Coerce(243)], 434: [new Coerce(233), new Coerce(245)], 440: [new Coerce(239), new Coerce(251)], 441: [new Coerce(240)], 442: [new Coerce(241)], 443: [new Coerce(242)], 444: [new Coerce(395), new Coerce(396)], 446: [new Coerce(399), new Coerce(400)], 448: [new Coerce(92)], 449: [new Coerce(108)], 451: [new Coerce(128)], 452: [new Coerce(395), new Coerce(396), new Coerce(399), new Coerce(400)], 455: [new Coerce(16), new Coerce(18)], 456: [new Coerce(17), new Coerce(19)], 457: [new Coerce(231), new Coerce(233), new Coerce(239), new Coerce(240), new Coerce(241), new Coerce(242), new Coerce(243), new Coerce(245), new Coerce(251)], 458: [new Coerce(0)], 459: [new Coerce(44), new Coerce(46)], 460: [new Coerce(48)], 462: [new Coerce(7)], 464: [new Coerce(44), new Coerce(46)], 466: [new Coerce(48)], 469: [new Coerce(44), new Coerce(46)], 470: [new Coerce(243), new Coerce(245), new Coerce(251)], 471: [new Coerce(48)], 473: [new Coerce(243), new Coerce(251)], 474: [new Coerce(245)], 476: [new Coerce(231), new Coerce(233), new Coerce(239), new Coerce(240), new Coerce(241), new Coerce(242), new Coerce(243), new Coerce(245), new Coerce(251)], 477: [new Coerce(92)], 481: [new Coerce(108)], 489: [new Coerce(128)] }, [new CncFun("'lindef A'", [0, 0, 0, 0, 0]), new CncFun("'lindef A2'", []), new CncFun("'lindef AP'", [0, 0, 0, 0, 0]), new CncFun("'lindef AdA'", [0]), new CncFun("'lindef AdN'", []), new CncFun("'lindef AdV'", []), new CncFun("'lindef Adv'", [0]), new CncFun("'lindef Adverb'", [0]), new CncFun("'lindef Ant'", []), new CncFun("'lindef CAdv'", []), new CncFun("'lindef CN'", [0, 0, 0, 0]), new CncFun("'lindef Card'", []), new CncFun("'lindef Cl'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef ClSlash'", []), new CncFun("'lindef Comp'", []), new CncFun("'lindef Conj'", []), new CncFun("'lindef DAP'", []), new CncFun("'lindef Det'", [0, 0, 0, 0]), new CncFun("'lindef Digits'", []), new CncFun("'lindef GraspV'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef GraspVQ'", []), new CncFun("'lindef GraspVS'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef GraspVV'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef IAdv'", []), new CncFun("'lindef IComp'", []), new CncFun("'lindef IDet'", []), new CncFun("'lindef IP'", []), new CncFun("'lindef IQuant'", []), new CncFun("'lindef Imp'", []), new CncFun("'lindef Interj'", []), new CncFun("'lindef N'", [0, 0, 0, 0]), new CncFun("'lindef N2'", []), new CncFun("'lindef N3'", []), new CncFun("'lindef NP'", [0, 0]), new CncFun("'lindef Num'", [0, 0]), new CncFun("'lindef Numeral'", []), new CncFun("'lindef Ord'", []), new CncFun("'lindef PConj'", []), new CncFun("'lindef PN'", [0]), new CncFun("'lindef Phr'", []), new CncFun("'lindef Pol'", [0]), new CncFun("'lindef Predet'", []), new CncFun("'lindef Prep'", [0]), new CncFun("'lindef Pron'", [0, 0]), new CncFun("'lindef QCl'", []), new CncFun("'lindef QS'", []), new CncFun("'lindef Quant'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef RCl'", []), new CncFun("'lindef RP'", []), new CncFun("'lindef RS'", []), new CncFun("'lindef S'", [0, 0]), new CncFun("'lindef SC'", []), new CncFun("'lindef SSlash'", []), new CncFun("'lindef Start'", [0]), new CncFun("'lindef Subj'", []), new CncFun("'lindef Temp'", [0]), new CncFun("'lindef Tense'", []), new CncFun("'lindef Text'", []), new CncFun("'lindef Utt'", [0]), new CncFun("'lindef V'", []), new CncFun("'lindef V2'", []), new CncFun("'lindef V2A'", []), new CncFun("'lindef V2Q'", []), new CncFun("'lindef V2S'", []), new CncFun("'lindef V2V'", []), new CncFun("'lindef V3'", []), new CncFun("'lindef VA'", []), new CncFun("'lindef VP'", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new CncFun("'lindef VPSlash'", []), new CncFun("'lindef VQ'", []), new CncFun("'lindef VS'", []), new CncFun("'lindef VV'", []), new CncFun("'lindef Voc'", []), new CncFun("'lindef A'", [1]), new CncFun("'lindef A2'", [2]), new CncFun("'lindef AP'", [1]), new CncFun("'lindef AdA'", [1]), new CncFun("'lindef AdN'", [2]), new CncFun("'lindef AdV'", [2]), new CncFun("'lindef Adv'", [1]), new CncFun("'lindef Adverb'", [1]), new CncFun("'lindef Ant'", [2]), new CncFun("'lindef CAdv'", [2]), new CncFun("'lindef CN'", [1]), new CncFun("'lindef Card'", [2]), new CncFun("'lindef Cl'", [1]), new CncFun("'lindef ClSlash'", [3]), new CncFun("'lindef Comp'", [2]), new CncFun("'lindef Conj'", [4]), new CncFun("'lindef DAP'", [2]), new CncFun("'lindef Det'", [1]), new CncFun("'lindef Digits'", [2]), new CncFun("'lindef GraspV'", [1]), new CncFun("'lindef GraspVQ'", [2]), new CncFun("'lindef GraspVS'", [1]), new CncFun("'lindef GraspVV'", [1]), new CncFun("'lindef IAdv'", [2]), new CncFun("'lindef IComp'", [2]), new CncFun("'lindef IDet'", [2]), new CncFun("'lindef IP'", [2]), new CncFun("'lindef IQuant'", [2]), new CncFun("'lindef Imp'", [2]), new CncFun("'lindef Interj'", [2]), new CncFun("'lindef N'", [1]), new CncFun("'lindef N2'", [2]), new CncFun("'lindef N3'", [2]), new CncFun("'lindef NP'", [1]), new CncFun("'lindef Num'", [1]), new CncFun("'lindef Numeral'", [2]), new CncFun("'lindef Ord'", [2]), new CncFun("'lindef PConj'", [2]), new CncFun("'lindef PN'", [1]), new CncFun("'lindef Phr'", [2]), new CncFun("'lindef Pol'", [1]), new CncFun("'lindef Predet'", [2]), new CncFun("'lindef Prep'", [1]), new CncFun("'lindef Pron'", [1]), new CncFun("'lindef QCl'", [2]), new CncFun("'lindef QS'", [2]), new CncFun("'lindef Quant'", [1]), new CncFun("'lindef RCl'", [2]), new CncFun("'lindef RP'", [2]), new CncFun("'lindef RS'", [2]), new CncFun("'lindef S'", [1]), new CncFun("'lindef SC'", [2]), new CncFun("'lindef SSlash'", [3]), new CncFun("'lindef Start'", [1]), new CncFun("'lindef Subj'", [2]), new CncFun("'lindef Temp'", [1]), new CncFun("'lindef Tense'", [2]), new CncFun("'lindef Text'", [2]), new CncFun("'lindef Utt'", [1]), new CncFun("'lindef V'", [4]), new CncFun("'lindef V'", [5]), new CncFun("'lindef V2'", [3]), new CncFun("'lindef V2'", [6]), new CncFun("'lindef V2A'", [3]), new CncFun("'lindef V2A'", [6]), new CncFun("'lindef V2Q'", [3]), new CncFun("'lindef V2Q'", [6]), new CncFun("'lindef V2S'", [3]), new CncFun("'lindef V2S'", [6]), new CncFun("'lindef V2V'", [3]), new CncFun("'lindef V2V'", [6]), new CncFun("'lindef V3'", [7]), new CncFun("'lindef V3'", [8]), new CncFun("'lindef VA'", [4]), new CncFun("'lindef VA'", [5]), new CncFun("'lindef VP'", [9]), new CncFun("'lindef VPSlash'", [10]), new CncFun("'lindef VQ'", [4]), new CncFun("'lindef VQ'", [5]), new CncFun("'lindef VS'", [4]), new CncFun("'lindef VS'", [5]), new CncFun("'lindef VV'", [4]), new CncFun("'lindef VV'", [5]), new CncFun("'lindef Voc'", [2]), new CncFun("big_A", [11, 12, 13, 13, 13]), new CncFun("black_A", [14, 14, 15, 15, 15]), new CncFun("blue_A", [16, 17, 18, 18, 18]), new CncFun("default_A", [19, 20, 21, 21, 21]), new CncFun("green_A", [22, 23, 24, 24, 24]), new CncFun("heavy_A", [25, 26, 27, 27, 27]), new CncFun("long_A", [28, 29, 30, 30, 30]), new CncFun("red_A", [31, 32, 33, 33, 33]), new CncFun("short_A", [34, 35, 36, 36, 36]), new CncFun("small_A", [37, 38, 39, 40, 39]), new CncFun("thick_A", [41, 42, 43, 43, 43]), new CncFun("thin_A", [44, 45, 46, 46, 46]), new CncFun("white_A", [47, 48, 49, 49, 49]), new CncFun("yellow_A", [50, 51, 52, 52, 52]), new CncFun("AdAP", [53, 54, 55, 56, 57]), new CncFun("UseA", [1, 58, 59, 60, 61]), new CncFun("so_AdA", [62]), new CncFun("too_AdA", [63]), new CncFun("very_AdA", [64]), new CncFun("PrepNP", [54]), new CncFun("UseAdverb", [1]), new CncFun("everywhere_Adverb", [65]), new CncFun("here_Adverb", [66]), new CncFun("somewhere_Adverb", [67]), new CncFun("there_Adverb", [68]), new CncFun("UseN", [1, 58, 59, 60]), new CncFun("ModCN", [53, 69, 70, 71]), new CncFun("ModCN", [72, 69, 70, 71]), new CncFun("PredVP", [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84]), new CncFun("PredVP", [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96]), new CncFun("PredVP", [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]), new CncFun("PredVP", [109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]), new CncFun("PredVP", [121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132]), new CncFun("PredVP", [133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144]), new CncFun("or_Conj", []), new CncFun("and_Conj", []), new CncFun("DetQuant", [53, 145, 146, 69]), new CncFun("every_Det", [147, 147, 147, 147]), new CncFun("DetQuant", [53, 145, 148, 149]), new CncFun("DetQuant", [150, 151, 152, 153]), new CncFun("DetQuant", [150, 151, 154, 155]), new CncFun("VerbVS", [1, 58, 59, 60, 61, 156, 157, 158, 159, 160, 161]), new CncFun("VerbVV", [1, 58, 59, 60, 61, 156, 157, 158, 159, 160, 161]), new CncFun("break_V", [162, 163, 164, 165, 166, 163, 167, 168, 169, 169, 170]), new CncFun("buy_V", [171, 172, 173, 174, 175, 176, 177, 178, 169, 169, 169]), new CncFun("copula", [179, 180, 181, 180, 182, 183, 184, 185, 169, 169, 169]), new CncFun("drink_V", [186, 187, 188, 189, 190, 191, 192, 193, 169, 169, 169]), new CncFun("eat_V", [194, 195, 196, 197, 198, 199, 200, 201, 169, 169, 169]), new CncFun("fly_V", [202, 203, 204, 205, 206, 207, 208, 209, 169, 169, 169]), new CncFun("hate_V", [210, 211, 212, 213, 214, 211, 215, 216, 169, 169, 169]), new CncFun("hear_V", [217, 218, 219, 220, 221, 222, 223, 224, 169, 169, 169]), new CncFun("hunt_V", [225, 226, 227, 228, 229, 226, 230, 231, 169, 169, 169]), new CncFun("run_V", [232, 233, 234, 235, 236, 237, 238, 239, 169, 169, 169]), new CncFun("see_V", [240, 241, 242, 243, 244, 241, 245, 246, 169, 169, 169]), new CncFun("sit_V", [247, 248, 249, 250, 251, 252, 253, 254, 169, 169, 169]), new CncFun("sleep_V", [255, 256, 257, 256, 258, 259, 260, 261, 169, 169, 169]), new CncFun("swim_V", [262, 263, 264, 265, 266, 263, 267, 268, 169, 169, 169]), new CncFun("throw_V", [269, 270, 271, 272, 273, 270, 274, 275, 169, 169, 169]), new CncFun("walk_V", [276, 277, 278, 279, 280, 277, 281, 282, 169, 169, 169]), new CncFun("like_V", [283, 284, 285, 286, 287, 288, 289, 290, 169, 291, 169]), new CncFun("listen_V", [292, 293, 294, 295, 296, 293, 297, 298, 169, 299, 169]), new CncFun("watch_V", [300, 301, 302, 303, 304, 301, 305, 306, 169, 299, 169]), new CncFun("know_VQ", []), new CncFun("wonder_VQ", []), new CncFun("know_VS", [307, 308, 309, 310, 311, 312, 313, 314, 169, 169, 169, 307, 308, 309, 310, 311, 312, 313, 314, 169]), new CncFun("say_VS", [315, 316, 317, 318, 319, 320, 321, 322, 169, 169, 169, 315, 316, 317, 318, 319, 320, 321, 322, 169]), new CncFun("hope_VS", [323, 324, 325, 326, 327, 324, 328, 329, 169, 169, 169, 323, 324, 325, 326, 327, 324, 328, 329, 169]), new CncFun("want_VV", [330, 331, 332, 333, 334, 335, 336, 337, 169, 169, 169, 330, 332, 334, 336, 169, 169]), new CncFun("when_IAdv", []), new CncFun("where_IAdv", []), new CncFun("why_IAdv", []), new CncFun("whoSg_IP", []), new CncFun("bike_N", [338, 339, 340, 341]), new CncFun("bird_N", [342, 343, 344, 345]), new CncFun("boat_N", [346, 347, 348, 349]), new CncFun("book_N", [350, 351, 352, 353]), new CncFun("boy_N", [354, 355, 356, 357]), new CncFun("car_N", [358, 359, 360, 361]), new CncFun("cat_N", [362, 363, 364, 365]), new CncFun("chair_N", [366, 367, 368, 369]), new CncFun("cow_N", [370, 371, 372, 373]), new CncFun("dog_N", [374, 375, 376, 377]), new CncFun("fish_N", [378, 379, 380, 381]), new CncFun("foot_N", [382, 383, 384, 385]), new CncFun("forest_N", [386, 387, 388, 389]), new CncFun("fruit_N", [390, 391, 392, 393]), new CncFun("girl_N", [394, 395, 396, 397]), new CncFun("hand_N", [398, 399, 400, 401]), new CncFun("hat_N", [402, 403, 404, 405]), new CncFun("horse_N", [406, 407, 408, 409]), new CncFun("man_N", [410, 411, 412, 413]), new CncFun("milk_N", [414, 415, 416, 417]), new CncFun("person_N", [418, 419, 420, 421]), new CncFun("shirt_N", [422, 423, 424, 425]), new CncFun("shoe_N", [426, 427, 428, 429]), new CncFun("stone_N", [430, 431, 432, 433]), new CncFun("woman_N", [434, 435, 436, 437]), new CncFun("animal_N", [438, 439, 438, 440]), new CncFun("apple_N", [441, 442, 443, 444]), new CncFun("beer_N", [445, 446, 445, 447]), new CncFun("default_N", [448, 449, 450, 451]), new CncFun("hair_N", [452, 453, 452, 454]), new CncFun("head_N", [455, 456, 457, 458]), new CncFun("house_N", [459, 460, 459, 461]), new CncFun("table_N", [462, 463, 462, 464]), new CncFun("tree_N", [465, 466, 465, 467]), new CncFun("water_N", [468, 469, 468, 470]), new CncFun("wine_N", [471, 472, 473, 474]), new CncFun("AdvNP", [53, 72]), new CncFun("DetCN", [53, 53]), new CncFun("DetCN", [54, 54]), new CncFun("DetCN", [146, 146]), new CncFun("DetCN", [475, 475]), new CncFun("UsePN", [1, 1]), new CncFun("default_NP", [476, 476]), new CncFun("DetCN", [72, 72]), new CncFun("DetCN", [145, 145]), new CncFun("DetCN", [477, 477]), new CncFun("DetCN", [69, 69]), new CncFun("DetCN", [55, 55]), new CncFun("DetCN", [56, 56]), new CncFun("DetCN", [70, 70]), new CncFun("DetCN", [478, 478]), new CncFun("DetCN", [479, 479]), new CncFun("DetCN", [480, 480]), new CncFun("DetCN", [481, 481]), new CncFun("DetCN", [482, 482]), new CncFun("UsePron", [1, 58]), new CncFun("NumSg", [169, 169]), new CncFun("NumPl", [169, 169]), new CncFun("berlin_PN", [483]), new CncFun("britain_PN", [484]), new CncFun("default_PN", [485]), new CncFun("germany_PN", [486]), new CncFun("gothenburg_PN", [487]), new CncFun("john_PN", [488]), new CncFun("london_PN", [489]), new CncFun("mary_PN", [490]), new CncFun("sweden_PN", [491]), new CncFun("Pos", [169]), new CncFun("Neg", [169]), new CncFun("by8agent_Prep", [492]), new CncFun("in_Prep", [493]), new CncFun("possess_Prep", [492]), new CncFun("with_Prep", [494]), new CncFun("i_Pron", [495, 496]), new CncFun("they_Pron", [497, 498]), new CncFun("we_Pron", [499, 500]), new CncFun("he_Pron", [501, 502]), new CncFun("she_Pron", [503, 504]), new CncFun("QuestCl", []), new CncFun("QuestIAdv", []), new CncFun("QuestVP", []), new CncFun("IndefArt", [505, 506, 505, 506, 169, 169, 169, 169, 169, 169, 169, 169]), new CncFun("DefArt", [169, 169, 507, 508, 507, 508, 169, 169, 497, 497, 497, 497]), new CncFun("that_Quant", [509, 510, 509, 510, 509, 510, 511, 511, 511, 511, 511, 511]), new CncFun("this_Quant", [512, 513, 512, 513, 512, 513, 514, 514, 514, 514, 514, 514]), new CncFun("UseCl", [515, 516]), new CncFun("UseCl", [517, 518]), new CncFun("UseCl", [519, 520]), new CncFun("UseCl", [521, 522]), new CncFun("UseCl", [523, 524]), new CncFun("UseCl", [525, 526]), new CncFun("StartUtt", [1]), new CncFun("although_Subj", []), new CncFun("because_Subj", []), new CncFun("when_Subj", []), new CncFun("Pres", [169]), new CncFun("Perf", [169]), new CncFun("Past", [169]), new CncFun("UttS", [527]), new CncFun("UseV", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 161, 161, 161, 161, 161, 161]), new CncFun("UseV", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 161, 161, 161, 161, 161, 161]), new CncFun("AdvVP", [1, 58, 59, 60, 61, 156, 157, 158, 159, 160, 161, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623]), new CncFun("ComplVS", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 530, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 536, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 532, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 534, 169, 169, 169, 169, 169, 169, 169, 169, 624, 624, 624, 624, 624, 624]), new CncFun("ComplVS", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 531, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 537, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 533, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 535, 169, 169, 169, 169, 169, 169, 169, 169, 624, 624, 624, 624, 624, 624]), new CncFun("ComplVV", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 530, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 533, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 531, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 532, 169, 169, 169, 169, 169, 169, 169, 169, 625, 626, 627, 628, 629, 630]), new CncFun("UseVA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 154, 154, 631, 631, 632, 631]), new CncFun("UseVA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 154, 154, 631, 631, 632, 631]), new CncFun("UseVN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 633, 633, 633, 633, 633, 633]), new CncFun("UseVN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 633, 633, 633, 633, 633, 633]), new CncFun("UseVN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 634, 634, 634, 634, 634, 634, 161, 161, 161, 161, 161, 161]), new CncFun("UseVN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 634, 634, 634, 634, 634, 634, 161, 161, 161, 161, 161, 161]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 635, 635, 635, 635, 635, 635]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 635, 635, 635, 635, 635, 635]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 636, 636, 636, 636, 636, 636]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 636, 636, 636, 636, 636, 636]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 637, 637, 637, 637, 637, 637]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 637, 637, 637, 637, 637, 637]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 634, 634, 634, 634, 634, 634, 638, 638, 638, 638, 638, 638]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 634, 634, 634, 634, 634, 634, 638, 638, 638, 638, 638, 638]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 634, 634, 634, 634, 634, 634, 639, 639, 639, 639, 639, 639]), new CncFun("UseVNA", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 634, 634, 634, 634, 634, 634, 639, 639, 639, 639, 639, 639]), new CncFun("UseVNN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 169, 169, 169, 169, 169, 169, 640, 640, 640, 640, 640, 640]), new CncFun("UseVNN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 169, 169, 169, 169, 169, 169, 640, 640, 640, 640, 640, 640]), new CncFun("UseVNN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 1, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 157, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 59, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 61, 169, 169, 634, 634, 634, 634, 634, 634, 641, 641, 641, 641, 641, 641]), new CncFun("UseVNN", [169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 58, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 529, 158, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 169, 528, 60, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 169, 156, 169, 169, 634, 634, 634, 634, 634, 634, 641, 641, 641, 641, 641, 641])], [[new SymLit(0, 0)], [new SymCat(0, 0)], [new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymKS("sig"), new SymCat(0, -1)], [new SymCat(0, -1), new SymKS("sig"), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, -1), new SymKS("sig"), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymCat(0, 80), new SymCat(0, 81), new SymCat(0, 90), new SymCat(0, 94), new SymCat(0, 100), new SymCat(0, 91), new SymCat(0, 92)], [new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1), new SymCat(0, -1)], [new SymKS("stor")], [new SymKS("stort")], [new SymKS("stora")], [new SymKS("svart")], [new SymKS("svarta")], [new SymKS("blå")], [new SymKS("blått")], [new SymKS("blåa")], [new SymKS("[adjektiv]")], [new SymKS("[adjektiv]t")], [new SymKS("[adjektiv]a")], [new SymKS("grön")], [new SymKS("grönt")], [new SymKS("gröna")], [new SymKS("tung")], [new SymKS("tungt")], [new SymKS("tunga")], [new SymKS("lång")], [new SymKS("långt")], [new SymKS("långa")], [new SymKS("röd")], [new SymKS("rött")], [new SymKS("röda")], [new SymKS("kort")], [new SymKS("kortt")], [new SymKS("korta")], [new SymKS("liten")], [new SymKS("litet")], [new SymKS("små")], [new SymKS("lilla")], [new SymKS("tjock")], [new SymKS("tjockt")], [new SymKS("tjocka")], [new SymKS("tunn")], [new SymKS("tunt")], [new SymKS("tunna")], [new SymKS("vit")], [new SymKS("vitt")], [new SymKS("vita")], [new SymKS("gul")], [new SymKS("gult")], [new SymKS("gula")], [new SymCat(0, 0), new SymCat(1, 0)], [new SymCat(0, 0), new SymCat(1, 1)], [new SymCat(0, 0), new SymCat(1, 2)], [new SymCat(0, 0), new SymCat(1, 3)], [new SymCat(0, 0), new SymCat(1, 4)], [new SymCat(0, 1)], [new SymCat(0, 2)], [new SymCat(0, 3)], [new SymCat(0, 4)], [new SymKS("så")], [new SymKS("för")], [new SymKS("mycket")], [new SymKS("överallt")], [new SymKS("här")], [new SymKS("någonstans")], [new SymKS("där")], [new SymCat(0, 3), new SymCat(1, 1)], [new SymCat(0, 2), new SymCat(1, 2)], [new SymCat(0, 4), new SymCat(1, 3)], [new SymCat(0, 1), new SymCat(1, 0)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 0), new SymCat(1, 25), new SymCat(1, 93), new SymCat(1, 1), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(1, 1), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 12), new SymCat(1, 25), new SymCat(1, 93), new SymCat(1, 13), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 12), new SymCat(1, 13), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 26), new SymCat(1, 51), new SymCat(1, 93), new SymCat(1, 27), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 26), new SymCat(1, 27), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 38), new SymCat(1, 51), new SymCat(1, 93), new SymCat(1, 39), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 38), new SymCat(1, 39), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 52), new SymCat(1, 77), new SymCat(1, 93), new SymCat(1, 53), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 52), new SymCat(1, 53), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 64), new SymCat(1, 77), new SymCat(1, 93), new SymCat(1, 65), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 64), new SymCat(1, 65), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 2), new SymCat(1, 25), new SymCat(1, 94), new SymCat(1, 3), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 2), new SymCat(1, 3), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 14), new SymCat(1, 25), new SymCat(1, 94), new SymCat(1, 15), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 14), new SymCat(1, 15), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 28), new SymCat(1, 51), new SymCat(1, 94), new SymCat(1, 29), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 28), new SymCat(1, 29), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 40), new SymCat(1, 51), new SymCat(1, 94), new SymCat(1, 41), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 40), new SymCat(1, 41), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 54), new SymCat(1, 77), new SymCat(1, 94), new SymCat(1, 55), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 54), new SymCat(1, 55), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 66), new SymCat(1, 77), new SymCat(1, 94), new SymCat(1, 67), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 66), new SymCat(1, 67), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 4), new SymCat(1, 25), new SymCat(1, 95), new SymCat(1, 5), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 4), new SymCat(1, 5), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 16), new SymCat(1, 25), new SymCat(1, 95), new SymCat(1, 17), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 16), new SymCat(1, 17), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 30), new SymCat(1, 51), new SymCat(1, 95), new SymCat(1, 31), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 30), new SymCat(1, 31), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 42), new SymCat(1, 51), new SymCat(1, 95), new SymCat(1, 43), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 42), new SymCat(1, 43), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 56), new SymCat(1, 77), new SymCat(1, 95), new SymCat(1, 57), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 56), new SymCat(1, 57), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 68), new SymCat(1, 77), new SymCat(1, 95), new SymCat(1, 69), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 68), new SymCat(1, 69), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 6), new SymCat(1, 25), new SymCat(1, 96), new SymCat(1, 7), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 6), new SymCat(1, 7), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 18), new SymCat(1, 25), new SymCat(1, 96), new SymCat(1, 19), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 18), new SymCat(1, 19), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 32), new SymCat(1, 51), new SymCat(1, 96), new SymCat(1, 33), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 32), new SymCat(1, 33), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 44), new SymCat(1, 51), new SymCat(1, 96), new SymCat(1, 45), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 44), new SymCat(1, 45), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 58), new SymCat(1, 77), new SymCat(1, 96), new SymCat(1, 59), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 58), new SymCat(1, 59), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 70), new SymCat(1, 77), new SymCat(1, 96), new SymCat(1, 71), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 70), new SymCat(1, 71), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 8), new SymCat(1, 25), new SymCat(1, 97), new SymCat(1, 9), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 8), new SymCat(1, 9), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 20), new SymCat(1, 25), new SymCat(1, 97), new SymCat(1, 21), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 20), new SymCat(1, 21), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 34), new SymCat(1, 51), new SymCat(1, 97), new SymCat(1, 35), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 34), new SymCat(1, 35), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 46), new SymCat(1, 51), new SymCat(1, 97), new SymCat(1, 47), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 46), new SymCat(1, 47), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 60), new SymCat(1, 77), new SymCat(1, 97), new SymCat(1, 61), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 60), new SymCat(1, 61), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 72), new SymCat(1, 77), new SymCat(1, 97), new SymCat(1, 73), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 72), new SymCat(1, 73), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 10), new SymCat(1, 25), new SymCat(1, 98), new SymCat(1, 11), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 10), new SymCat(1, 11), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 24), new SymCat(1, 22), new SymCat(1, 25), new SymCat(1, 98), new SymCat(1, 23), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 22), new SymCat(1, 23), new SymCat(1, 24), new SymCat(1, 25), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 36), new SymCat(1, 51), new SymCat(1, 98), new SymCat(1, 37), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 36), new SymCat(1, 37), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 50), new SymCat(1, 48), new SymCat(1, 51), new SymCat(1, 98), new SymCat(1, 49), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 48), new SymCat(1, 49), new SymCat(1, 50), new SymCat(1, 51), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 62), new SymCat(1, 77), new SymCat(1, 98), new SymCat(1, 63), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 62), new SymCat(1, 63), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 76), new SymCat(1, 74), new SymCat(1, 77), new SymCat(1, 98), new SymCat(1, 75), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 0), new SymCat(1, 74), new SymCat(1, 75), new SymCat(1, 76), new SymCat(1, 77), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 1), new SymCat(1, 1)], [new SymCat(0, 2), new SymCat(1, 0)], [new SymKS("varje")], [new SymCat(0, 4), new SymCat(1, 0)], [new SymCat(0, 5), new SymCat(1, 1)], [new SymCat(0, 6), new SymCat(1, 0)], [new SymCat(0, 7), new SymCat(1, 1)], [new SymCat(0, 8), new SymCat(1, 0)], [new SymCat(0, 9), new SymCat(1, 1)], [new SymCat(0, 10), new SymCat(1, 0)], [new SymCat(0, 11), new SymCat(1, 1)], [new SymCat(0, 5)], [new SymCat(0, 6)], [new SymCat(0, 7)], [new SymCat(0, 8)], [new SymCat(0, 9)], [new SymCat(0, 10)], [new SymKS("slår")], [new SymKS("slås")], [new SymKS("slog")], [new SymKS("slogs")], [new SymKS("slå")], [new SymKS("slagit")], [new SymKS("slagits")], [], [new SymKS("sönder")], [new SymKS("köper")], [new SymKS("köps")], [new SymKS("köpte")], [new SymKS("köptes")], [new SymKS("köpa")], [new SymKS("köpas")], [new SymKS("köpt")], [new SymKS("köpts")], [new SymKS("är")], [new SymKS("vars")], [new SymKS("var")], [new SymKS("vara")], [new SymKS("varas")], [new SymKS("varit")], [new SymKS("varits")], [new SymKS("dricker")], [new SymKS("dricks")], [new SymKS("drack")], [new SymKS("dracks")], [new SymKS("dricka")], [new SymKS("drickas")], [new SymKS("druckit")], [new SymKS("druckits")], [new SymKS("äter")], [new SymKS("äts")], [new SymKS("åt")], [new SymKS("åts")], [new SymKS("äta")], [new SymKS("ätas")], [new SymKS("ätit")], [new SymKS("ätits")], [new SymKS("flyger")], [new SymKS("flygs")], [new SymKS("flög")], [new SymKS("flögs")], [new SymKS("flyga")], [new SymKS("flygas")], [new SymKS("flugit")], [new SymKS("flugits")], [new SymKS("hatar")], [new SymKS("hatas")], [new SymKS("hatade")], [new SymKS("hatades")], [new SymKS("hata")], [new SymKS("hatat")], [new SymKS("hatats")], [new SymKS("hör")], [new SymKS("hörs")], [new SymKS("hörde")], [new SymKS("hördes")], [new SymKS("höra")], [new SymKS("höras")], [new SymKS("hört")], [new SymKS("hörts")], [new SymKS("jagar")], [new SymKS("jagas")], [new SymKS("jagade")], [new SymKS("jagades")], [new SymKS("jaga")], [new SymKS("jagat")], [new SymKS("jagats")], [new SymKS("springer")], [new SymKS("springs")], [new SymKS("sprang")], [new SymKS("sprangs")], [new SymKS("springa")], [new SymKS("springas")], [new SymKS("sprungit")], [new SymKS("sprungits")], [new SymKS("ser")], [new SymKS("ses")], [new SymKS("såg")], [new SymKS("sågs")], [new SymKS("se")], [new SymKS("sett")], [new SymKS("setts")], [new SymKS("sitter")], [new SymKS("sitts")], [new SymKS("satt")], [new SymKS("satts")], [new SymKS("sitta")], [new SymKS("sittas")], [new SymKS("suttit")], [new SymKS("suttits")], [new SymKS("sover")], [new SymKS("sovs")], [new SymKS("sov")], [new SymKS("sova")], [new SymKS("sovas")], [new SymKS("sovit")], [new SymKS("sovits")], [new SymKS("simmar")], [new SymKS("simmas")], [new SymKS("simmade")], [new SymKS("simmades")], [new SymKS("simma")], [new SymKS("simmat")], [new SymKS("simmats")], [new SymKS("kastar")], [new SymKS("kastas")], [new SymKS("kastade")], [new SymKS("kastades")], [new SymKS("kasta")], [new SymKS("kastat")], [new SymKS("kastats")], [new SymKS("går")], [new SymKS("gås")], [new SymKS("gick")], [new SymKS("gicks")], [new SymKS("gå")], [new SymKS("gått")], [new SymKS("gåtts")], [new SymKS("tycker")], [new SymKS("tycks")], [new SymKS("tyckte")], [new SymKS("tycktes")], [new SymKS("tycka")], [new SymKS("tyckas")], [new SymKS("tyckt")], [new SymKS("tyckts")], [new SymKS("om")], [new SymKS("lyssnar")], [new SymKS("lyssnas")], [new SymKS("lyssnade")], [new SymKS("lyssnades")], [new SymKS("lyssna")], [new SymKS("lyssnat")], [new SymKS("lyssnats")], [new SymKS("på")], [new SymKS("tittar")], [new SymKS("tittas")], [new SymKS("tittade")], [new SymKS("tittades")], [new SymKS("titta")], [new SymKS("tittat")], [new SymKS("tittats")], [new SymKS("vet")], [new SymKS("vets")], [new SymKS("visste")], [new SymKS("visstes")], [new SymKS("veta")], [new SymKS("vetas")], [new SymKS("vetat")], [new SymKS("vetats")], [new SymKS("säger")], [new SymKS("sägs")], [new SymKS("sade")], [new SymKS("sades")], [new SymKS("säga")], [new SymKS("sägas")], [new SymKS("sagt")], [new SymKS("sagts")], [new SymKS("hoppar")], [new SymKS("hoppas")], [new SymKS("hoppade")], [new SymKS("hoppades")], [new SymKS("hoppa")], [new SymKS("hoppat")], [new SymKS("hoppats")], [new SymKS("vill")], [new SymKS("viljs")], [new SymKS("ville")], [new SymKS("villes")], [new SymKS("vilja")], [new SymKS("viljas")], [new SymKS("velat")], [new SymKS("velats")], [new SymKS("cykel")], [new SymKS("cykeln")], [new SymKS("cyklar")], [new SymKS("cyklarna")], [new SymKS("fågel")], [new SymKS("fågeln")], [new SymKS("fåglar")], [new SymKS("fåglarna")], [new SymKS("båt")], [new SymKS("båten")], [new SymKS("båtar")], [new SymKS("båtarna")], [new SymKS("bok")], [new SymKS("boken")], [new SymKS("böcker")], [new SymKS("böckerna")], [new SymKS("pojke")], [new SymKS("pojken")], [new SymKS("pojkar")], [new SymKS("pojkarna")], [new SymKS("bil")], [new SymKS("bilen")], [new SymKS("bilar")], [new SymKS("bilarna")], [new SymKS("katt")], [new SymKS("katten")], [new SymKS("katter")], [new SymKS("katterna")], [new SymKS("stol")], [new SymKS("stolen")], [new SymKS("stolar")], [new SymKS("stolarna")], [new SymKS("ko")], [new SymKS("kon")], [new SymKS("kor")], [new SymKS("korna")], [new SymKS("hund")], [new SymKS("hunden")], [new SymKS("hundar")], [new SymKS("hundarna")], [new SymKS("fisk")], [new SymKS("fisken")], [new SymKS("fiskar")], [new SymKS("fiskarna")], [new SymKS("fot")], [new SymKS("foten")], [new SymKS("fötter")], [new SymKS("fötterna")], [new SymKS("skog")], [new SymKS("skogen")], [new SymKS("skogar")], [new SymKS("skogarna")], [new SymKS("frukt")], [new SymKS("frukten")], [new SymKS("frukter")], [new SymKS("frukterna")], [new SymKS("flicka")], [new SymKS("flickan")], [new SymKS("flickor")], [new SymKS("flickorna")], [new SymKS("hand")], [new SymKS("handen")], [new SymKS("händer")], [new SymKS("händerna")], [new SymKS("hatt")], [new SymKS("hatten")], [new SymKS("hattar")], [new SymKS("hattarna")], [new SymKS("häst")], [new SymKS("hästen")], [new SymKS("hästar")], [new SymKS("hästarna")], [new SymKS("man")], [new SymKS("mannen")], [new SymKS("män")], [new SymKS("männen")], [new SymKS("mjölk")], [new SymKS("mjölken")], [new SymKS("mjölkar")], [new SymKS("mjölkarna")], [new SymKS("person")], [new SymKS("personen")], [new SymKS("personer")], [new SymKS("personerna")], [new SymKS("skjorta")], [new SymKS("skjortan")], [new SymKS("skjortor")], [new SymKS("skjortorna")], [new SymKS("sko")], [new SymKS("skon")], [new SymKS("skor")], [new SymKS("skorna")], [new SymKS("sten")], [new SymKS("stenen")], [new SymKS("stenar")], [new SymKS("stenarna")], [new SymKS("kvinna")], [new SymKS("kvinnan")], [new SymKS("kvinnor")], [new SymKS("kvinnorna")], [new SymKS("djur")], [new SymKS("djuret")], [new SymKS("djuren")], [new SymKS("äpple")], [new SymKS("äpplet")], [new SymKS("äpplen")], [new SymKS("äpplena")], [new SymKS("öl")], [new SymKS("ölet")], [new SymKS("ölen")], [new SymKS("[sak]")], [new SymKS("[saken]")], [new SymKS("[saker]")], [new SymKS("[sakerna]")], [new SymKS("hår")], [new SymKS("håret")], [new SymKS("håren")], [new SymKS("huvud")], [new SymKS("huvudet")], [new SymKS("huvuden")], [new SymKS("huvudena")], [new SymKS("hus")], [new SymKS("huset")], [new SymKS("husen")], [new SymKS("bord")], [new SymKS("bordet")], [new SymKS("borden")], [new SymKS("träd")], [new SymKS("trädet")], [new SymKS("träden")], [new SymKS("vatten")], [new SymKS("vattnet")], [new SymKS("vattnen")], [new SymKS("vin")], [new SymKS("vinet")], [new SymKS("viner")], [new SymKS("vinerna")], [new SymCat(0, 2), new SymCat(1, 1)], [new SymKS("[någonting]")], [new SymCat(0, 3), new SymCat(1, 0)], [new SymCat(0, 2), new SymCat(1, 3)], [new SymCat(0, 1), new SymCat(1, 2)], [new SymCat(0, 1), new SymCat(1, 3)], [new SymCat(0, 3), new SymCat(1, 2)], [new SymCat(0, 3), new SymCat(1, 3)], [new SymKS("Berlin")], [new SymKS("Storbritannien")], [new SymKS("[namn]")], [new SymKS("Tyskland")], [new SymKS("Göteborg")], [new SymKS("Johan")], [new SymKS("London")], [new SymKS("Maria")], [new SymKS("Sverige")], [new SymKS("av")], [new SymKS("i")], [new SymKS("med")], [new SymKS("jag")], [new SymKS("mig")], [new SymKS("de")], [new SymKS("dem")], [new SymKS("vi")], [new SymKS("oss")], [new SymKS("han")], [new SymKS("honom")], [new SymKS("hon")], [new SymKS("henne")], [new SymKS("en")], [new SymKS("ett")], [new SymKS("den")], [new SymKS("det")], [new SymKS("den"), new SymKS("där")], [new SymKS("det"), new SymKS("där")], [new SymKS("de"), new SymKS("där")], [new SymKS("den"), new SymKS("här")], [new SymKS("det"), new SymKS("här")], [new SymKS("de"), new SymKS("här")], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 0)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 1)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 8)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 9)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 4)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 5)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 2)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 3)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 10)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 11)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 6)], [new SymCat(0, 0), new SymCat(1, 0), new SymCat(2, 7)], [new SymCat(0, 0), new SymKS(".")], [new SymKS("inte")], [new SymKS("har")], [new SymCat(0, 11)], [new SymCat(0, 12)], [new SymCat(0, 13)], [new SymCat(0, 14)], [new SymCat(0, 15)], [new SymCat(0, 16)], [new SymCat(0, 17)], [new SymCat(0, 18)], [new SymCat(0, 19)], [new SymCat(0, 20)], [new SymCat(0, 21)], [new SymCat(0, 22)], [new SymCat(0, 23)], [new SymCat(0, 24)], [new SymCat(0, 25)], [new SymCat(0, 26)], [new SymCat(0, 27)], [new SymCat(0, 28)], [new SymCat(0, 29)], [new SymCat(0, 30)], [new SymCat(0, 31)], [new SymCat(0, 32)], [new SymCat(0, 33)], [new SymCat(0, 34)], [new SymCat(0, 35)], [new SymCat(0, 36)], [new SymCat(0, 37)], [new SymCat(0, 38)], [new SymCat(0, 39)], [new SymCat(0, 40)], [new SymCat(0, 41)], [new SymCat(0, 42)], [new SymCat(0, 43)], [new SymCat(0, 44)], [new SymCat(0, 45)], [new SymCat(0, 46)], [new SymCat(0, 47)], [new SymCat(0, 48)], [new SymCat(0, 49)], [new SymCat(0, 50)], [new SymCat(0, 51)], [new SymCat(0, 52)], [new SymCat(0, 53)], [new SymCat(0, 54)], [new SymCat(0, 55)], [new SymCat(0, 56)], [new SymCat(0, 57)], [new SymCat(0, 58)], [new SymCat(0, 59)], [new SymCat(0, 60)], [new SymCat(0, 61)], [new SymCat(0, 62)], [new SymCat(0, 63)], [new SymCat(0, 64)], [new SymCat(0, 65)], [new SymCat(0, 66)], [new SymCat(0, 67)], [new SymCat(0, 68)], [new SymCat(0, 69)], [new SymCat(0, 70)], [new SymCat(0, 71)], [new SymCat(0, 72)], [new SymCat(0, 73)], [new SymCat(0, 74)], [new SymCat(0, 75)], [new SymCat(0, 76)], [new SymCat(0, 77)], [new SymCat(0, 78)], [new SymCat(0, 79)], [new SymCat(0, 80)], [new SymCat(0, 81)], [new SymCat(0, 82)], [new SymCat(0, 83)], [new SymCat(0, 84)], [new SymCat(0, 85)], [new SymCat(0, 86)], [new SymCat(0, 87)], [new SymCat(0, 88)], [new SymCat(0, 89)], [new SymCat(0, 90)], [new SymCat(0, 91), new SymCat(1, 0)], [new SymCat(0, 92)], [new SymCat(0, 93)], [new SymCat(0, 94)], [new SymCat(0, 95)], [new SymCat(0, 96)], [new SymCat(0, 97)], [new SymCat(0, 98)], [new SymCat(0, 99)], [new SymCat(0, 100)], [new SymCat(0, 101)], [new SymCat(0, 102)], [new SymCat(0, 103)], [new SymCat(0, 104)], [new SymCat(0, 19), new SymKS("att"), new SymCat(1, 1)], [new SymCat(0, 16), new SymCat(0, 15), new SymCat(1, 78), new SymCat(1, 79), new SymCat(1, 90), new SymCat(1, 93), new SymCat(1, 99), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 16), new SymCat(0, 15), new SymCat(1, 80), new SymCat(1, 81), new SymCat(1, 90), new SymCat(1, 94), new SymCat(1, 100), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 16), new SymCat(0, 15), new SymCat(1, 82), new SymCat(1, 83), new SymCat(1, 90), new SymCat(1, 95), new SymCat(1, 101), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 16), new SymCat(0, 15), new SymCat(1, 84), new SymCat(1, 85), new SymCat(1, 90), new SymCat(1, 96), new SymCat(1, 102), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 16), new SymCat(0, 15), new SymCat(1, 86), new SymCat(1, 87), new SymCat(1, 90), new SymCat(1, 97), new SymCat(1, 103), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 16), new SymCat(0, 15), new SymCat(1, 88), new SymCat(1, 89), new SymCat(1, 90), new SymCat(1, 98), new SymCat(1, 104), new SymCat(1, 91), new SymCat(1, 92)], [new SymCat(0, 10), new SymCat(1, 2)], [new SymCat(0, 10), new SymCat(1, 1)], [new SymCat(0, 10), new SymCat(0, 8), new SymCat(1, 1)], [new SymCat(0, 8), new SymCat(1, 1)], [new SymCat(0, 10), new SymCat(0, 8), new SymCat(1, 1), new SymCat(2, 0)], [new SymCat(0, 10), new SymCat(0, 8), new SymCat(1, 1), new SymCat(2, 2)], [new SymCat(0, 10), new SymCat(0, 8), new SymCat(1, 1), new SymCat(2, 1)], [new SymCat(0, 10), new SymCat(2, 0)], [new SymCat(0, 10), new SymCat(2, 2)], [new SymCat(0, 10), new SymCat(0, 8), new SymCat(1, 1), new SymCat(0, 9), new SymCat(2, 1)], [new SymCat(0, 10), new SymCat(0, 9), new SymCat(2, 1)]], { A: { s: 0, e: 1 }, A2: { s: 2, e: 5 }, AP: { s: 6, e: 7 }, AdA: { s: 8, e: 8 }, AdN: { s: 9, e: 9 }, AdV: { s: 10, e: 10 }, Adv: { s: 11, e: 11 }, Adverb: { s: 12, e: 12 }, Ant: { s: 13, e: 14 }, CAdv: { s: 15, e: 15 }, CN: { s: 16, e: 19 }, Card: { s: 20, e: 21 }, Cl: { s: 22, e: 22 }, ClSlash: { s: 23, e: 24 }, Comp: { s: 25, e: 25 }, Conj: { s: 26, e: 29 }, DAP: { s: 30, e: 35 }, Det: { s: 36, e: 41 }, Digits: { s: 42, e: 43 }, Float: { s: -3, e: -3 }, GraspV: { s: 44, e: 55 }, GraspVQ: { s: 56, e: 91 }, GraspVS: { s: 92, e: 127 }, GraspVV: { s: 128, e: 199 }, IAdv: { s: 200, e: 200 }, IComp: { s: 201, e: 201 }, IDet: { s: 202, e: 207 }, IP: { s: 208, e: 211 }, IQuant: { s: 212, e: 214 }, Imp: { s: 215, e: 215 }, Int: { s: -2, e: -2 }, Interj: { s: 216, e: 216 }, N: { s: 217, e: 218 }, N2: { s: 219, e: 222 }, N3: { s: 223, e: 230 }, NP: { s: 231, e: 254 }, Num: { s: 255, e: 258 }, Numeral: { s: 259, e: 260 }, Ord: { s: 261, e: 261 }, PConj: { s: 262, e: 262 }, PN: { s: 263, e: 264 }, Phr: { s: 265, e: 265 }, Pol: { s: 266, e: 267 }, Predet: { s: 268, e: 270 }, Prep: { s: 271, e: 271 }, Pron: { s: 272, e: 283 }, QCl: { s: 284, e: 284 }, QS: { s: 285, e: 285 }, Quant: { s: 286, e: 288 }, RCl: { s: 289, e: 296 }, RP: { s: 297, e: 309 }, RS: { s: 310, e: 317 }, S: { s: 318, e: 318 }, SC: { s: 319, e: 319 }, SSlash: { s: 320, e: 321 }, Start: { s: 322, e: 322 }, String: { s: -1, e: -1 }, Subj: { s: 323, e: 323 }, Temp: { s: 324, e: 333 }, Tense: { s: 334, e: 338 }, Text: { s: 339, e: 339 }, Utt: { s: 340, e: 340 }, V: { s: 341, e: 343 }, V2: { s: 344, e: 349 }, V2A: { s: 350, e: 355 }, V2Q: { s: 356, e: 361 }, V2S: { s: 362, e: 367 }, V2V: { s: 368, e: 379 }, V3: { s: 380, e: 391 }, VA: { s: 392, e: 394 }, VP: { s: 395, e: 402 }, VPSlash: { s: 403, e: 418 }, VQ: { s: 419, e: 421 }, VS: { s: 422, e: 424 }, VV: { s: 425, e: 430 }, Voc: { s: 431, e: 431 } }, 501) });
///<reference path="GF.ts"/>
///<reference path="generated/grammar.ts"/>
var Grammar = Grasp;
var Languages = ["GraspSwe", "GraspEng", "GraspGer"];
var StartCat = 'Start';
var MapWordsToHTML = {};
var Metadata = {};
// MapWordsToHTML['GraspZbl'] = map_words_to_images;
// Metadata['GraspZbl'] = BlissMetadata;
var DefaultTree1 = parseGFTree("(StartUtt (UttS (UseCl (Pres) (Neg) (PredVP (UsePron (she_Pron)) " +
    "(UseVN (break_V) (DetCN (DetQuant (DefArt) (NumPl)) " +
    "(ModCN (UseA (yellow_A)) (UseN (stone_N)))))))))");
var DefaultTree2 = parseGFTree("(StartUtt (UttS (UseCl (Perf) (Pos) (PredVP (UsePN (mary_PN)) " +
    "(UseVN (eat_V) (AdvNP (DetCN (DetQuant (IndefArt) (NumPl)) " +
    "(UseN (fish_N))) (UseAdverb (here_Adverb))))))))");
///<reference path="Utilities.ts"/>
///<reference path="muste.ts"/>
///<reference path="lib/jquery.d.ts"/>
///<reference path="muste-init.ts"/>
var ABSTRACT = 'Abstract';
var CONCRETE = 'Concrete';
var STRIKED = 'striked';
var HIGHLIGHTED = 'highlighted';
var CORRECT = 'correct';
var MATCHING = 'matching';
var NOSPACING = "&+";
var PUNCTUATION = /^[\,\;\.\?\!\)]$/;
var PREFIXPUNCT = /^[¿¡\(]$/;
$(Utilities.BUSY(function () {
    Utilities.START_TIMER("initialize", true);
    initialize_gui();
    initialize_grammar(Grammar);
    Utilities.STOP_TIMER("initialize");
    regenerate_trees();
}));
function initialize_gui() {
    $('#body')
        .click(click_body);
    $('#mainmenu-toggler')
        .click(toggle_mainmenu);
    $('#restart-button')
        .click(Utilities.BUSY(restart));
    $('#connected')
        .click(Utilities.BUSY(toggle_connected));
    $('#debugging')
        .click(toggle_debug);
    var prefix = Utilities.common_prefix(Languages);
    ['L1', 'L2'].forEach(function (L, L_index) {
        Languages.forEach(function (lang, lang_index) {
            $('#' + Utilities.join(L, 'menu'))
                .append($('<input>', { type: 'radio',
                name: Utilities.join(L, 'group'),
                id: Utilities.join(L, lang),
                value: lang,
                checked: L_index == lang_index,
                click: Utilities.BUSY(redraw_sentences) }))
                .append($('<label></label>', { 'for': Utilities.join(L, lang),
                text: lang.slice(prefix.length)
            }));
        });
    });
}
// http://www.hunlock.com/blogs/Mastering_The_Back_Button_With_Javascript
// window.onbeforeunload = function () {
//    return "Are you sure you want to leave this now?";
// }
// window.location.hash = "no-back-button";
// window.onhashchange = function(){window.location.hash="no-back-button";}
// window.onpopstate = function (event) {
//     if (event.state) {
//         CurrentPage = event.state.page;
//         var trees = event.state.trees;
//         for (var lang in trees) {
//             set_and_show_tree(lang, trees[lang]);
//         }
//     }
// };
function trees_are_connected() {
    return $('#connected').prop('checked');
}
function toggle_connected() {
    console.log("CONNECTED");
    if (trees_are_connected()) {
        set_and_show_tree('L2', $('#L1').data('tree'));
    }
    mark_correct_phrases();
}
function toggle_mainmenu() {
    $('#mainmenu').toggle();
}
function current_language(L) {
    return $('#' + Utilities.join(L, 'menu') + ' :checked').val();
}
function redraw_sentences() {
    set_and_show_tree('L1', $('#L1').data('tree'));
    set_and_show_tree('L2', $('#L2').data('tree'));
    mark_correct_phrases();
}
function click_body(event) {
    var prevented = $(event.target).closest('.prevent-body-click').length > 0;
    if (!prevented) {
        clear_selection();
    }
}
function restart() {
    var sure = true; // confirm("Are you sure you want to restart the game?");
    if (sure) {
        console.log("RESTART");
        regenerate_trees();
    }
}
function toggle_debug() {
    var debugging = $('#debugging').prop('checked');
    console.log("DEBUG", debugging);
    $('.debug').toggle(debugging);
}
function generate_random_tree() {
    return Grammar.abs.generate(StartCat, null, null, function (f) {
        return !startswith(f, "default_");
    });
}
function regenerate_trees() {
    Utilities.START_TIMER("regenerate_trees", true);
    if (trees_are_connected()) {
        var tree = (typeof DefaultTree1 == "object") ? DefaultTree1 : generate_random_tree();
        set_and_show_tree('L1', tree);
        set_and_show_tree('L2', tree);
    }
    else {
        var tree1 = (typeof DefaultTree1 == "object") ? DefaultTree1 : generate_random_tree();
        var tree2 = (typeof DefaultTree2 == "object") ? DefaultTree2 : generate_random_tree();
        set_and_show_tree('L1', tree1);
        set_and_show_tree('L2', tree2);
    }
    $('#score').text(0);
    Utilities.STOP_TIMER("regenerate_trees");
    mark_correct_phrases();
}
function select_tree(data) {
    if (trees_are_connected()) {
        set_and_show_tree('L1', data.tree);
        set_and_show_tree('L2', data.tree);
    }
    else {
        set_and_show_tree(data.lang, data.tree);
    }
    var score = $('#score');
    score.text(parseInt(score.text()) + 1);
    mark_correct_phrases();
}
function mark_correct_phrases() {
    Utilities.START_TIMER("mark-correct", true);
    $('.' + CORRECT).removeClass(CORRECT);
    $('.' + MATCHING).removeClass(MATCHING);
    if (!trees_are_connected()) {
        var t1 = $('#L1').data('tree');
        var t2 = $('#L2').data('tree');
        if (t1.toString() == t2.toString()) {
            $('.L1-').addClass(CORRECT);
            $('.L2-').addClass(CORRECT);
        }
        else {
            var equals = equal_phrases('L1', t1, 'L2', t2);
            $('.phrase').each(function () {
                var L = $(this).data('lang');
                var path = $(this).data('path');
                var refpath = equals[L][path];
                $(this).toggleClass(MATCHING, Boolean(refpath));
            });
        }
    }
    Utilities.STOP_TIMER("mark-correct");
}
function set_and_show_tree(L, tree) {
    clear_selection();
    var lang = current_language(L);
    console.log(L, "/", lang, "-->", tree.toString());
    var lin = Linearise(lang, tree);
    var brackets = bracketise(lin);
    var sentence = map_words_and_spacing(lang, L, lin, brackets, click_word);
    $('#' + Utilities.join(L, 'sentence')).empty().append(sentence);
    var abslin = linearise_abstract(tree);
    $('#' + Utilities.join(L, 'tree')).text(mapwords(abslin).join(" "));
    $('#' + L).data('tree', tree);
    var menus = initialize_menus(lang, tree);
    $('#' + L).data('menus', menus);
}
function map_words_and_spacing(lang, L, lin, brackets, handler) {
    if (typeof MapWordsToHTML == "object" && lang in MapWordsToHTML) {
        return MapWordsToHTML[lang](Metadata[lang], mapwords(lin), handler);
    }
    else {
        return map_words_to_html(L, lin, brackets, handler);
    }
}
function map_words_to_html(L, lin, bracketed_lin, handler) {
    function bracket_html(n, brackets) {
        var path = brackets.path;
        var phrase = $('<span class="phrase"></span>')
            .addClass(Utilities.join(L, path))
            .data({ 'path': path, 'start': n, 'lang': L });
        for (var i = 0; i < brackets.tokens.length; i++) {
            var tokn = brackets.tokens[i];
            if (tokn instanceof BracketedLin) {
                var subphrase = bracket_html(n, tokn)
                    .appendTo(phrase);
                n = subphrase.data('end');
            }
            else if (tokn instanceof BracketedToken) {
                if (tokn.word !== NOSPACING) {
                    var word = tokn.word;
                    if (n == 0) {
                        word = word.charAt(0).toUpperCase() + word.slice(1);
                    }
                    var debugpath = $('<sub class="debug"></sub>').text(path)
                        .toggle($('#debugging').prop('checked'));
                    var w = $('<span class="word"></span>')
                        .data({ 'nr': tokn.n, 'L': L, 'path': path })
                        .addClass(Utilities.join("W" + L, path))
                        .html(word)
                        .append(debugpath)
                        .appendTo(phrase);
                    if (handler) {
                        w.addClass('clickable').click(Utilities.BUSY(handler));
                    }
                    if (n !== tokn.n)
                        console.log("ERROR:", n, tokn.n);
                    n = tokn.n + 1;
                }
            }
            if (i < brackets.tokens.length - 1) {
                var previous = lin[n - 1].word;
                var current = lin[n].word;
                // SPACING
                var debugpath = $('<sub class="debug"></sub>').text(path)
                    .toggle($('#debugging').prop('checked'));
                var s = $('<span class="space"></span>')
                    .data({ 'nr': n, 'L': L, 'path': path })
                    .addClass(Utilities.join("S" + L, path))
                    .append(debugpath)
                    .appendTo(phrase);
                if (previous == NOSPACING || current == NOSPACING || PREFIXPUNCT.test(previous) || PUNCTUATION.test(current)) {
                    s.text(' ');
                }
                else {
                    s.html(' &nbsp; ');
                }
                if (handler) {
                    s.addClass('clickable').click(Utilities.BUSY(handler));
                }
            }
        }
        phrase.data('end', n);
        return phrase;
    }
    return bracket_html(0, bracketed_lin);
}
/*** THIS FUNCTION IS NOT UP-TO-DATE ***/
function map_words_to_images(metadata, words, callback) {
    var sentence = $('<span></span>');
    var prefix, suffix;
    var indicator_elem = $('<span class="indicator">');
    var indicator_wdt = 0;
    for (var i = 0; i < words.length; i++) {
        var previous = words[i - 1], word = words[i], next = words[i + 1];
        if (word == NOSPACING)
            continue;
        var imgsrc = metadata['images'][word];
        var img = (imgsrc ? $('<img>').attr('src', imgsrc).attr('alt', word).attr('title', word)
            : $('<span>').attr('title', word).text(word));
        var wdt = metadata['widths'][word] || 40; // default width
        if (word in metadata['indicators']) {
            if (!indicator_elem) {
                var indicator_elem = $('<span class="indicator">');
            }
            indicator_elem.append(callback(i, img));
            indicator_wdt += wdt;
        }
        else {
            if (previous != NOSPACING)
                sentence.append($('<span class="leftspace">').html('&nbsp;&nbsp;'));
            var left = (wdt - indicator_wdt) / 2;
            indicator_elem.attr('style', 'left:' + left);
            $('<span class="symbol">').append(indicator_elem).append(callback(i, img)).appendTo(sentence);
            if (next != NOSPACING && next != "question_mark" && next != "exclamation_mark")
                sentence.append($('<span class="rightspace">').html('&nbsp;&nbsp;'));
            indicator_elem = $('<span class="indicator">');
            indicator_wdt = 0;
        }
    }
    return sentence;
}
function clear_selection() {
    $('.' + HIGHLIGHTED).removeClass(HIGHLIGHTED).removeData('span');
    $('.' + STRIKED).removeClass(STRIKED);
    $('#menu').empty().hide();
    $('#mainmenu').hide();
}
function next_span(wordnr, span, maxwidth) {
    if (!span)
        return [wordnr, wordnr];
    var left = span[0], right = span[1];
    if (left > 0 && right > wordnr) {
        return [left - 1, right - 1];
    }
    var width = right - left + 1;
    if (width <= maxwidth) {
        left = wordnr;
        right = wordnr + width;
        if (right >= maxwidth) {
            right = maxwidth - 1;
            left = right - width;
        }
        if (left >= 0) {
            return [left, right];
        }
    }
    return null;
}
function click_word(clicked0) {
    var clicked = $(clicked0);
    var isspace = clicked.hasClass('space');
    var lang = clicked.data('L');
    var wordnr = clicked.data('nr');
    var wordpath = clicked.data('path');
    var maxwidth = $('#' + Utilities.join(lang, 'sentence') + ' .word').length;
    var innermost_phrase = $('.' + Utilities.join(lang, wordpath));
    var span;
    var phrase;
    if (clicked.hasClass(STRIKED)) {
        var striked_nrs = $('.' + STRIKED).map(function (ix, elem) {
            return $(elem).data('nr');
        });
        span = [Math.min.apply(null, striked_nrs), Math.max.apply(null, striked_nrs)];
        if (isspace) {
            if (span[0] == span[1]) {
                span[1]--;
            }
        }
        phrase = $(' .' + HIGHLIGHTED).data('path');
    }
    var all_menus = $('#' + lang).data('menus');
    var menus;
    var menuphrases;
    var menu;
    clear_selection();
    if (span) {
        isspace = span[0] > span[1];
        menus = all_menus[span.join(":")];
        menuphrases = Object.keys(menus).sort(function (x, y) {
            return y.length - x.length;
        });
        var n = 1;
        while (menuphrases[n] && menuphrases[n - 1] !== phrase)
            n++;
        phrase = menuphrases[n];
        if (phrase) {
            menu = menus[phrase];
        }
    }
    if (!menu) {
        if (span) {
            menus = null;
            if (isspace)
                return;
        }
        else {
            span = isspace ? [wordnr, wordnr - 1] : next_span(wordnr);
            menus = all_menus[span.join(":")];
        }
        while (!menus) {
            if (isspace)
                return;
            span = next_span(wordnr, span, maxwidth);
            if (!span)
                return;
            menus = all_menus[span.join(":")];
        }
        menuphrases = Object.keys(menus).sort(function (x, y) {
            return y.length - x.length;
        });
        phrase = menuphrases[0];
        menu = menus[phrase];
    }
    console.log('SPAN:', span, 'PATH:', phrase, 'MENU:', menu.length + ' items');
    $('.' + Utilities.join(lang, phrase)).addClass(HIGHLIGHTED);
    if (isspace) {
        clicked.addClass(STRIKED);
    }
    else {
        $('#' + lang).find('.word')
            .filter(function () {
            var nr = $(this).data('nr');
            return span[0] <= nr && nr <= span[1];
        })
            .addClass(STRIKED);
        $('#' + lang).find('.space')
            .filter(function () {
            var nr = $(this).data('nr');
            return span[0] < nr && nr <= span[1];
        })
            .addClass(STRIKED);
    }
    for (var itemix = 0; itemix < menu.length; itemix++) {
        var item = menu[itemix];
        var menuitem = $('<span class="clickable">')
            .data({ 'tree': item.tree, 'lang': lang })
            .click(Utilities.BUSY(function (c) {
            select_tree($(c).data());
        }));
        if (item.lin.length == 0) {
            menuitem.append($('<span></span>').html("&empty;"));
        }
        else {
            var words = mapwords(item.lin).join(' ');
            $('<span></span>').text(words)
                .appendTo(menuitem);
        }
        $('<li>').append(menuitem).appendTo($('#menu'));
    }
    var top = clicked.offset().top + clicked.height() * 3 / 4;
    var left = clicked.offset().top + (clicked.width() - $('#menu').width()) / 2;
    var striked = $('.' + STRIKED);
    if (striked.length) {
        left = (striked.offset().left + striked.last().offset().left +
            striked.last().width() - $('#menu').width()) / 2;
    }
    $('#menu').css({
        'top': top + 'px',
        'left': left + 'px',
        'max-height': (window.innerHeight - top - 6) + 'px'
    }).show();
}
