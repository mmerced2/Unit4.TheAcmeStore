const {Client} = require('pg');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const express = require('express'); 
const bcrypt = require('bcrypt');

const server = express();

server.use(bodyParser.json()); 

const client = new Client({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "acme_store_db",
});

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    
    CREATE TABLE products(
    id UUID PRIMARY KEY, 
    name VARCHAR(100) UNIQUE NOT NULL);
    
    CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL);
    
    CREATE TABLE favorites(
    id UUID PRIMARY KEY, 
    user_id UUID REFERENCES users(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL, 
    CONSTRAINT unique_users_favorite UNIQUE (user_id, product_id));`
    ;

    await client.query(SQL);
};

const createProduct = async ({name}) => {
    const SQL = `INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;`
    const dbResponse = await client.query(SQL, [uuid.v4(), name]);
    return dbResponse.rows[0];
};

const createUser = async ({username, password}) => {
    const SQL = `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;`
    const dbResponse = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, process.env.SALT_ROUNDS || 5),]);
    return dbResponse.rows[0];
};


const createFavorites = async ({user_id, product_id}) => {
    const SQL = `INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *;`
    const dbResponse = await client.query(SQL, [uuid.v4(), user_id , product_id]);
    return dbResponse.rows[0];
};

const fetchUsers = async () => {
    const SQL = `SELECT * FROM users`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
};

const fetchProducts = async () => {
    const SQL = `SELECT * FROM products`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
};


const fetchFavorites = async ({user_id}) => {
    const SQL = `SELECT * FROM favorites WHERE user_id=$1`;
    const dbResponse = await client.query(SQL, [user_id]);
    return dbResponse.rows;
};

const destroyFavorites = async ({id, user_id}) => {
    const SQL = `DELETE * FROM favorites WHERE id=$1 AND user_id=$2`;
    await client.query(SQL, [id, user_id]);
}


module.exports = {
    client,
    createTables, 
    createProduct, 
    createUser, 
    createFavorites, 
    fetchUsers, 
    fetchFavorites, 
    fetchProducts,
    destroyFavorites,
};