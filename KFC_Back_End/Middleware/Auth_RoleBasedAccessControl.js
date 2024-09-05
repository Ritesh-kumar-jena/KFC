
const permissionAuth=(permitedRoles)=>{
    return (req,res,next)=>{
        const userRole=req.userData.role
        if(permitedRoles.includes(userRole)){
            next()
        }else{
            res.status(403).send("You are not allowed to access this routes")
        }
    }
}


module.exports={permissionAuth}