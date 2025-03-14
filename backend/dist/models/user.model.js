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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    // Find a user by username
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.find(user => user.username === username);
        });
    }
    // Login user by comparing the hashed password
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUsername(username);
            if (!user)
                return null;
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            return isValid ? user : null;
        });
    }
    // Create a new user after hashing the password
    static create(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.findByUsername(newUser.username);
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
            const user = {
                id: (0, uuid_1.v4)(),
                username: newUser.username,
                password: hashedPassword,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
            };
            this.users.push(user);
            return user;
        });
    }
}
UserModel.users = [];
exports.default = UserModel;
