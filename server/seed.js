const {client, createTables,createProduct, createUser, createFavorites,fetchUsers, fetchFavorites, fetchProducts,destroyFavorites} = require('./db')

const init = async () => {
    console.log("Connecting to the database");
    await client.connect();
    console.log("Connected to the database");

    await createTables();
    console.log("Tables created");

    const [badbunny, feid, karolg, album, sunnies, shirts] = await Promise.all([
        createUser({username: "Bad Bunny"}),
        createUser({username: "Ferxxo"}),
        createUser({username: "Karol G"}),
        createProduct({name: "Un Verano Sin Ti"}),
        createProduct({name: "Green Sunglasses"}),
        createProduct({name: "Bichota T-Shirt"}),
    ]);

    console.log("Bad Bunny", badbunny);
    console.log(await fetchUsers());
    console.log("Seeded users");
    console.log("Un Verano Sin Ti", album);
    console.log(await fetchProducts());
    console.log("Seeded products");

    const [user1_faves, user2_faves, user3_faves] = await Promise.all(
        createFavorites({user_id: badbunny.id, product_id: album.id }),
        createFavorites({user_id: feid.id, product_id: sunnies.id }),
        createFavorites({user_id: karolg.id, product_id: shirts.id }),
    );

    console.log("Bad Bunny's Favorites", await fetchFavorites({user_id: badbunny.id}));
    console.log("Seeded user favorites");

    await destroyFavorites({id:user3_faves, user_id: karolg.id});
    await client.end();
};

init();