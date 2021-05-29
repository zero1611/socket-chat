    const jwt = require('jsonwebtoken');
    const {User} = require("../models/indexx");


    const  generarJWT = (uid = '')=>{
        return new Promise((resolve, reject) => {
            const playload = {uid};
            jwt.sign(playload,process.env.SECRECTORPRIVATEKEY,{
                expiresIn: '4h'
            },(err, token)=>{
                if(err){
                    console.log(err);
                    reject('No se pudo generar el token')
                }else{
                    resolve(token)
                }
            })
        })


    }
    const comprobarJwt = async (token = '')=>{
        try {
            if(token.length<10){
                return null;
            }

            const {uid} = jwt.verify(token, process.env.SECRECTORPRIVATEKEY);
            const user = await User.findById(uid);
            if(user){
                if(user.estado){
                    return user;
                }
                return null;
            }else {
                return  null;
            }
        }catch (e) {
            return null
        }


    }
    module.exports = {
    generarJWT,comprobarJwt
    }