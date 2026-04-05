/*
var code1=`times 2 ( print add ( add 1.5 2 ) 3 print "ciao Dario! 1+2=3 using (( ))" )`
var defs1={print:1, add:2}
var program1={code:code1,defs:defs1,start:2}

var code2=`(
    
def factorial 1
if == 0 $1
1
* $1 factorial + -1 $1

print factorial 3

)`
var defs2={def:3,factorial:1,out:1,if:3,"==":2,"+":2,"*":2,"#1":0}
var program2={code:code2,defs:defs2,start:0}
// start: 1 -> 16 , 17 -> 5 , 0 -> 23 (1+16+5+1==23)

var program=program1

var code=program.code
var words=parseCode(code)
var defs=program.defs
*/

//console.log("words:",words)
var phraseLengths = [];
var stateChangeListener = null;
var printSink = null;
//console.log("phraseLength(wordIndex):",phraseLength(program.start))
//console.log(phraseLengths)

///////////////////////////////
var words = ["("]; // begin ( ... ) sequence
function exec(code) {
  var print = console.log; // shorter

  var previousLength = words.length;
  var parsedWords = parseCode(code); // parse .sp code (spaced)
  // feature: word-code can grow with exec() calls (REPL, etc)
  words = words.concat(parsedWords);
  print("words:", words);

  // pre-scan arities
  // composite names (id#arity)
  for (var word of words) {
    if (
      word.indexOf("#") != -1 &&
      /* "word" should not be a JSON string:
            valid, process it: function_name#arity
            not valid, ignore it, skip it: "JSON string containing # hash-mark"
            */
      typeof parse(word) != "string"
    ) {
      var parts = word.split("#");
      var id = parts[0];
      var arity = parseInt(parts[1]);

      var entry = {
        arity: arity,
        word: word,
      };

      namespace.arities[id] = entry;
    }
  }

  phraseLengths = [];
  phraseLength(0);
  print("phraseLengths:", phraseLengths);

  function zip_pairs(a, b) {
    var output = "[";
    for (var i = 0; i < a.length; i++) {
      output += `${a[i]}:${b[i]} `;
    }
    return output + "]";
  }
  print("zipped:", zip_pairs(words, phraseLengths));

  print("[begin]"); // program start
  var returned = wordExec(previousLength); // execute only the added code
  print("[end]");
  if (typeof stateChangeListener == "function") {
    try {
      stateChangeListener({
        words: words,
        phraseLengths: phraseLengths,
        previousLength: previousLength,
      });
    } catch (error) {
      console.error("onPangeaStateChange error:", error);
    }
  }
  return returned;
}

function setStateChangeListener(listener) {
  stateChangeListener = typeof listener == "function" ? listener : null;
}

function setPrintSink(listener) {
  printSink = typeof listener == "function" ? listener : null;
}

function resetRuntime() {
  words = ["("];
  phraseLengths = [];
  namespace.arities = {};
  namespace.stack = [{}];
  namespace.times_stack = [];
  namespace.each_stack = [];
}

function main1() {
  var out = console.log;

  code = `print "hello world!"`;
  ///exec(code)

  exec("2 times " + code);
  //out("out:",exec("1 + 2")) // add 1 2

  // add ( add 1.5 2 ) 3
  var code1 = `2 times ( print 1.5 + 2 + 3 print "ciao Dario! 1+2=3 using (( ))" )`;
  exec(code1);

  exec(`( def times_test#1 ( arg 1 ) times print "*time*"
    times_test 3 )`);

  return;
  if (false)
    exec(`(
        def func#0
        ( print add 49 51 )
        func#0
        dont test#2 49 51
        )`);

  ///def "test" 2 //print "$1" print "$2" //2 ( print "test" )
  // dont def test#2 ( add 49 51 )
  //def test#2 ( add 49 51 )

  // dont test#2 49 51

  var arg_test1 = `(
    
        dont "tested:params/arity"
        def func#1 (
            print + arg 1 3
            print "func return"
        )
        func 2
        
        )`;
  var arg_test2 = `(
    def factorial#1 (
        if == 0 arg 1
        1
        * arg 1 factorial + -1 arg 1
    )
    print "factorial of 3"
    print factorial 3
    
    )`;

  // [begin]
  out("exec:", exec(arg_test2));

  exec(`times 3 print times_count 1`);

  exec(`times 2 times 3 ( print times_count 2 print times_count 1 )`);
  // 1 1 1 2 1 3 2 1 2 2 2 3

  exec(`( print "fizz-buzz game"

def multiple#2
== 0 modulus arg 1 arg 2

def i#0
times_count 1

def multiple_of#1
multiple i arg 1

times 20 (
    
    print
    if multiple_of 15 "fizz-buzz"
    if multiple_of 3 "fizz"
    if multiple_of 5 "buzz"
    i
)
    
)`);

  exec(`(
    print [ 11 22 33 ]
)`);

  exec(`(
    print { "a" 11 "b" 22 "c" 33 }
)`);
}

