const { createConnection } = require('./connect_server');

async function createUser({ username, password, email }) {
    console.log({ username, password, email })
    const connection = await createConnection();
    if (!connection) {
        console.log("Database connection failed.");
        return false;
    }

    const insert_query = "INSERT INTO User (username, password, email) VALUES (?, ?, ?)";
    const values = [username, password, email];

    try {
        const [result] = await connection.execute(insert_query, values);
        console.log("User inserted successfully:", result);
        return result;
    } catch (err) {
        console.error("Database insert error:", err);
        return false;
    } finally {
        await connection.end(); // Close the connection after query execution
    }
}



async function findUserByEmail({email}) {


    const connection = await createConnection();
    if (!connection) {
        console.log("Database connection failed.");
        return false;
    }

    const search_query = "SELECT * FROM User WHERE email = ?";
    try {
        const [rows] = await connection.execute(search_query, [email]);

        if (rows.length > 0) {
            console.log("User found:", rows[0]);
            return rows[0];  // Returning the first matching record
        } else {
            console.log("No user found with this email.");
            return null;
        }
    } catch (err) {
        console.error("Database search error:", err);
        return false;
    } finally {
        await connection.end();
    }


}




async function insertProduct({req, res}) {
    const connection = await createConnection();
    console.log(req.body);
    if (!connection) {
        return res.status(500).json({ message: "Database connection failed!" });
    }

    try {
       
        const { gender, company, shoeType, shoeSize, quantity, price } = req.body;

 
        const productImage = req.file ? req.file.filename : null; 



      
        const query = `
            INSERT INTO Product (product_image, gender, company, shoe_type, shoe_size, quantity, price) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        let result;
        const values = [productImage, gender, company, shoeType, shoeSize, quantity, price];
        
        try{
            console.log(values);
            const [result] = await connection.execute(query, values);
        }
        catch(err){
            
            console.log('error is '+err);
            return false;
        }
        
        return res.status(201).json({
            message: "Product added successfully!",
            
        });
    } catch (error) {
        console.error("Error inserting product:", error);
        return res.status(500).json({ message: "Server error, unable to insert product." });
    } finally {
        await connection.end();
    }
}


async function randomValues30(req,res){
    const connection=await createConnection();
    
   
    if(!connection){
        console.log('connection failed');
        return false;
    }

    const query="SELECT * FROM Product ORDER BY RAND() LIMIT 30";
    try{
        const result=await connection.execute(query);
        console.log('successful');
        
        await connection.end();
        return result;
    }
    catch(err){
        return false;
    }

    
    
}

async function product_info({ product_id }) {
    const connection = await createConnection();
    const query = "SELECT * FROM Product WHERE product_id = ?";
    
    try {
        const [rows] = await connection.execute(query, [product_id]); // Extract rows
        await connection.end(); // Close connection
        return rows.length ? rows[0] : null; // Return the product or null if not found
    } catch (err) {
        console.error("Database Error:", err);
        return false;
    }
}



async function post_order({ user_id, order }) {
    const connection = await createConnection();
    console.log(order);
    try {
        await connection.beginTransaction(); // ✅ Start transaction

        const { product_id, size, price, order_status, order_date } = order;

        // 1️⃣ Check if product exists
        const [product] = await connection.execute(
            "SELECT price, quantity FROM Product WHERE product_id = ?",
            [product_id]
        );

        if (product.length === 0) {
            throw new Error(`Product ID ${product_id} not found`);
        }

        const { price: dbPrice, quantity: availableQuantity } = product[0];

        // 2️⃣ Check if stock is available (assuming a default quantity of 1)
        const quantity = 1;
        if (quantity > availableQuantity) {
            throw new Error(`Insufficient stock for Product ID ${product_id}`);
        }

        // 3️⃣ Insert into Orders table
        const totalPrice = dbPrice * quantity;
        const formattedDate = new Date(order.order_date).toISOString().slice(0, 19).replace("T", " ");
        const [orderResult] = await connection.execute(
            "INSERT INTO Orders (user_id, product_id, size, quantity, total_price, order_status, order_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, product_id, size, quantity, totalPrice, order_status, formattedDate]
        );

        // 4️⃣ Update stock in Product table
        await connection.execute(
            "UPDATE Product SET quantity = quantity - ? WHERE product_id = ?",
            [quantity, product_id]
        );

        await connection.commit(); 

        console.log("Order placed successfully!");
        return { success: true, order_id: orderResult.insertId };
    } catch (error) {
        await connection.rollback(); 
        console.error("Error placing order:", error.message);
        throw error;
    } finally {
        await connection.end();
    }
}


async function addtocart({ user_id, product_id }) {
    const connection = await createConnection();
    const query = "INSERT INTO Cart (user_id, product_id) VALUES (?, ?)";

    try {
        const [result] = await connection.execute(query, [user_id, product_id]);
        console.log("Cart entry added successfully:", result);
        return result;
    } catch (err) {
        console.error("Error adding to cart:", err);
        return false;
    } finally {
        await connection.end(); 
    }
}


async function user_product({ gender, price, company, size }) {
    const connection = await createConnection();
    
    try {
        let query = "SELECT * FROM product WHERE price <= ? AND shoe_size >= ?";
        let values = [price, size];

        if (gender !== 'any') {
            query += " AND gender = ?";
            values.push(gender);
        }

        if (company !== 'any') {
            query += " AND company = ?";
            values.push(company);
        }

        const [result] = await connection.execute(query, values);

        return result;
    } catch (err) {
        console.error("Database error:", err);
        return false;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}





async function trend() {
    
    const connection=await createConnection();
    try {
        // Get Top 10 Trending Product IDs from Orders Table
        const [topProducts] = await connection.execute(`
            SELECT product_id, COUNT(*) AS frequency
            FROM orders
            GROUP BY product_id
            ORDER BY frequency DESC
            LIMIT 12
        `);

        if (topProducts.length === 0) {
            console.log("No trending products found.");
            return [];
        }

        // Extract product IDs
        const productIds = topProducts.map(product => product.product_id);

        // Fetch product details using Promise.all()
        const products = await Promise.all(
            productIds.map(async (pid) => {
                const [product] = await connection.execute(
                    'SELECT * FROM product WHERE product_id = ?', [pid]
                );
                return product[0]; // Extract the first row of the result
            })
        );

        return products;
    } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
    } finally {
        await connection.end();
    }
}




async function Dashboard(userId) {
    const connection = await createConnection();

    try {
        // Fetch user details (excluding password)
        const [userInfo] = await connection.execute(`
            SELECT user_id, username, email
            FROM user
            WHERE user_id = ?;
        `, [userId]);

        // Fetch purchased products by user
        const [purchasedProducts] = await connection.execute(`
            SELECT product.*
            FROM orders
            LEFT JOIN product ON orders.product_id = product.product_id
            WHERE orders.user_id = ?;
        `, [userId]);

        // Fetch cart items using LEFT JOIN
        const [cartItems] = await connection.execute(`
            SELECT Cart.product_id, Product.gender, 
                   Product.company, Product.shoe_type, Product.shoe_size, 
                   Product.price,product.product_image
            FROM Cart
            LEFT JOIN Product ON Cart.product_id = Product.product_id
            WHERE Cart.user_id = ?;
        `, [userId]);

        return {
            user: userInfo.length > 0 ? userInfo[0] : null,
            purchased: purchasedProducts,
            cart: cartItems
        };

    } catch (error) {
        console.error("Error fetching user dashboard data:", error);
        return { user: null, purchased: [], cart: [] };
    } finally {
        await connection.end();
    }
}





async function review(req, res) {
    try {
        const connection = await createConnection();
        
        const { review } = req.body;
        const userid = req.userid || null; // Extract from cookies
        const productid = req.query.productid;

        if (!review || !userid || !productid) {
            return res.status(400).json({ message: 'Review, user ID, and product ID are required' });
        }

        const query = "INSERT INTO reviews (review, userid, product_id) VALUES (?, ?, ?)";
        await connection.execute(query, [review, userid, productid]);

        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error("Error inserting review:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    } 
}



async function getReviews({ userid, productid }) {
    const connection = await createConnection()
    
    console.log('this is product id');
    //console.log(productid);
    


    try {
        let query = "SELECT * FROM reviews WHERE product_id = ?";
        let params = [productid];

        // Include userid filter only if provided

      

        const [rows] = await connection.execute(query, params);
        console.log('rows are');
        console.log(rows);
        return rows;
    } catch (error) {
        console.log('yeah');
        console.error("Error fetching reviews:", error);
        return false;
    } 
}


module.exports = { createUser,findUserByEmail,insertProduct ,randomValues30,product_info,post_order,addtocart,user_product,trend,Dashboard,review,getReviews};
