
module Utilities {

    // String utilities

    export function common_prefix(sequences) {
        if (!sequences.length) {
            return [];
        }
        var minlen = Math.min.apply(this, sequences.map(function(seq){return seq.length}));
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

    // export function commonPrefix(s1 : string, s2 : string) : string {
    //     var len = Math.min(s1.length, s2.length);
    //     for (var i=0; i < len; i++) {
    //         if (s1[i] !== s2[i])
    //             return s1.slice(0,i);
    //     }
    //     return s1.slice(0,len);
    // }

    
    // List utilities

    export function join(...args : string[]) : string {
        return Array.prototype.slice.apply(args).join('-');
    }

    export function split(s : string) : string[] {
        return s.split('-');
    }

    export function array_cmp(a, b) {
        if (a instanceof Array) {
            if (b instanceof Array) {
                var alen = a.length, blen = b.length;
                if (alen < blen) return -1;
                if (alen > blen) return 1;
                for (var i = 0; i < alen; i++) {
                    var cmp = array_cmp(a[i], b[i]);
                    if (cmp) return cmp;
                }
                return 0;
            } else {
                return 1;
            }
        } else if (b instanceof Array) {
            return -1;
        } else {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        }
    }


    export function array_eq(a, b) {
        if (a instanceof Array) {
            if (b instanceof Array) {
                var alen = a.length, blen = b.length;
                if (alen !== blen) return false;
                for (var i = 0; i < alen; i++) {
                    var eq = array_eq(a[i], b[i]);
                    if (!eq) return eq;
                }
                return true;
            } else {
                return false;
            }
        } else if (b instanceof Array) {
            return false;
        } else {
            return a == b;
        }
    }


    export function flatten(obj) {
        if (obj instanceof Array) {
            var list = [];
            for (var i = 0; i < obj.length; i++) {
                list.push.apply(list, flatten(obj[i]));
            }
            return list;
        } else {
            return [obj];
        }
    }



    // Converting a list of strings into a string, so that the original list can be retrieved

    export function ishash(hash) {
        return (typeof(hash) == "string" && /^\{\[\"[0-9]/.test(hash));
    }


    export function hash(args) {
        return JSON.stringify(args);
    }


    export function unhash(hash) {
        return JSON.parse(hash);
    }


    // Timing

    var TIMERS = {};

    export function START_TIMER(n, fresh?) {
        if (fresh) {
            if (TIMERS[n]) {
                if (TIMERS[n] < -100) STOP_TIMER(n);
                var i = 1;
                while (TIMERS[n+"."+i]) i++;
                TIMERS[n+"."+i] = TIMERS[n];
            } 
            TIMERS[n] = -Date.now();
        } else {
            if (!TIMERS[n]) TIMERS[n] = 0;
            TIMERS[n] -= Date.now();
        }
    }

    export function GET_TIMER(n) {
        return TIMERS[n] + Date.now();
    }

    export function STOP_TIMER(n) {
        TIMERS[n] += Date.now();
    }

    export function LOG_TIMERS() {
        var out = [];
        for (var key in TIMERS) {
            out.push(key + ": " + Math.round(TIMERS[key]/100)/10)
        }
        out.sort();
        console.log("TIMERS", out.join(", "));
        TIMERS = {};
    }


    export function getTime() {
        return Date.now();
    }


    export function showTime(start) {
        return (getTime() - start).toFixed(1) + " ms";
    }


    // Pretty-printing

    export function strObject(obj : any) : string {
        var result : string[] = [];
        if (obj == null) {
	        return "" + obj;
        } else if (obj instanceof Array) {
            obj.forEach((o) => {
                result.push(strObject(o));
            });
	        // result = obj.map(function(o){
	        //     return strObject(o);
	        // });
	        return "[" + result.join(", ") + "]";
        } else if (obj instanceof Object) {
	        for (var key in obj) {
	            result.push(key + ": " + strObject(obj[key]));
	        }
	        return "{" + result.join(", ") + "}";
        } else if (typeof obj == "string") {
	        return '"' + obj + '"'
        } else {
	        return "" + obj;
        }
    }


    // Busy indicator

    var BUSY_DELAY = 50;
    var BUSY_STR = "\u25CF";
    // Unicode Character 'BLACK CIRCLE' (U+25CF)

    export function BUSY(f) {
        return function(){
            var obj = this; // $(this);
            push_busy();
            setTimeout(function(){
                f(obj);
                pop_busy();
                LOG_TIMERS();
            }, BUSY_DELAY);
        };
    }

    export function push_busy() {
        var ind = document.getElementById('busy-indicator');
        ind.className = ind.className + BUSY_STR;
        ind.textContent += BUSY_STR;
    }

    export function pop_busy() {
        var ind = document.getElementById('busy-indicator');
        if (ind.className.slice(-BUSY_STR.length) === BUSY_STR) {
            ind.className = ind.className.slice(0, -BUSY_STR.length);
            ind.textContent = ind.textContent.slice(0, -BUSY_STR.length);
        } else {
            console.log("POP ERROR", ind.className, ind.textContent);
        }
    }


    // Error handling

    export function alertError(title, description) {
        alert("*** " + title + "***\n" + description);
    }

}
