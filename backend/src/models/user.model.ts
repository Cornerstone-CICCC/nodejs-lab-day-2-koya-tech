import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export interface User {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

class UserModel {
    private static users: User[] = [];

    // Find a user by username
    static async findByUsername(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

    // Login user by comparing the hashed password
    static async login(username: string, password: string): Promise<User | null> {
        const user = await this.findByUsername(username);
        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.password);
        return isValid ? user : null;
    }

    // Create a new user after hashing the password
    static async create(newUser: {
        username: string;
        password: string;
        firstname: string;
        lastname: string;
    }): Promise<User> {
        const existingUser = await this.findByUsername(newUser.username);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const user: User = {
            id: uuidv4(),
            username: newUser.username,
            password: hashedPassword,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
        };
        this.users.push(user);
        return user;
    }
}

export default UserModel;