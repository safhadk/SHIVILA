import jwt from "jsonwebtoken";


//JWT Token creation
export const generateToken = (user) => {
    const {_id,email,name,phone}=user
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ id:_id,email,name,phone, role: 'user' }, jwtSecretKey, { expiresIn: '1h' });
    const decoded = jwt.verify(token, jwtSecretKey);
    console.log(decoded);
    return token;
};

// JWT token verify
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(404).json({ message: "Authentication failed: no token provided." });
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role=="user"){
            req.user = verified;
            next();
        }else{
            return res.status(404).json({ message: "Authentication failed: role not matched." });  
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Authentication failed: invalid token." });
    }
};

