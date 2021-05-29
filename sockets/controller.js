const {ChatMensajes} = require("../models/chat-mensajes");
const {comprobarJwt} = require("../helpers/generarJWT.");

const chatMensajes = new ChatMensajes();
const socketController =async(socket, io) =>{
    const user = await comprobarJwt(socket.handshake.headers['x-token']);
    if(!user){
        return socket.disconnect();
    }
    //Agregar usuario conectado
    chatMensajes.conectarUser(user);
    io.emit('active-users',chatMensajes.usersArr);
    socket.emit('recibir-mensaje', chatMensajes.getUltimos10());
    
    //Conectarlo a una sala Espcecial
    socket.join(user.id);

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUser(user.id);
        io.emit('active-users',chatMensajes.usersArr);
    })
    socket.on('enviar-mensaje', ({uid, mensaje}) =>{
        if(uid){
           socket.to(uid).emit('mensaje-privado',{de: user.nombre, mensaje});
        }else {
            chatMensajes.enviarMensaje(user.id, user.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.getUltimos10());
        }


    });

}
    module.exports = {
        socketController
    }