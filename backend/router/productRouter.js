const express = require("express");
const {product_info,post_order,addtocart,user_product,trend} = require("../controller/function/queries");
const e = require("express");

const router = express.Router();

router.get("/productInfo", async (req, res) => {
  console.log("Request for product info received");
  const pid = req.query.id;
  console.log("Product ID received:", pid);

  if (!pid) {
    return res.status(400).json({ msg: "Missing product_id in request" });
  }

  const result = await product_info({ product_id: pid });

  if (!result) {
    return res.status(500).json({ msg: "Error fetching product data" });
  }

  console.log(result);
  return res.json(result);
});


router.post("/post_order", async (req, res) => {
    try {
        const order = req.body; // ✅ Extract order object
        const userid = req.userid; // ✅ Extract user ID from middleware

        console.log("User ID:", userid);
        console.log("Order:", order);

        // Validate request
        if (!userid || !order || !order.product_id) {
            return res.status(400).json({ error: "Invalid request. Provide user_id and valid order details." });
        }

        // Call function to process the order
        const orderResult = await post_order({ user_id: userid, order });
        
        res.status(201).json({ message: "Order placed successfully!", orderResult });
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ error: "Failed to place order." });
    }
});


router.post('/AddtoCart',async (req,res)=>{
    
        const product_id = req.body.productId;
        const userid = req.userid; 

        console.log("User ID:", userid);
        console.log("p_id: ",product_id);
        
        if (!userid || !product_id ) {
            return res.status(400).json({ error: "Invalid request. Provide user_id and valid order details." });
        }

        try{
            const result = await addtocart({ user_id: userid, product_id:product_id});
            if(!result){res.status(500).json({ error: "Failed to place cart." });}
            else{
                res.status(201).json({ message: "Cart placed successfully!"});
            }
        }
   
    catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ error: "Failed to place order." });
    }
})

router.post('/getProduct', async (req, res) => {
    console.log(req.body);
    const { gender, price, company, size ,trending} = req.body;
    
    if(!trending){
        if (!gender) {
            return res.status(400).json({ msg: 'Gender is required' });
        }

        try {
            const result = await user_product({ gender, price, company, size });

            if (!result || result.length === 0) {
                return res.status(404).json({ msg: 'No products found' });
            }

            return res.status(200).json(result);
        } catch (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
    else{
        try{
            const result=await trend();
            console.log(result);
            return res.status(200).json(result);
        }
        catch(err){
            console.log(err);
            return false;
            return res.send();
        }
        
    }
});

module.exports = router; // 

