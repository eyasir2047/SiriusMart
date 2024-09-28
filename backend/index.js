const port=4000;
const express = require('express');
const app=express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const SSLCommerzPayment = require('sslcommerz-lts');
const store_id = 'siriu66d092197068f';
const store_passwd = 'siriu66d092197068f@ssl';
const is_live = false //true for live, false for sandbox


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Database connection with MongoDB

mongoose.connect("mongodb+srv://siriusmart2047:wxT$smaS7DU$X4V@cluster0.n4okfwi.mongodb.net/e-commerce");

//API creation

app.get('/',(req,res)=>{
    res.send("App is running");
});



//Image Storage Engine

const storage= multer.diskStorage({
    destination: './uploads/images',
    filename: function(req,file,cb){
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage
});

//Image Upload API
app.use('/images',express.static('uploads/images'));
app.post('/upload',upload.single('product'),(req,res)=>{
    // console.log(req.file);
    // res.send("Image uploaded");
    res.json( {
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
});

const reviewSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        ref: 'Product'
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);


app.post('/api/reviews', async (req, res) => {
    const { comment, rating, productId } = req.body;

    // Create a new Review instance
    const newReview = new Review({
        comment,
        rating,
        productId
    });

    try {
        await newReview.save();
        res.status(201).json({ message: 'Review added successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Error saving review to the database' });
    }
});


app.get('/api/reviews/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ productId });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});





//schema for creating products

const Product = mongoose.model('Product', {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true // Assuming you want all new products to be available by default
    }
});



app.post('/addproduct', async (req, res) => {
    try {
        const products = await Product.find({});
        let id = 1; // Default ID if no products exist
        if (products.length > 0) {
            const lastProduct = products[products.length - 1];
            id = lastProduct.id + 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            available: req.body.available // Make sure to handle this on client-side
        });

        await product.save();
        //console.log("Product added:", product);
        res.json({
            success: true,
            name: req.body.name,
            message: "Product successfully added",
            product: product
        });
    } catch (error) {
        console.error("Failed to add product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add product",
            error: error.message
        });
    }
});

//create API for deleting products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    //console.log("Product removed:", req.body.id);
    res.json({
        success: true,
        name: req.body.name,
        message: "Product successfully removed"
    });
   
});


//Creating api for getting all products

app.get('/allproducts',async (req,res)=>{
    let products=await Product.find({});
   // console.log("All products:",products);
    res.send(products);
});

//scema for creating users

const Users = mongoose.model('Users', {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        cartData: {
            type: Array,
            default: Date.now,
        }
});

//API for user registration 

app.post('/signup', async (req, res) => {

    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"User already exists"});
    }

        let cart={};

        for(let i=0;i<300;i++){
            cart[i]=0;
        }
        const user=new Users({
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            cartData:cart,
        })

        await user.save();

        const data={
            user:{
                id:user.id
            }
        }

        const token=jwt.sign(data,"secret_ecom");
        res.json({success:true,token});
    
});

//API for user login

app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (user) {
      const passCompare = req.body.password === user.password;

      if (passCompare) {
        const data = {
          user: {
            id: user.id
          }
        };

        const token = jwt.sign(data, "secret_ecom", { expiresIn: '1h' }); // Adding expiration time for the token

        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, errors: "Wrong password" }); // Sending 401 Unauthorized status for wrong password
      }
    } else {
      res.status(404).json({ success: false, errors: "User not found" }); // Sending 404 Not Found status for user not found
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, errors: "Internal server error" }); // Sending 500 Internal Server Error for any other errors
  }
});


app.get('/search/:key', async (req, res) => {
    try {
        const result = await Product.find({
            $or: [
                { name: { $regex: req.params.key, $options: 'i' } }, // Case-insensitive search for product name
                { category: { $regex: req.params.key, $options: 'i' } }, // Case-insensitive search for category
                { new_price: { $regex: req.params.key, $options: 'i' }}
            ]
        });
        res.json(result);
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


//creating  endpoint  for  newcollection data
app.get('/newcollections',async (req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    //console.log("New Collection:",newcollection);
    res.send(newcollection);
});

//creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products=await Product.find({category:"womens"});
    let popular_in_women=products.slice(0,4);
    //console.log("Popular in Women Fetched");
    res.send(popular_in_women);
});


const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Token not found" });
    } else {
        try {
            const data = jwt.verify(token, "secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Invalid Token" });
        }
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const itemId = req.body.itemId;
        if (!itemId) {
            return res.status(400).send({ errors: "Item ID is required" });
        }
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }
        userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added to cart");
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: "Server Error" });
    }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const itemId = req.body.itemId;
        if (!itemId) {
            return res.status(400).send({ errors: "Item ID is required" });
        }
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }
        if (userData.cartData[itemId] > 0) {
            userData.cartData[itemId] -= 1;
        }
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed from cart");
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: "Server Error" });
    }
});

