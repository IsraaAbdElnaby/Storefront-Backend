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

    async show(id: string): Promise<Product> {
        try {
            const con = await pool.connect(); //connect to the DB
            const qry = "SELECT * FROM products WHERE id=($1)";
            const result = await con.query(qry, [id]);  //stores the resulting rows from the DB query
            con.release();
            return result.rows[0];
        } catch (err){
            throw new Error(`Something went wrong! couldn't find product ${id}. ${(err as Error).message}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const con = await pool.connect(); //connect to the DB
            const qry = "INSERT INTO products(name, price) VALUES ($1, $2) RETURNING *";
            const result = await con.query(qry, [p.name, p.price]);  //stores the resulting rows from the DB query
            con.release();
            return result.rows[0];
        } catch (err){
            throw new Error(`Couldn't add new product ${p.name}. ${(err as Error).message}`);
        }
    }

} 
