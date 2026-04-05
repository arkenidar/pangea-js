comment "npm run cli -- fizz-buzz.sp"

def multiple#2
 0 == ( $1 % $2 )

def i#0
 times_count 1

def multiple_of#1
 multiple i $1

20 times (
 print
	"fizz-buzz" when multiple_of 15
	"fizz" when multiple_of 3
	"buzz" when multiple_of 5
	i
)
