import  pool  from "../database";
import bcrypt from 'bcrypt';

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDSL;

export type User = {
    id: Number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export class UserEntity {
    async index(): Promise<User[]> {  //list all users in DB
        try {
            const con = await pool.connect(); //connect to the DB
            const qry = "SELECT * FROM users";
            const result = await con.query(qry);  //stores the resulting rows from the DB query
            con.release();
            return result.rows;
        } catch (err){
            throw new Error(`Something went wrong! cannot retrieve users ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const con = await pool.connect(); //connect to the DB
            const qry = "INSERT INTO users (firstName, lastName, username, password) VALUES($1, $2, $3, $4) RETURNING *";
            const hash:string = bcrypt.hashSync (
                u.password + pepper,
                parseInt(saltRounds as string)
            );
            const result = await con.query(qry, [u.firstName, u.lastName, u.username, hash]);  //stores the resulting rows from the DB query
            const user = result.rows[0];
            con.release();
            return user;
        } catch(err) {
            throw new Error (`Couldn't add new user ${u.firstname}`)
        }
    }
}