const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'

var result = new Array(81)
for (var i = 0; i < result.length; i++) {
    result[i] = charset[Math.floor(Math.random() * charset.length)]
}

console.log(result.join(''));
