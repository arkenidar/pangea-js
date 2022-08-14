var code1=`print 1 { print add 1 2 print "ciao+Dario!+1(+)2=3+using+((+))" }`
var defs1={print:1, add:2}
var program1={code:code1,defs:defs1,start:2}

var code2=`{ ( def "factorial" 1
if == 0 #1 1
* #1 factorial + -1 #1 )
( out factorial 3 ) }`
var defs2={def:3,factorial:1,out:1,if:3,"==":2,"+":2,"*":2,"#1":0}
var program2={code:code2,defs:defs2,start:0}
// start: 1 -> 16 , 17 -> 5 , 0 -> 23 (1+16+5+1==23)

var program=program2

var code=program.code
var words=parseCode(code)
var defs=program.defs

console.log("words:",words)
var phraseLengths=[]
console.log("phraseLength(wordIndex):",phraseLength(program.start))
console.log(phraseLengths)

function phraseLength(wordIndex){
    if(phraseLengths[wordIndex]!==undefined)
        return phraseLengths[wordIndex]
    var length=1
    var word=words[wordIndex]
    if(word===undefined) console.log("wrong wordIndex:", wordIndex)
    ///console.log(word,"(word)")
    function nextIndex(){ return wordIndex+length }

    if(isNumber(word)||isString(word)){}

    else if(["{","[","("].indexOf(word)!=-1){ while(true){
        var matchingParens={"{":"}","[":"]","(":")"}
        if(words[nextIndex()]==matchingParens[word]){
            phraseLengths[nextIndex()]=1
            length++; break
        }else length+=phraseLength(nextIndex())
    
    } }else if(defs[word]!==undefined){
        var argumentLength=defs[word]
        for(var i=0; i<argumentLength; i++)
            length+=phraseLength(nextIndex())
    
    }else { console.log(word,"(exception)") }
    
    phraseLengths[wordIndex]=length
    return length
}

function isNumber(text){ return typeof parse(text)=="number" }
function isString(text){ return typeof parse(text)=="string" }
function parse(text){
    try{
        return JSON.parse(text)
    }catch(exception){ return null }
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
