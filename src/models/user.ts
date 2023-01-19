import  pool  from "../database";

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
}