function main2() {
  ///exec("print ( 3 - 4 + 1 )")
  ///exec("print ( 3 + -4 + 1 )")

  //exec("print ( + + 3 -4 1 )")

  exec("print 3 squared"); // 9
  //console.log(exec("print 4 squared"))

  console.log(exec("print 2 ** 3")); // 8

  console.log(exec("print 2 + 3 ** 2")); // 11

  console.log(exec("print ( 2 + 3 ) ** ( 1 + 1 )")); // 25
}
//[begin]
//////////////////////////////////
squared.operator = "postfix";
squared.arity = 0;
function squared(params) {
  var n = wordExec(params[0], true);
  return n ** 2;
}
//////////////////////////////////
exponent.operator = "infix";
exponent.arity = 1;
exponent.aliases = ["**"];
exponent.chainable = true;
function exponent(params) {
  var n = wordExec(params[0], true);
  var exp = wordExec(params[1], true);
  return n ** exp;
}
//////////////////////////////////
// what when condition else-what
when.operator = "infix";
when.arity = 2;
function when(params) {
  var condition = wordExec(params[1], true);
  return condition ? /*what*/ wordExec(params[0], true) : /* else-what */ wordExec(params[2]);
}
//////////////////////////////////
times.operator = "infix";
times.arity = 1;
function times(params) {
  var times = wordExec(params[0], true);
  var returned;
  // TODO times/stop like while/break: break function called passed from here to block's namespace by reference
  var breakRef = [false];

  var stack = namespace.times_stack;
  stack.push(1);

  for (var i = 0; i < times; i++) {
    if (breakRef[0]) break; // TODO variable "by reference"
    returned = wordExec(params[1]); // exec block, keep full phrase semantics

    stack[stack.length - 1]++;
  }

  stack.pop();

  return returned;
}

times_count.arity = 1;
times_count.atomicArgs = true;
function times_count(params) {
  var depth = wordExec(params[0], true); // starting from 1
  var stack = namespace.times_stack;
  return stack[stack.length - depth];
}
//////////////////////////////////
each.operator = "infix";
each.arity = 1;
function each(params) {
  var iterable = wordExec(params[0], true);
  var returned;

  var stack = namespace.each_stack;
  stack.push({ stop: false });

  for (var [key, item] of Object.entries(iterable)) {
    // each_break
    if (stack[stack.length - 1].stop) break;

    stack[stack.length - 1].iter = { v: item, k: key };

    returned = wordExec(params[1]); // exec block
  }

  stack.pop();

  return returned;
}

each_item_i.arity = 1;
function each_item_i(params) {
  var depth = wordExec(params[0]); // starting from 1
  return each_item_gen(depth);
}

each_item.arity = 0;
function each_item() {
  return each_item_gen(1);
}
function each_item_gen(depth, attribute = "v") {
  // internal
  var stack = namespace.each_stack;
  return stack[stack.length - depth].iter[attribute];
}
each_key_i.arity = 1;
function each_key_i(params) {
  var depth = wordExec(params[0]); // starting from 1
  return each_item_gen(depth, "k");
}

each_key.arity = 0;
function each_key() {
  return each_item_gen(1, "k");
}

each_break.arity = 0;
function each_break() {
  var stack = namespace.each_stack;
  stack[stack.length - 1].stop = true;
}
//////////////////////////////////
if3.arity = 3;
if3.aliases = ["if"];
function if3(params) {
  var condition = wordExec(params[0]);
  return wordExec(params[condition ? 1 : 2]);
}
//////////////////////////////////
unless.operator = "infix";
unless.arity = 1;
function unless(params) {
  var condition = wordExec(params[1], true);
  if (condition == false) wordExec(params[0], true);
}
//////////////////////////////////
def.arity = 2; // def#2
function def(params) {
  var word = words[params[0]].split("#");
  var id = word[0];
  var arity = parseInt(word[1]);

  var wordIndex = params[1];

  namespace[id] = {};
  namespace[id].arity = arity;
  namespace[id].func = function (params) {
    params = params.map(wordExec);
    namespace.stack.push({ args: params });
    var returned = wordExec(wordIndex);
    namespace.stack.pop();
    return returned;
  };
}

