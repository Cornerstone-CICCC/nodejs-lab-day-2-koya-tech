"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.addUser = exports.loginUser = exports.getUserByUsername = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assume username is stored in cookie named 'username'
        const username = req.cookies.username;
        if (!username) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = yield user_model_1.default.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude password from returned user info
        const { password } = user, userData = __rest(user, ["password"]);
        res.status(200).json(userData);
    }
    catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.getUserByUsername = getUserByUsername;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = yield user_model_1.default.login(username, password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Set cookie with username
        res.cookie('username', user.username, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
        });
        // Exclude password from returned user info
        const { password: pwd } = user, userData = __rest(user, ["password"]);
        res.status(200).json(userData);
    }
    catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});
exports.loginUser = loginUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, firstname, lastname } = req.body;
        if (!username || !password || !firstname || !lastname) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newUser = yield user_model_1.default.create({ username, password, firstname, lastname });
        // Optionally, set cookie or return new user info (excluding password)
        const { password: pwd } = newUser, userData = __rest(newUser, ["password"]);
        res.status(201).json(userData);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Error creating user' });
    }
});
exports.addUser = addUser;
const logout = (req, res) => {
    try {
        // Clear the username cookie
        res.clearCookie('username');
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.logout = logout;
