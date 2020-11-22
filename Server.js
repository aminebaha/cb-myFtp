const net = require('net')
const fs = require('fs')
const readline = require('readline');

class Server {
    constructor() {
      this.clients = []
        this.server = net.createServer((socket)=> {
          let currentUser,currentPass
          let connect = false
            console.log('new connection')
            
	         // socket.pipe(socket);
            socket.on('data',(data)=>{
            console.log(data.toString())
            const [command,parameter]  = data.toString().split(" ")
           
            console.log([command,parameter])
            let message
            switch(command){
              case 'USER': 
                if(parameter=== undefined ||parameter=== '') {
                  socket.write('User empty does not exist')
                }
                else {
                  fs.readFile('db.json',(err,data)=>{
                    if(err)
                        throw err
                      let obj = JSON.parse(data)
                      let keys = Object.keys(obj);
                      let values = Object.values(obj);

                    //  console.log('test : ' + values)
                    
                  for(const [key,obj] of Object.entries(values)) {
                 
                    if(obj.user===parameter){
                      currentUser = parameter
                      currentPass = obj.pass
                      connect = true
                      message = `User "${parameter}" exist \nUsage:PASS <password> for authentification`
                      break
                    }else{
                      message = `User "${parameter}" does not exist`
                      
                    }   
                }
                 
                    socket.write(message)
                    console.log(currentUser,currentPass)
                    })
                }
               
              break

              case 'PASS':
                if(parameter=== undefined ||parameter=== '') {
                  socket.write('No Pass given\nUsage:PASS <password> ')
                }
                else if(currentUser=== undefined) {
                  socket.write('No User selected \nUsage:USER <username>')
                }
                else {
                  if(parameter===currentPass && currentUser!=undefined){
                    message = `User "${currentUser}" is connected`
                    connect = true
                  }
                  else {
                    message = `This password does not exist for User "${currentUser}"`
                  }
                  socket.write(message)
                }
               
                break

                case 'LIST':
               if(parameter!== undefined && parameter!== ''){ 
                  message = "LIST should not have parameters\nUsage: LIST"
              }else if(connect){
                  message = process.cwd()
                }else{
                  message = 'Not connected\nUSER <username>'
                }
                socket.write(message)
                
                break

                case 'CWD':
                  if(parameter=== undefined ||parameter=== '') {
                   message = 'No directory given\nUsage:CWD <directory> '
                  }
                  else if(currentUser=== undefined) {
                    message = 'No User selected \nUsage:USER <username>'
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

               
            }
          })

        /*  socket.on('close',()=>{
            socket.write('Bye')
          })
        */
        }).listen(process.argv[2],()=>{
          console.log(`Server started at port ${process.argv[2]}`)
        })
      
    }
}



module.exports = Server