dont.arity = 1;
dont.aliases = ["comment"];
function dont(params) {}

pass.arity = 0;
function pass(params) {}

print.arity = 1;
function print(params) {
  var out = wordExec(params[0]);
  console.log(out);
  if (typeof printSink == "function") printSink(out + "\n");
  return out;
}
/*
add.operator="infix"
add.arity=1
add.aliases=["+"]
function add(params){
    return wordExec(params[0],true)+wordExec(params[1])
}
*/
arg.arity = 1;
function arg(params) {
  var index = wordExec(params[0]);
  var stack = namespace.stack;
  var argument = stack[stack.length - 1].args[index - 1]; // index from 1
  return argument;
}

/*
equal.operator="infix"
equal.arity=1
equal.aliases=["=="]
function equal(params){
    return wordExec(params[0],true)==wordExec(params[1])
}

multiply.arity=2
multiply.aliases=["*"]
function multiply(params){
    return wordExec(params[0])*wordExec(params[1])
}
*/

/*
modulus.arity=2
modulus.aliases=["%"]
function modulus(params){
    return wordExec(params[0])%wordExec(params[1])
}
*/
// operator: greater. test: exec("3 > 1")
greater.operator = "infix"; // not prefix
greater.arity = 1; // arity for infix (1, not 2)
greater.aliases = [">"];
greater.chainable = true;
function greater(params) {
  return wordExec(params[0], true) > wordExec(params[1], true); // "skipOperator" because infix, not prefix
}

//----------------------------------------------

var namespaceFuncs = {
  print,
  when,
  /* add, */ times,
  def,
  arg,
  if3,
  unless,
  dont,
  pass,
  /* equal, multiply, */ times_count,
  /* modulus,*/ greater,
  squared,
  exponent,
  each,
  each_item,
  each_item_i,
  each_key,
  each_key_i,
  each_break,
};

binaryOperator("add", "+", (a, b) => a + b);
binaryOperator("subtract", "-", (a, b) => a - b);
binaryOperator("multiply", "*", (a, b) => a * b);

binaryOperator("equal", "==", (a, b) => a == b);
binaryOperator("lesser", "<", (a, b) => a < b);
binaryOperator("lesserOrEqual", "<=", (a, b) => a <= b);

binaryOperator("modulus", "%", (a, b) => a % b);

function binaryOperator(name, symbol, lambda) {
  operatorFactory.word = name;
  operatorFactory.operator = "infix";
  operatorFactory.arity = 1;
  operatorFactory.aliases = [symbol];
  operatorFactory.chainable = true;
  function operatorFactory(params) {
    return lambda(wordExec(params[0], true), wordExec(params[1], true));
  }
  namespaceFuncs[name] = operatorFactory;
  return operatorFactory;
}
//----------------------------------------------
var namespace = {
  arities: {},
  stack: [{}],
  times_stack: [],
  each_stack: [],
};

for (var id in namespaceFuncs) nameSpaceInit(id);
function nameSpaceInit(id) {
  var func = namespaceFuncs[id];
  var arity = func.arity;
  var operator = func.operator;
  var chainable = func.chainable;
  var atomicArgs = func.atomicArgs;

  var entry = { func, arity, operator, chainable, atomicArgs };
  namespace[id] = entry;

  if (func.aliases) for (var alias of func.aliases) namespace[alias] = entry;
}

//////////////////////////////////

