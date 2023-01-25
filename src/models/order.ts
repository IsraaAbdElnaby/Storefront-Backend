import  pool  from "../database";

export type Order = {
    id: Number;
    user_id: Number;
    complete: boolean;
}

export type OrderProducts = {
    id: Number;
    order_id: Number;
    product_id: Number;
    product_quantity  : Number;
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
     
    async show(o: Order): Promise<Order>{
        try{
            const con = await pool.connect(); //connect to the DB
            const qry = `SELECT * FROM orders WHERE user_id = ${o.user_id}`;
            const result = await con.query(qry);
            con.release();
            return result.rows[0];
        } catch(err){
            throw new Error(`Something went wrong! cannot retrieve order ${err}`);
        }
    }

    async create(o: Order): Promise<Order>{
        try{
            const con = await pool.connect();
            const qry = "INSERT INTO orders(user_id, complete) VALUES($1, $2) RETURNING * ";
            const result = await con.query(qry, [o.user_id, o.complete]);
            con.release();
            return result.rows[0];
        } catch(err) {
            throw new Error(`Couldn't add new order. ${(err as Error).message}`);            
        }
    }
    
    async addProduct(p: OrderProducts): Promise<OrderProducts>{
        try{
            const orderCon = await pool.connect();
            const qry = "SELECT * FROM orders WHERE id=($1)";
            const result = await orderCon.query(qry, [p.order_id]);
            const order = result.rows[0];
            orderCon.release();

            if(order.complete === true) {
                throw new Error(`Unfortunately, couldn't add product ${p.product_id} to order ${p.order_id} because order is complete`);
            }

        } catch(err) {
            throw new Error(`Couldn't find order. ${(err as Error).message}`); 
        }
        
        try{
            const con = await pool.connect();
            const qry = "INSERT INTO order_products(order_id, product_id, product_quantity) VALUES($1, $2, $3) RETURNING *";
            const result = await con.query(qry, [p.order_id, p.product_id, p.product_quantity]);
            con.release();
            const orderProducts: OrderProducts = result.rows[0];
            return orderProducts;
        } catch(err) {
            throw new Error(`Couldn't add product ${p.product_id} to order ${p.order_id}. ${(err as Error).message}`); 
        }
    }

    async getUserOrders(user_id: Number): Promise<Order[]>{
        try{
            const con = await pool.connect(); //connect to the DB
            const qry = "SELECT * FROM orders WHERE user_id=($1)";
            const result = await con.query(qry, [user_id]);  //stores the resulting rows from the DB query
            con.release();
            return result.rows;                                    ;
        } catch (err){
            throw new Error(`Something went wrong! cannot retrieve orders ${err}`);
        }
    }
}