import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserEntity } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const store = new UserEntity;
const webToken = process.env.SECRET_TOKEN;

const create = async(_req: Request, res: Response) => {
    try {
        const user: User = {
            firstName: _req.body.firstName,
            lastName: _req.body.lastName,
            username: _req.body.username,
            password: _req.body.password
        }
        
        const newUser = await store.create(user);
        let token = jwt.sign({
            user: {
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            id: newUser.id
            } 
        },
            webToken as string
        );
        res.json(token);
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}