function wordExec(wordIndex, skipOperator = false) {
  var word = words[wordIndex];

  if (word === undefined) {
    console.error("(in wordExec) wrong wordIndex:", wordIndex);
    return;
  }

  function nextIndex(skipOperator = false) {
    return wordIndex + phraseLength(wordIndex, skipOperator);
  }

  function valueToWord(value) {
    if (value === undefined) return "null";
    return JSON.stringify(value);
  }

  // if not prefix: postfix or infix
  var nextWord = words[nextIndex(true)];
  if (nextWord !== undefined && skipOperator == false) {
    // if next word is not prefix
    var entry = namespace[nextWord];

    if (entry && entry.operator == "postfix") {
      return entry.func([wordIndex]);
    }

    if (entry && entry.operator == "infix") {
      var tempWordsStart = words.length;
      var operatorIndex = nextIndex(true);
      var leftIndex = wordIndex;
      var result;

      while (true) {
        var operatorWord = words[operatorIndex];
        var operatorEntry = namespace[operatorWord];
        if (!(operatorEntry && operatorEntry.operator == "infix")) break;

        var params = [leftIndex];
        var rightIndex = operatorIndex + 1;
        var scanIndex = rightIndex;
        for (var i = 0; i < operatorEntry.arity; i++) {
          params.push(scanIndex);
          scanIndex += phraseLength(scanIndex, true);
        }

        result = operatorEntry.func(params);

        if (operatorEntry.arity != 1) {
          words.length = tempWordsStart;
          phraseLengths.length = Math.min(phraseLengths.length, tempWordsStart);
          return result;
        }

        // Only explicitly chainable infix operators participate in left-fold chains.
        if (operatorEntry.chainable !== true) {
          words.length = tempWordsStart;
          phraseLengths.length = Math.min(phraseLengths.length, tempWordsStart);
          return result;
        }

        var nextOperatorIndex = scanIndex;
        var nextWord = words[nextOperatorIndex];
        var nextEntry = namespace[nextWord];
        if (!(nextEntry && nextEntry.operator == "infix" && nextEntry.chainable === true)) {
          words.length = tempWordsStart;
          phraseLengths.length = Math.min(phraseLengths.length, tempWordsStart);
          return result;
        }

        leftIndex = words.length;
        words.push(valueToWord(result));
        phraseLengths[leftIndex] = 1;
        operatorIndex = nextOperatorIndex;
      }

      words.length = tempWordsStart;
      phraseLengths.length = Math.min(phraseLengths.length, tempWordsStart);
      return result;
    }
  }

  // single value
  if (parse(word) !== undefined) {
    return parse(word);
  } else if (word == "(") {
    // series, () blocks
    var returned;
    wordIndex++;
    while (words[wordIndex] != ")" && words[wordIndex] !== undefined) {
      var result = wordExec(wordIndex);
      if (result !== undefined) returned = result;
      wordIndex += phraseLength(wordIndex);
    }
    return returned;
  } else if (word == "[") {
    // array series, [] blocks
    var returned = [];
    wordIndex++;
    while (words[wordIndex] != "]") {
      var element = wordExec(wordIndex);
      returned.push(element);
      wordIndex += phraseLength(wordIndex);
    }
    return returned;
  } else if (word == "{") {
    // object series, {} blocks
    var returned = {};
    wordIndex++;
    var mode = "key";
    var key;
    while (words[wordIndex] != "}") {
      var element = wordExec(wordIndex);
      if (mode == "key") {
        key = element;
        mode = "value";
      } else if (mode == "value") {
        returned[key] = element;
        mode = "key";
      }
      wordIndex += phraseLength(wordIndex);
    }
    return returned;
  } else // nested
  {
    var id;
    if (word.indexOf("#") != -1) id = word.split("#")[0];
    else id = word;

    var current = namespace[id];

    if (typeof current == "undefined") {
      console.log("undefined id:", id);
      return;
    }

    if (typeof current == "object") {
      var arity = current.arity;
      var func = current.func;
      var atomicArgs = current.atomicArgs === true;
      var params = [];
      wordIndex += 1;
      for (var i = 0; i < arity; i++) {
        params.push(wordIndex);
        wordIndex += phraseLength(wordIndex, atomicArgs);
      }

      return func(params);
    }

    console.error("not handled, word:", word); // DEBUG help
  }
}
///////////////////////////////

