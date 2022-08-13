var words="print 1 do print add 1 2 print 4 end".split(" ")
var defs={print:1, add:2}
console.log(phraseLength(2))

function phraseLength(wordIndex){
    var length=1
    var word=words[wordIndex]
    function nextIndex(){ return wordIndex+length }
    if(isNumeric(word)){}
    else if(word=="do"){ while(true){
        if(words[nextIndex()]=="end"){
            length++; break
        }else length+=phraseLength(nextIndex())
    } }else{
        var argumentLength=defs[word]
        for(var i=0; i<argumentLength; i++)
            length+=phraseLength(nextIndex())
    }
    return length
}

function isNumeric(text){
    try{
        return typeof JSON.parse(text)=="number"
    }catch(exception){ return false }
}