app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }
        res.send(userData.cartData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: "Server Error" });
    }
});


app.delete('/api/cart/clear', fetchUser, async (req, res) => {
    try {
        // Find the user by their ID
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).send({ errors: "User not found" });
        }

        // Clear the cartData
        userData.cartData = {};

        // Save the updated user data
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

        res.send({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: "Server Error" });
    }
});





const ShippingInfo = mongoose.model('ShippingInfo', {
    name: String,
    phoneNumber: String,
    email: String,
    address: String,
    deliveryInfo: String,
    products: [
        {
            productId: Number,  // Add productId to the schema
            quantity: Number,   // Store the quantity of each product
            price: Number   ,    // Store the price of each product
            totalPrice: Number
        }
    ]
});




app.post('/shipping-info', async (req, res) => {
    try {
        // Extract shipping information from the request body
        const { name, phoneNumber, email, address, deliveryInfo } = req.body;
        
        // Fetch productIds from /api/checkout
        const response = await fetch("http://localhost:4000/api/checkout");//get -> by default
        const data = await response.json();
       
       // Assuming the response data has a structure like { success: true, orders: [...] }
        // Extract productIds from the orders
        // Flatten the array of arrays to get a single array of productIds
        
        // Extract product details from the orders
        const products = data.orders.flatMap(order => order.products);
       
        // Deduplicate products by combining quantities and prices if needed
        const deduplicatedProducts = products.reduce((acc, product) => {
            const existingProduct = acc.find(p => p.productId === product.productId);
            if (existingProduct) {
                // Combine quantity and price if the productId already exists
               // existingProduct.quantity += product.quantity;
                //existingProduct.price = product.price; // Assuming price may need to be updated or kept as is
            } else {
               // acc.push({ ...product });
           //  total+=(product.totalPrice*product.quantity);
             // acc.push({...product});

             acc.push({
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
                totalPrice: product.totalPrice // Use totalPrice from the product
            });

            }
            return acc;
        }, []);

       
        // Create a new ShippingInfo document
        const shippingInfo = new ShippingInfo({
            name,
            phoneNumber,
            email,
            address,
            deliveryInfo,
            products: deduplicatedProducts ,
        });

        
       //console.log(shippingInfo);
       //console.log(products);

        // Save the shipping information to the database
        await shippingInfo.save();


        // Send order details to payment gateway
        const orderResponse = await fetch("http://localhost:4000/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(shippingInfo)
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            console.error("Order API error:", errorText);
            return res.status(500).json({ success: false, message: "Failed to process the order." });
        }

        let orderData;
        try {
            orderData = await orderResponse.json();
        } catch (err) {
            console.error("Failed to parse JSON response from order API:", err);
            return res.status(500).json({ success: false, message: "Invalid JSON response from order API" });
        }

        // Send a success response with the redirect URL
        res.status(200).json({ success: true, message: "Shipping information saved successfully", redirectUrl: orderData.url });
    } 
        

        // Send confirmation email
        //important
       // await sendConfirmationEmail(email, name); // Pass email and name to the sendConfirmationEmail function
    

        // Send a success response
        //res.status(200).json({ success: true, message: "Shipping information saved successfully" });
    catch (error) {
        // Handle any errors
        console.error("Error saving shipping information:", error);
        res.status(500).json({ success: false, message: "Failed to save shipping information" });
    }
});

app.get('/api/checkout', async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();

        // Send the orders in the response
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve orders" });
    }
});