function phraseLength(wordIndex, skipOperator = false) {
  if (skipOperator == false)
    if (phraseLengths[wordIndex] !== undefined) return phraseLengths[wordIndex];
  var length = 1;
  var word = words[wordIndex];
  if (word === undefined) {
    console.error("(in phraseLength) wrong wordIndex:", wordIndex);
    return 0;
  }

  function nextIndex() {
    return wordIndex + length;
  }
  function wordArity(word) {
    if (word.indexOf("#") != -1) return 0;

    var entry = namespace[word] || namespace.arities[word];
    if (entry === undefined) {
      console.error("word not in namespace:", word);
      return;
    }
    return entry.arity;
  }

  // single value
  if (parse(word) !== undefined) {
  } // returns 1
  else if (["{", "[", "("].indexOf(word) != -1) {
    // series, () blocks, [] blocks, {} blocks
    while (true) {
      var matchingParens = { "{": "}", "[": "]", "(": ")" };
      if (words[nextIndex()] === undefined) break; // close ( ... ) sequence at the end
      if (words[nextIndex()] == matchingParens[word]) {
        phraseLengths[nextIndex()] = 1;
        length++;
        break;
      } else length += phraseLength(nextIndex());
    }
  } else if (wordArity(word) !== undefined) {
    // nested
    var argumentLength = wordArity(word);
    var wordEntry = namespace[word] || namespace.arities[word];
    var atomicArgs = wordEntry && wordEntry.atomicArgs === true;
    for (var i = 0; i < argumentLength; i++) length += phraseLength(nextIndex(), atomicArgs);
  } else {
    console.log(word, "(exception)");
  }

  // if not prefix: postfix or infix
  var nextWord = words[nextIndex()];
  if (nextWord !== undefined && skipOperator == false) {
    // if next word is not prefix
    var entry = namespace[nextWord];
    if (entry)
      if (entry.operator == "postfix" || entry.operator == "infix")
        length += phraseLength(nextIndex());
  }

  if (skipOperator == false) phraseLengths[wordIndex] = length;
  return length;
}

function isNumber(text) {
  return typeof parse(text) == "number";
}
function parse(text) {
  try {
    return JSON.parse(text);
  } catch (exception) {
    return;
  }
}

function tokenizeCode(code) {
  var words = [];
  var token = [];
  var quoted = [];
  var inString = false;
  var escaping = false;

  function flushToken() {
    if (!token.length) return;
    words.push(token.join(""));
    token = [];
  }

  function flushQuoted() {
    words.push(JSON.stringify(quoted.join("")));
    quoted = [];
  }

  function appendEscape(char) {
    if (char == '"') quoted.push('"');
    else if (char == "\\") quoted.push("\\");
    else if (char == "n") quoted.push("\n");
    else if (char == "t") quoted.push("\t");
    else throw new Error("invalid escape sequence: \\" + char);
  }

  for (var i = 0; i < code.length; i++) {
    var char = code[i];

    if (inString) {
      if (escaping) {
        appendEscape(char);
        escaping = false;
      } else if (char == "\\") {
        escaping = true;
      } else if (char == '"') {
        flushQuoted();
        inString = false;
      } else {
        quoted.push(char);
      }
      continue;
    }

    if (/\s/.test(char)) {
      flushToken();
      continue;
    }

    if (char == '"') {
      flushToken();
      inString = true;
      continue;
    }

    token.push(char);
  }

  if (escaping) throw new Error("unterminated escape sequence in string literal");
  if (inString) throw new Error("unterminated string literal");

  flushToken();
  return words;
}

function parseCode(code) {
  var words = tokenizeCode(code);
  words = words.flatMap(expandArgShorthand);
  words = words.map(normalizeWordToken);
  return words;
}

function parseSurfaceCode(code) {
  var words = tokenizeCode(code);
  words = words.map(normalizeWordToken);
  return words;
}

function expandArgShorthand(word) {
  if (typeof word != "string") return [word];
  var match = word.match(/^\$(\d+)$/);
  if (!match) return [word];
  return ["(", "arg", match[1], ")"];
}

function normalizeWordToken(word) {
  if (typeof word != "string") return word;
  if (typeof parse(word) != "undefined") return word;
  if (word.indexOf("-") == -1) return word;
  if (word == "-") return word;

  function normalizeIdentifier(id) {
    if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(id)) return id;
    return id.replace(/-/g, "_");
  }

  if (word.indexOf("#") != -1) {
    var parts = word.split("#");
    parts[0] = normalizeIdentifier(parts[0]);
    return parts.join("#");
  }

  return normalizeIdentifier(word);
}

export {
  exec,
  setStateChangeListener,
  setPrintSink,
  resetRuntime,
  namespace,
  words,
  phraseLengths,
  parse,
  parseCode,
  parseSurfaceCode,
  normalizeWordToken,
  phraseLength,
  wordExec,
};
