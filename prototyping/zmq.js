const zmq = require('zeromq')


var sock = zmq.socket('sub')

sock.connect('tcp://zmq.testnet.iota.org:443')
sock.subscribe('')

sock.on('', function(topic) {
    console.log(topic)
    var tp = topic.toString()
    var arr = tp.split(' ')
    console.log(JSON.stringify(arr))

    if (arr[0] === 'tx') {
        let msg = {
            hash: arr[1],
            'address': arr[2],
            'amount': arr[3],
            'tag': arr[4],
            'timestamp': arr[5],
            'currentIndex': arr[6],
            'lastIndex': arr[7],
            'bundle': arr[8],
            'trunk': arr[9],
            'branch': arr[10],
            'arrivalDate': arr[11]
        }
        // console.log(arr[0], msg)
    } else if (arr[0] === 'sn') {
        let msg = {
            milestone: arr[1],
            tx1: arr[2],
            tx2: arr[3],
            tx3: arr[4],
            tx4: arr[5],
            tx5: arr[6]
        }
        // console.log(msg)
    } else {
        console.log( arr)
    }
})
