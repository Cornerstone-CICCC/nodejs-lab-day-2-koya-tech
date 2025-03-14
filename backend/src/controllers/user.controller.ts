import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        // Assume username is stored in cookie named 'username'
        const username = req.cookies.username;
        if (!username) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await UserModel.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude password from returned user info
        const { password, ...userData } = user;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await UserModel.login(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Set cookie with username
        res.cookie('username', user.username, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
        });
        // Exclude password from returned user info
        const { password: pwd, ...userData } = user;
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

export const addUser = async (req: Request, res: Response) => {
    try {
        const { username, password, firstname, lastname } = req.body;
        if (!username || !password || !firstname || !lastname) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newUser = await UserModel.create({ username, password, firstname, lastname });
        // Optionally, set cookie or return new user info (excluding password)
        const { password: pwd, ...userData } = newUser;
        res.status(201).json(userData);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Error creating user' });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        // Clear the username cookie
        res.clearCookie('username');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};