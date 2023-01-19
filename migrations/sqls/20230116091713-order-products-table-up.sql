CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    order_id integer,
    product_id integer,
    product_quantity integer
);