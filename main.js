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
    // checks WIP def#2
    // checks WIP .arity
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

function main(){
    var out=console.log
    code=`print "hello+world!"`
    exec(code)

    exec("times 2 "+code)
    out("out:",exec("add 1 2"))
    exec(code1)

    // WIP DEBUG arity

    /// WIP DEBUG word not in namespace: func
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
    
        dont "WIP:params/arity"
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

}

//////////////////////////////////
times.arity=2
function times(params){
    var times=wordExec(params[0])
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

add.arity=2
add.aliases=["+"]
function add(params){
    return wordExec(params[0])+wordExec(params[1])
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

var namespaceFuncs = {print,add,times,def,dont,arg,if3,equal,multiply,times_count,modulus}

var namespace = {
    stack:[ {} ],
    times_stack:[],
}

for(var id in namespaceFuncs) nameSpaceInit(id)
function nameSpaceInit(id){
    var func=namespaceFuncs[id]
    var arity=func.arity

    var entry={func,arity}
    namespace[id]=entry

    if(func.aliases)
    for(var alias of func.aliases)
        namespace[alias]=entry
}

//////////////////////////////////

function wordExec(wordIndex){
    var word=words[wordIndex]
    
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

        console.error("not handled, word:",word) // TODO remove , DEBUG help
    }

}
///////////////////////////////

function phraseLength(wordIndex){
    if(phraseLengths[wordIndex]!==undefined)
        return phraseLengths[wordIndex]
    var length=1
    var word=words[wordIndex]
    if(word===undefined) console.error("wrong wordIndex:", wordIndex)

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

main()
