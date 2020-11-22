const net = require('net')
const readline = require('readline');
class Client {
    constructor() {
        this.socket = new net.Socket()
        this.port = process.argv[3]
        this.ip = process.argv[2]
    
    }

    connectToServer(socket) {
       // TRY CATCH A FINIR
       try{ 
           socket.connect(this.port,this.ip)
            console.log(`connected | IP: ${this.ip} Port: ${this.port}`)
       }catch(error){
            console.log('Il n\'y a pas de serveur correspondant à ce port et/ou cette IP')
       }
       // console.log(`Connected | IP: ${this.ip} Port: ${this.port}`)
    }
    writeToServer(socket) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl.on('line',(input)=>{
            socket.write(input)

        })
        rl.on('SIGINT',()=>{
            console.log('Fin du programme')
            rl.close()
            socket.write('QUIT')  
            socket.end()
            process.exit(1)  
        })
       
    }
    listenToServer(socket){
        socket.on('data',(data)=>{
            console.log(`Message from server : ${data.toString()}`)
            
           })
    }
    getSocket() {
        return this.socket
    }
    getPort() {
        return this.port
    }
    getIp(){
        return this.ip
    }
    setSocket(socket) {
        this.socket = socket
    }
    setPort(port) {
        this.port = port
    }
    setIp(ip){
        this.ip = ip
    }
}

module.exports = Client