comment "npm run cli -- factorial.sp"

def factorial#1
 if $1 == 0 1
$1 * factorial $1 - 1

print factorial 3
