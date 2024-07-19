const {client, createFavorites,fetchUsers, fetchFavorites, fetchProducts,destroyFavorites} = require('./db')
//create express server
const express = require('express');
const server = express();
//connect to db client 
client.connect();
//middleware
server.use(express.json());



//ROUTES
//GET /api/users - returns array of users
server.get('/api/users', async(req,res,next) => {
    try{
        res.send(await fetchUsers());
    }
    catch(error){
        next(error);
    }
});


//GET /api/products - returns an array of products
server.get('/api/products', async(req,res,next) => {
    try{
        res.send(await fetchProducts());
    }
    catch(error){
        next(error);
    }
});


//GGET /api/users/:id/favorites - returns an array of favorites for a user
server.get('/api/users/:id/favorites', async(req,res,next) => {
    try{
        res.send(await fetchFavorites({user_id:req.params.id}));
    }
    catch(error){
        next(error);
    }
});

//POST /api/users/:id/favorites - payload: a product_id 
//returns the created favorite with a status code of 201
server.post('/api/users/:id/favorites', async(req,res,next) => {
    try{
        res.status(201).send(
            await createFavorites({
                user_id: req.params.user_id,
                product_id: req.params.product_id, 
            })

        );
    }
    catch(error) {
        next(error);
    }
});


//DELETE /api/users/:userId/favorites/:id - deletes a favorite for a user, returns nothing with a status code of 204
server.delete('/api/users/:userId/favorites/:id', async(req,res,next) => {
    try{
        await destroyFavorites({id: req.params.id, user_id: req.params.userId});
        res.sendStatus(204);
    }
    catch(error){
        next(error);
    }
});

//error handling
server.use((err, req, res, next) => {
    res.status(err.status || 500).send({ error: err.message || err });
  });


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`curl localhost:${PORT}/api/users`);
    console.log(`curl localhost:${PORT}/api/products`);
    console.log(`curl localhost:${PORT}/api/users/:id/favorites`);
});

