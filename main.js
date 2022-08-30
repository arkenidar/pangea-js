var code1=`times 2 ( print add ( add 1.5 2 ) 3 print "ciao+Dario!+1(+)2=3+using+((+))" )`
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

//console.log("words:",words)
var phraseLengths=[]
//console.log("phraseLength(wordIndex):",phraseLength(program.start))
//console.log(phraseLengths)

///////////////////////////////

function exec(code){

    var print=console.log // shorter

    words=parseCode(code) // parse .sp code (spaced)
    print("words:",words)

    // pre-scan arities
    // composite names (id#arity)
    for(var word of words){
        if(word.indexOf("#")!=-1){
            var parts=word.split("#")
            var id=parts[0]
            var arity=parseInt(parts[1])

            var entry={
                "arity": arity,
                "word": word,
            }

            namespace[id]=entry
        }
    }

    phraseLengths=[]
    phraseLength(0)
    print("phraseLengths:",phraseLengths)

    function zip_pairs(a,b){
        var output = "["
        for(var i=0; i<a.length; i++){
            output+=`${a[i]}:${b[i]} `
        }
        return output+"]"
    }
    print("zipped:", zip_pairs(words,phraseLengths) )

    print("[begin]") // program start
    var returned = wordExec(0)
    print("[end]")
    return returned
}

function main1(){
    var out=console.log

    code=`print "hello+world!"`
    ///exec(code)

    exec("2 times "+code)
    //out("out:",exec("1 + 2")) // add 1 2

    // add ( add 1.5 2 ) 3
    var code1=`2 times ( print 1.5 + 2 + 3 print "ciao+Dario!+1(+)2=3+using+((+))" )`
    exec(code1)

    exec(`( def times_test#1 ( arg 1 ) times print "*time*"
    times_test 3 )`)
    
return
    if(false)
    exec(`(
        def func#0
        ( print add 49 51 )
        func#0
        dont test#2 49 51
        )`)

    ///def "test" 2 //print "$1" print "$2" //2 ( print "test" )
    // dont def test#2 ( add 49 51 )
    //def test#2 ( add 49 51 )
    
    // dont test#2 49 51

    var arg_test1=`(
    
        dont "tested:params/arity"
        def func#1 (
            print + arg 1 3
            print "func+return"
        )
        func 2
        
        )`
    var arg_test2=`(
    def factorial#1 (
        if == 0 arg 1
        1
        * arg 1 factorial + -1 arg 1
    )
    print "factorial+of+3"
    print factorial 3
    
    )`

// [begin]
out("exec:",exec(arg_test2))

exec(`times 3 print times_count 1`)

exec(`times 2 times 3 ( print times_count 2 print times_count 1 )`)
// 1 1 1 2 1 3 2 1 2 2 2 3

exec(`( print "fizz-buzz+game"

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
    
)`)

exec(`(
    print [ 11 22 33 ]
)`)

exec(`(
    print { "a" 11 "b" 22 "c" 33 }
)`)

}

function main2(){
///exec("print ( 3 - 4 + 1 )")
///exec("print ( 3 + -4 + 1 )")

//exec("print ( + + 3 -4 1 )")

exec("print 3 squared") // 9
//console.log(exec("print 4 squared"))

console.log(exec("print 2 ** 3")) // 8

console.log(exec("print 2 + 3 ** 2")) // 11

console.log(exec("print ( 2 + 3 ) ** ( 1 + 1 )")) // 25

}
//[begin]
//////////////////////////////////
squared.operator="postfix"
squared.arity=0
function squared(params){
    var n=wordExec(params[0],true)
    return n**2
}
//////////////////////////////////
exponent.operator="infix"
exponent.arity=1
exponent.aliases=["**"]
function exponent(params){
    var n=wordExec(params[0],true)
    var exp=wordExec(params[1])
    return n**exp
}
//////////////////////////////////
times.operator="infix"
times.arity=1
function times(params){
    var times=wordExec(params[0], true)
    var returned
    // TODO times/stop like while/break: break function called passed from here to block's namespace by reference
    var breakRef=[false]

    var stack=namespace.times_stack
    stack.push(1)

    for(var i=0; i<times; i++){
        if(breakRef[0]) break // TODO variable "by reference"
        returned=wordExec(params[1]) // exec block

        stack[stack.length-1]++
    }

    stack.pop()

    return returned
}

