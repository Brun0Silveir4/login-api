

const ensureAdmin = (req, res, next) => {
        if(req.user.role == "Admin" || req.user.role == "Lead-Admin"){
            next()
        }

        return res.status(401).json({error: 'Not enough permission!'})
}

module.exports = ensureAdmin
