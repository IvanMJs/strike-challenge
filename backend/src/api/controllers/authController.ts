import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, JWT_EXPIRES, ROLES } from '../../config/auth.config';
import { LoginRequest, User, isValidLoginRequest } from '../../domain/interfaces/user';

const salt = bcrypt.genSaltSync(10);
const adminHash = bcrypt.hashSync('admin123', salt);
const userHash = bcrypt.hashSync('user123', salt);

const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: adminHash,
    role: ROLES.ADMIN
  },
  {
    id: '2',
    username: 'user',
    password: userHash,
    role: ROLES.USER
  }
];

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    // Validate request body
    if (!isValidLoginRequest(req.body)) {
      return res.status(401).json({ message: 'Username and password are required' });
    }

    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    // Find user
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    // console.log('Checking password for user:', username);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // console.log('Login successful for user:', username); // Generate JWT token
    const signOptions = { 
      expiresIn: JWT_EXPIRES
    };
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      signOptions
    );

    // Return token and user info
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