times_count.arity=1
function times_count(params){
    var depth=wordExec(params[0]) // starting from 1
    var stack=namespace.times_stack
    return stack[stack.length-depth]
}
//////////////////////////////////
each.operator="infix"
each.arity=1
function each(params){
    var iterable=wordExec(params[0], true)
    var returned

    var stack=namespace.each_stack
    stack.push(1)

    for(var item of iterable){

        stack[stack.length-1]=item

        returned=wordExec(params[1]) // exec block

    }

    stack.pop()

    return returned
}

each_item.arity=1
function each_item(params){
    var depth=wordExec(params[0]) // starting from 1
    var stack=namespace.each_stack
    return stack[stack.length-depth]
}
//////////////////////////////////
if3.arity=3
if3.aliases=["if"]
function if3(params){
    var condition=wordExec(params[0])
    return wordExec(params[condition?1:2])
}
//////////////////////////////////
def.arity=2 // def#2
function def(params){
    var word = words[ params[0] ].split("#")
    var id =  word[0]
    var arity = parseInt( word[1] )

    var wordIndex = params[1]

    namespace[id] = {}
    namespace[id].arity=arity
    namespace[id].func = function(params){
        params=params.map(wordExec)
        namespace.stack.push( {args:params} )
        var returned = wordExec(wordIndex)
        namespace.stack.pop()
        return returned
    }
}
    
dont.arity=1
function dont(params){}

print.arity=1
function print(params){
    var out=wordExec(params[0])
    console.log(out)
    return out
}

add.operator="infix"
add.arity=1
add.aliases=["+"]
function add(params){
    return wordExec(params[0],true)+wordExec(params[1])
}

arg.arity=1
function arg(params){
    var index=wordExec(params[0])
    var stack=namespace.stack
    var argument=stack[stack.length-1].args[index-1] // index from 1
    return argument
}

equal.arity=2
equal.aliases=["=="]
function equal(params){
    return wordExec(params[0])==wordExec(params[1])
}

multiply.arity=2
multiply.aliases=["*"]
function multiply(params){
    return wordExec(params[0])*wordExec(params[1])
}

modulus.arity=2
modulus.aliases=["%"]
function modulus(params){
    return wordExec(params[0])%wordExec(params[1])
}

//----------------------------------------------

var namespaceFuncs = {print,add,times,def,dont,arg,if3,equal,multiply,times_count,modulus,squared,exponent,each,each_item}

var namespace = {
    stack:[ {} ],
    times_stack:[],
    each_stack:[],
}

for(var id in namespaceFuncs) nameSpaceInit(id)
function nameSpaceInit(id){
    var func=namespaceFuncs[id]
    var arity=func.arity
    var operator=func.operator

    var entry={func,arity,operator}
    namespace[id]=entry

    if(func.aliases)
    for(var alias of func.aliases)
        namespace[alias]=entry
}

//////////////////////////////////

