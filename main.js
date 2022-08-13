var code=`print 1 { print add 1 2 print "ciao+Dario!+1(+)2=3+using+((+))" }`

var words=parseCode(code)
var defs={print:1, add:2}

console.log(phraseLength(2), words)

function phraseLength(wordIndex){
    var length=1
    var word=words[wordIndex]
    function nextIndex(){ return wordIndex+length }

    if(isNumber(word)||isString(word)){}

    else if(word=="{"){ while(true){
        if(words[nextIndex()]=="}"){
            length++; break
        }else length+=phraseLength(nextIndex())
    
    } }else if(defs[word]!==undefined){
        var argumentLength=defs[word]
        for(var i=0; i<argumentLength; i++)
            length+=phraseLength(nextIndex())
    
    }else throw new Error("not handled: "+word)
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
    words=code.split(" ")
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
