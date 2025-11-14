const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRET_KEY

const authMiddleware = (req, res, next) => {
    const rawHeader = req.headers.authorization || ""
    const authHeader = rawHeader.includes(" ") ? rawHeader.split(" ")[1] : rawHeader

    if(authHeader){
        return res.status(401).json({message: 'Authorization Required'})
    }

    try{
        const decoded = jwt.verify(authHeader, secretKey)

        
    } catch(e){

    }
}