import  pool  from "../database";

export type Order = {
    id: Number;
    user_id: Number;
    complete: boolean;
}

export class OrderEntity {
    async index(): Promise<Order[]> {  //list all Orders in DB
        try {
            const con = await pool.connect(); //connect to the DB
            const qry = "SELECT * FROM orders";
            const result = await con.query(qry);  //stores the resulting rows from the DB query
            con.release();
            return result.rows;
        } catch (err){
            throw new Error(`Something went wrong! cannot retrieve orders ${err}`);
        }
    }
}