function wordExec(wordIndex, skipOperator=false){
    var word=words[wordIndex]
    
    if(word===undefined){
        console.error("wrong wordIndex:", wordIndex)
        return
    }

    function nextIndex(skipOperator=false){ return wordIndex + phraseLength(wordIndex,skipOperator) }

    // if not prefix: postfix or infix
    var nextWord=words[nextIndex(true)]
    if(nextWord!==undefined && skipOperator==false){
        // if next word is not prefix
        var entry=namespace[nextWord]
        
        if(entry && entry.operator=="postfix"){
            return entry.func([wordIndex])
        }

        if(entry && entry.operator=="infix"){
            var arity=1 // arity is 1 for infix operators
            var params=[wordIndex] // 1st operand (implicit), added to params
            wordIndex+=phraseLength(wordIndex,true) // skip that operand
            wordIndex+=1 // for operator word, skip that operator
            for(var i=0; i<arity; i++){
                params.push(wordIndex) // other operands (explicit), add them (general case, here arity is fixed to 1)
                wordIndex+=phraseLength(wordIndex)
            }
            return entry.func(params)
        }
    }
    

    // single value
    if(parse(word)!==undefined){
        return parse(word)
    }
    
    else

    // series, () blocks
    if(word=="("){
        var returned
        wordIndex++
        while(words[wordIndex]!=")"){
            var result=wordExec(wordIndex)
            if(result!==undefined)
            returned=result
            wordIndex+=phraseLength(wordIndex)
        }
        return returned
    }

    else

    // array series, [] blocks
    if(word=="["){
        var returned = []
        wordIndex++
        while(words[wordIndex]!="]"){
            var element=wordExec(wordIndex)
            returned.push(element)
            wordIndex+=phraseLength(wordIndex)
        }
        return returned
    }

    else

    // object series, {} blocks
    if(word=="{"){
        var returned = {}
        wordIndex++
        var mode="key"
        var key
        while(words[wordIndex]!="}"){
            var element=wordExec(wordIndex)
            if( mode=="key" ){
                key=element
                mode="value"
            }else if( mode=="value"){
                returned[key]=element
                mode="key"
            }
            wordIndex+=phraseLength(wordIndex)
        }
        return returned
    }

    else

    // nested
    {
        var id
        if(word.indexOf("#")!=-1)
            id = word.split("#")[0]
        else id = word 

        var current=namespace[id]

        if( typeof current == "undefined" ){
            console.log("undefined id:",id)
            return
        }

        if( typeof current == "object" ){
            var arity=current.arity
            var func=current.func
            var params=[]
            wordIndex+=1
            for(var i=0; i<arity; i++){
                params.push(wordIndex)
                wordIndex+=phraseLength(wordIndex)
            }

            return func(params)
        }

        console.error("not handled, word:",word) // DEBUG help
    }

}
///////////////////////////////

function phraseLength(wordIndex, skipOperator=false){
    if(skipOperator==false)
    if(phraseLengths[wordIndex]!==undefined)
        return phraseLengths[wordIndex]
    var length=1
    var word=words[wordIndex]
    if(word===undefined){
        console.error("wrong wordIndex:", wordIndex)
        return 0
    }

    function nextIndex(){ return wordIndex+length }
    function wordArity(word){
        
        if(word.indexOf("#")!=-1) return 0

        var entry=namespace[word]
        if(entry===undefined){
            console.error("word not in namespace:",word)
            return
        }
        return entry.arity
    }

    // single value
    if( parse(word)!==undefined ){} // returns 1

    else
    
    // series, () blocks, [] blocks, {} blocks
    if(["{","[","("].indexOf(word)!=-1){ while(true){
        var matchingParens={"{":"}","[":"]","(":")"}
        if(words[nextIndex()]==matchingParens[word]){
            phraseLengths[nextIndex()]=1
            length++; break
        }else length+=phraseLength(nextIndex())
    } }
    
    else
    
    // nested
    if(wordArity(word)!==undefined){
        var argumentLength=wordArity(word)
        for(var i=0; i<argumentLength; i++)
            length+=phraseLength(nextIndex())
    
    }

    else
    
    {
        console.log(word,"(exception)")
    }
    
    // if not prefix: postfix or infix
    var nextWord=words[nextIndex()]
    if(nextWord!==undefined && skipOperator==false){
        // if next word is not prefix
        var entry=namespace[nextWord]
        if(entry)
        if(entry.operator=="postfix" || entry.operator=="infix")
        length+=phraseLength( nextIndex() )
    }

    if(skipOperator==false)
    phraseLengths[wordIndex]=length
    return length
}

function isNumber(text){ return typeof parse(text)=="number" }
function isString(text){ return typeof parse(text)=="string" }
function parse(text){
    try{
        return JSON.parse(text)
    }catch(exception){ return }
}

function parseCode(code){
    words=code.split(/\s+/)
    words=words.map(handlePlus)    
    return words
}

function handlePlus(word){
    if(!isString(word))
        return word
    word=parse(word)
    var parts=word.split("(+)")
    parts=parts.map(part=>part.replace(/\+/g," "))
    word=parts.join("+")
    word=JSON.stringify(word)
    return word
}

//main1()
//main2()

exec(`[ "one" "two" "three" ] each print each_item 1`)