const Order = mongoose.model('Order', {
    products: [
        {
            productId: Number,  // Store the product ID
            quantity: Number,   // Store the quantity of each product
            price: Number   ,    // Store the price of each product
            totalPrice: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

app.post('/api/checkout', async (req, res) => {
    try {
        const { products } = req.body; // Extract products from the request body

        // Create a new Order document
        //this is not creating problems
        const newOrder = new Order({ products});
        //console.log(newOrder);

        // Save the order to the database
        await newOrder.save();
        //console.log("Order processed:", newOrder);

        res.status(200).json({ success: true, message: "Order processed successfully" });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ success: false, message: "Failed to process order" });
    }
});


// Inside your route handler



app.post("/order",async (req,res)=>{
    
      // console.log(req.body);
        const { name, phoneNumber, email, address, deliveryInfo,products} = req.body;
        const tran_id = Date.now().toString() + Math.floor(Math.random() * 1000000).toString();


    // Filter out any undefined or null products
    const validProducts = (products || []).filter(product => product !== undefined && product !== null);
    

    //console.log(validProducts);


    const total_amount = validProducts.reduce((acc, p) => {
        if (!p || typeof p.price !== 'number' || isNaN(p.price) || typeof p.quantity !== 'number' || isNaN(p.quantity)) {
            console.warn('Skipping invalid product:', p);
            return acc; // Skip this product
        }

        const productTotalPrice = p.price * p.quantity;
        return acc + productTotalPrice;
    }, 0);

    const order = new OrderDetail({
        tran_id:tran_id,
        total_amount:total_amount,
        currency: 'BDT',
        status: 'Pending', // or 'Created'
        customer: {
          name:name,
          email:email,
          phone: phoneNumber,
          address:address,
        },
        products: validProducts,
      });

    //   console.log(order.tran_id);
    //   console.log(order.total_amount);
    //   console.log(order);
    
      await order.save();
       
    
    const data = {
        total_amount: total_amount,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:4000/payment/success/${tran_id}`,
        fail_url: `http://localhost:4000/payment/fail/${tran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: name,    // Customer name
        cus_email: email,   // Customer Email
        cus_add1: address,  // Customer Address
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone:  phoneNumber,  // Customer phone number
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };


    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

        const apiResponse = await sslcz.init(data);
        const GatewayPageURL = apiResponse.GatewayPageURL;

       // console.log('Redirecting to: ', GatewayPageURL);
        
        // Return the payment gateway URL
        res.status(200).json({ url: GatewayPageURL });



});


const OrderDetail = mongoose.model('OrderDetail', new mongoose.Schema({
    tran_id: String,
    total_amount: Number,
    currency: String,
    status: String,
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    products: Array,
    created_at: { type: Date, default: Date.now },
  }));


// Handle the success callback
app.post('/payment/success/:tran_id', async (req, res) => {
    const { tran_id } = req.params;
  
    // Fetch the order from the database
    const order = await OrderDetail.findOne({ tran_id });
  
   if (order) {
      // Update the order status to 'Completed' or similar
      order.status = 'Completed';
      await order.save();
      
      // Redirect the user to the success page
      //res.redirect(`/PaymentSuccess?tran_id=${tran_id}`);
      res.redirect(`http://localhost:3000/payment/success?tranId=${tran_id}`);
    } else {
      res.status(404).send('Order not found');
    }
  });


  app.post('/payment/fail/:tran_id', async (req, res) => {
    const { tran_id } = req.params;
      res.redirect(`http://localhost:3000/payment/fail?tranId=${tran_id}`);
    
  });

  // Serve the PaymentSuccess page
// app.get('/PaymentSuccess', (req, res) => {
//     const { tran_id } = req.query;
//     // Render or send the success page
//     res.send(`Payment Successful! Your transaction ID is ${tran_id}`);
//   });


// Function to send confirmation email
async function sendConfirmationEmail(email, name) {
    try {
        // Configure nodemailer with your email service credentials
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'project20472662@gmail.com', // your email
                pass: 'rvmd jzkl xgej vcht', // your password
            }
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"SiriusMart" <project20472662@gmail.com>', 
            to: email,
            subject: 'Confirmation Email',
            text: 'Thank you for submitting your shipping information.'
        });

        console.log('Confirmation email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw new Error('Failed to send confirmation email');
    }
}


app.listen(port,(error)=>{
   if(error){
       console.log("Error starting the server" + error);
   }else{
         console.log("Server started at port 4000");
   }
});