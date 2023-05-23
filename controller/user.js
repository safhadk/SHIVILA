import { validateEmail,validatePhone } from '../Helper/Validation.js';
import { generateToken } from '../middleware/jwt.js';
import bcrypt from 'bcrypt'
import Users from '../models/User.js';

//register
export const Register = async (req, res) => {
    try {
        const {name,email,phone,password,address} = req.body;
        if(name?.length<3 || !name) return res.status(400).json({ message: 'Enter Valid Name' });
        if (!validateEmail(email)) {return res.status(400).json({ message: 'Enter a valid email address' });}
        if (password?.length < 8 || !password) {return res.status(400).json({ message: 'Enter a valid password (at least 8 characters long)' }); }
        if (!validatePhone(phone)) {return res.status(400).json({ message: 'Enter a valid phone number' });}
        if (!address) return res.status(400).json({ message: 'Enter Valid Address' });
        
        // Check if user already exists with the given email or mobile
        const existingUser = await Users.findOne({
            $or: [{ email: email }, { phone: phone }],
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User already registered' });
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password,10);
            await Users.create({ name,email,phone, password: hashedPassword, address });
            return res.status(200).json({ message: 'User registered successfully' });
        }
    } catch (err) {
        console.error(`Error in Register: ${err.message}`);
        return res.status(500).json({ message: "Server Error" });
    }
};

//login
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!validateEmail(email)) {return res.status(400).json({ message: 'Enter valid email address' });}
        if (!password) return res.status(400).json({ message: 'Enter Valid password' });

        // Find user by email or phone number
        const user = await Users.findOne({email})
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        // Generate JWT token
        const token = generateToken(user);

        // Return the token to the user
        return res.status(200).json({ message: "Login Successfull", token });
    } catch (err) {
        console.log(err)
        console.error(`Error in login: ${err.message}`);
        return res.status(500).json({ message: "Server Error" });
    }
}

//profile
export const Profile = async (req, res) => {
    try {
        const userId = req.user.id; 
        // Retrieve the user details from the database
        const user = await Users.findOne({_id:userId});
        if (!user)  return res.status(404).json({ message: 'User not found' });
        // Return the user details in the response
        return res.status(200).json(user);
    } catch (err) {
        console.error(`Error in Profile: ${err.message}`);
        return res.status(500).json({ message: "server Error" });
    }
};
