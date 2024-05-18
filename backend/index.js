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
        console.log("Product added:", product);
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
    console.log("Product removed:", req.body.id);
    res.json({
        success: true,
        name: req.body.name,
        message: "Product successfully removed"
    });
   
});


//Creating api for getting all products

app.get('/allproducts',async (req,res)=>{
    let products=await Product.find({});
    console.log("All products:",products);
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



// API for searching products
// app.get('/search', async (req, res) => {
//     try {
//         const query = req.query.q; // Getting the search query from request query parameters

//         // Performing case-insensitive search on product names and categories
//         const products = await Product.find({
//             $or: [
//                 { name: { $regex: new RegExp(query, 'i') } }, // Searching product name
//                 { category: { $regex: new RegExp(query, 'i') } } // Searching product category
//             ]
//         });

//         if (products.length === 0) {
//             return res.status(404).json({ success: false, message: "No products found" });
//         }

//         res.json({ success: true, products });
//     } catch (error) {
//         console.error("Error during product search:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// });


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
    console.log("New Collection:",newcollection);
    res.send(newcollection);
});

//creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products=await Product.find({category:"womens"});
    let popular_in_women=products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);
});

//creating middleware to fetch user
// const fetchUser = async(req,res,next)=>{
//     const token=req.header('auth-token');
//     if(!token){
//         res.status(401).send({errors:"Token not found"});
//     }
// else{


//     try{
//         const data=jwt.verify(token,"secret_ecom");
//         req.user=data.user;
//         next();
//     }catch(error){
//         res.status(401).send({errors:"Invalid Token"});
//     }

// }
// };

// //creating endpoint for adding products to cartdata
// app.post('/addtocart',fetchUser,async (req,res)=>{
//     //console.log(req.body,req.user);
//    // console.log(req.headers);

//    console.log("added",req.body.itemId,req.user);

//    let userData=await Users.findOne({_id:req.user.id});
//    userData.cartData[req.body.itemId]+=1;
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//     res.send("Added to cart");
// });

// //creating endpoint for remove from cart data
// app.post('/removefromcart',fetchUser,async (req,res)=>{


//     console.log("removed",req.body.itemId,req.user);

//    let userData=await Users.findOne({_id:req.user.id});
//    if(userData.cartData[req.body.itemId]>0){
//     userData.cartData[req.body.itemId]-=1;
//    }
  
//     await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//     res.send("Remove to cart");

// });

// //creating endpoint for getting cart data
// app.post('/getcart',fetchUser,async (req,res)=>{

//     console.log("cartdata",req.user);
//     let userData=await Users.findOne({_id:req.user.id});
//     res.send(userData.cartData);

// });

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


// Define a schema for shipping information
const ShippingInfo = mongoose.model('ShippingInfo', {
    name: String,
    phoneNumber: String,
    email: String,
    address: String,
    deliveryInfo: String
});

app.post('/shipping-info', async (req, res) => {
    try {
        // Extract shipping information from the request body
        const { name, phoneNumber, email, address, deliveryInfo } = req.body;

        // Create a new ShippingInfo document
        const shippingInfo = new ShippingInfo({
            name,
            phoneNumber,
            email,
            address,
            deliveryInfo
        });

        // Save the shipping information to the database
        await shippingInfo.save();

        // Send confirmation email
        await sendConfirmationEmail(email, name); // Pass email and name to the sendConfirmationEmail function

        // Send a success response
        res.status(200).json({ success: true, message: "Shipping information saved successfully" });
    } catch (error) {
        // Handle any errors
        console.error("Error saving shipping information:", error);
        res.status(500).json({ success: false, message: "Failed to save shipping information" });
    }
});

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
            from: '"SiriusMart" <your-email@gmail.com>',
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