import  pool  from "../database";

export type Product = {
    id: Number;
    name: string;
    price: number;
}

export class ProductEntity {
    async index(): Promise<Product[]> {  //list all products in DB
        try {
            const con = await pool.connect(); //connect to the DB
            const qry = "SELECT * FROM products";
            const result = await con.query(qry);  //stores the resulting rows from the DB query
            con.release();
            return result.rows;
        } catch (err){
            throw new Error(`Something went wrong! cannot retrieve products ${err}`);
        }
    }
} 
