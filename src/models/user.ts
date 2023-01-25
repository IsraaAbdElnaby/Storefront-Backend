import  pool  from "../database";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type User = {
    id?: Number;
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
            throw new Error (`Couldn't add new user (${u.firstName}):${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<User|null> {
        const con = await pool.connect(); //connect to the DB
        const qry = "SELECT password FROM users WHERE username=($1)";
        const result = await con.query(qry);  //stores the resulting rows from the DB query
        con.release();
        if (result.rows.length) {
            const user = result.rows[0];
            console.log(user);

            if(bcrypt.compareSync(password+pepper, user.password)) {
                return user;
            }
        }
        return null;
    }


    async show(u: User): Promise<User> {
        try{
            const con = await pool.connect();
            const qry = "SELECT * FROM users WHERE id=($1)";
            const result = await con.query(qry, [u.id]);
            con.release();
            return result.rows[0];
        } catch (err){
            throw new Error(`Something went wrong! couldn't find user ${u.id}. ${(err as Error).message}`);
        }
    }

}