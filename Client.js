const net = require('net')
const readline = require('readline');
const fs = require('fs')
const path = require('path')
class Client {
    constructor() {
        this.socket = new net.Socket()
        this.port = process.argv[3]
        this.ip = process.argv[2]
    
    }

    connectToServer(socket) {
       // TRY CATCH A FINIR
       socket.on('error',()=>{
           console.log("Error occured since connection")
       })
       try{ 
           socket.connect(this.port,this.ip)
            console.log(`Connection | IP: ${this.ip} Port: ${this.port}`)
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
            this.enter = input
            socket.write(input)

        })
        rl.on('SIGINT',()=>{
            console.log('Fin du programme')
            rl.close()
            socket.write('QUIT')  
           // socket.end()
            socket.destroy()
            process.exit(1)  
        })
       
    }
    writeFileForServer(socket,data) {
     
        let pathCopy = __dirname+'\\'+data.replace(/STOR /,'')
        let str = path.basename(pathCopy)
        try{
        let reader = fs.createReadStream(str)
        let writer = fs.createWriteStream('copyserver'+str)
                    
        let textfile
        reader.on('data',(chunk)=>{
            textfile = chunk
                       
            writer.write(textfile)
         })
        }catch(e){
            console.log('ERROR')
        }
        let message= 'Message from client : File created'
                   
        socket.write(message)
    }
    listenToServer(socket){
      /*  const promiseData = new Promise((resolve,reject)=>{
            resolve((data)=>{
               writer.write(data)
            })

            reject((mess)=>{
                console.log(mess)
            })
        })*/
        socket.on('data',(data)=>{
            if(data.toString().includes('STOR ') && !data.toString().includes('<filename>')){
                this.writeFileForServer(socket,data.toString())
            }
            else {
            console.log(`Message from server : ${data.toString()}`)
            }
             
           })
           socket.on('close',()=>{
               console.log('Connection closed')
               process.exit(1)
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
    run(){
        this.connectToServer(this.socket)
        this.writeToServer(this.socket)
        this.listenToServer(this.socket)
    }
}

module.exports = Client