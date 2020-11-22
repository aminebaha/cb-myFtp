const net = require('net')
const fs = require('fs')
const readline = require('readline');

class Server {
    constructor() {
      this.clients = []
        this.server = net.createServer((socket)=> {
          let currentUser,currentPass
          let connected = false
            console.log('A client is connected')
            
           /* socket.on('error',()=>{
              console.log('error occured')
            })*/
            socket.on('data',(data)=>{
            const [command,parameter]  = data.toString().split(" ")
            let message
            switch(command){
              case 'USER': 
                if(this.isUndefined(parameter)) {
                  socket.write('User empty does not exist')
                }
                else {
                  fs.readFile('db.json',(err,data)=>{
                    if(err)
                        throw err
                      let obj = JSON.parse(data)
                      let values = Object.values(obj);
                    
                  for(const [key,obj] of Object.entries(values)) {
                 
                    if(obj.user===parameter){
                      currentUser = parameter
                      currentPass = obj.pass
                      message = `User "${parameter}" exist \nUsage:PASS <password>`
                      break
                    }else{
                      message = `User "${parameter}" does not exist`
                      
                    }   
                }
                 
                    socket.write(message)
                    })
                }
               
              break

              case 'PASS':
                if(!connected){
                if(this.isUndefined(parameter)) {
                  socket.write('No Pass given\nUsage:PASS <password> ')
                }
                else if(currentUser=== undefined) {
                  socket.write('No User selected \nUsage:USER <username>')
                }
                else {
                  if(parameter===currentPass && currentUser!=undefined){
                    message = `User "${currentUser}" is connected`
                    connected = true
                  }
                  else {
                    message = `This password does not exist for User "${currentUser}"`
                  }
                  socket.write(message)

                }
              }else {
                socket.write(`The user ${currentUser} is connected`)
              }
               
                break

                case 'LIST':
               if(parameter!== undefined && parameter!== ''){ 
                  message = "LIST should not have parameters\nUsage: LIST"
              
                }
                else if(!connected){
                  message = "Not connected\nUsage:USER <username>"

                }
                else{
                  let arrayFiles = []
                  fs.readdir(__dirname, (err, files) => {
                    files.forEach(file => {
                      arrayFiles.push(file)
                    })
                    message = `LIST of current directory => \n ${arrayFiles.join('\n')}`
                    socket.write(message)
                  })
                  break
                }
                socket.write(message)
                
                break

                case 'CWD':
                  if(this.isUndefined(parameter)) {
                   message = 'No directory given\nUsage:CWD <directory> '
                  }
                  else if(!connected){
                    message = "Not connected\nUsage:USER <username>"
                  }
                  else {
                    try{
                    process.chdir(parameter)
                    message = `directory changed '${process.cwd()}`
                    }catch(e){
                      message = `${parameter} does not exist`
                    }
                  }
                  socket.write(message)
                  
                  break

                 case 'RETR' : 
                  if(this.isUndefined(parameter)) {
                    message = 'No file given\nUsage:RETR <filename>'
                   }
                   else if(!connected){
                    message = "Not connected\nUsage:USER <username>"
                  }
                   else {
                      try{
                        let reader = fs.createReadStream(__dirname+'\\'+parameter)
                        let writer = fs.createWriteStream('copyclient'+parameter)
                        let textfile
                        reader.on('data',(chunk)=>{
                          textfile = chunk
                          writer.write(textfile)
                          })
                          reader.on('error',()=>{
                            message = 'Error file reader'
                          })
                          writer.on('error',()=>{
                            message = 'Error file writer'
                          })
                          message= 'File created'
                      }catch(e){
                        console.log('ERROR')
                    }
                   }
                   socket.write(message)
                  break

                 case 'STOR':
                  if(this.isUndefined(parameter)) {
                    message = 'No file given\nUsage:STOR <filename>'
                   }
                   else if(!connected) {
                     message = 'Not connected \nUsage:USER <username>'
                   }
                   else {
                     message = `STOR ${parameter}`   
                   }
                   socket.write(message)
                  break


                  case 'PWD':
                    if(parameter!== undefined && parameter!== ''){ 
                      message = "PWD should not have parameters\nUsage: PWD"
                  }else if(!connected){
                    message = 'Not connected\nUSER <username>'
                    }else{
                      message = `Current directory => ${process.cwd()}`
                    }
                    socket.write(message)
                  break

                  case 'HELP':
                    if(parameter!== undefined && parameter!== ''){ 
                      message = "HELP should not have parameters\nUsage: HELP"
                  }
                  else{
                    message = "All commands available => \nUSER <username>\nPASS <password>\nLIST\nCWD <directory>\nRETR <filename>\nSTOR <filename>\nPWD\nQUIT"
                    
                  }
                  socket.write(message)   
                  break

                  case 'QUIT':
                    console.log('Client is deconnected')
                  socket.destroy()
                  process.exit(1)
                  break

                  default:
                    message = "No command recognized\nUsage:HELP"
                    socket.write(message)
                  
            }
          })

        }).listen(process.argv[2],()=>{
          console.log(`Server started at port ${process.argv[2]}`)
        })
      
    }

    isUndefined(parameter) {
      return (parameter===undefined || parameter==='') ? true : false
    }
    
}



module.exports = Server