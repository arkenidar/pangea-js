def multiple 2
 == 0 % #1 #2

= i 1
while ! > i 20 {
 if multiple i 15 out "FizzBuzz\n"
 if multiple i 3 out "Fizz\n"
 if multiple i 5 out "Buzz\n"
 out i
 = i + 1 i	
}
