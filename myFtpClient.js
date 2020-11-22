/*const net = require('net')

const client = new net.Socket()

client.connect(5000, '127.0.0.1', () => {
  console.log('connected')

  client.write('USER Amine \n\r')
})

client.on('data', (data) => {
  console.log(data.toString())
})*/
const Client = require('./Client.js')
let a = new Client
a.connectToServer(a.getSocket())
a.writeToServer(a.getSocket())
a.listenToServer(a.getSocket())