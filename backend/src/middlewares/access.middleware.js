const access = (...roles) =>{
    return(req,res,next)=>{
        console.log(req.role);
        if(roles.includes(req.role)){
            next();
        }else{
            return res.status(403).send({message:'Forbidden'})
        }
    }
}

module.exports ={
    access
}