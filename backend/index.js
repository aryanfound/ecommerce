const mysql=require('mysql2');
const express = require('express');
const cookieParser = require('cookie-parser'); 
const app = express();
const authRouter = require('./router/auth');
const { verify } = require('./router/Login&verify');
const cors = require('cors');
const multer = require('multer');
const {connection}=require('./controller/function/connect_server');
const upload_product=require('./controller/function/upload_product')
const path=require('path');
const frontDisplay=require('./controller/function/frontDisplay')
const productRouter=require('./router/productRouter');
const dashboard=require('./controller/function/dashboard')
const {review, getReviews}=require('./controller/function/queries')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './product_images'); 
    },
    filename: (req, file, cb) => {
        
        const ext = path.extname(file.originalname);
        
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

const PORT = 5000





const corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
};






app.use(cors(corsOptions));


app.use((req, res, next) => {
    console.log(`Payload Size: ${req.headers['content-length']} bytes`);
    next();
});


app.use(express.json({ limit: "10000mb" }));
app.use(express.urlencoded({ limit: "10000mb", extended: true }));
app.use(cookieParser());








app.use('/',verify);

app.get('/logout',(req,res)=>{
    console.log('logging out');
    res.clearCookie("auth_token", { path: "/" });
    
    return res.status(200).json({});
})
app.use('/product_images', express.static(path.join(__dirname, 'product_images')));


app.use('/auth',authRouter);


app.post('/upload', upload.single('productImage'), async (req, res) => {
   
    if (!req.file) {
        return res.status(500).json({ msg: 'failed at uploading' });
    }
    await upload_product({ req, res });
});



app.use('/product',productRouter)
app.get('/frontDisplay',frontDisplay);


app.get('/dashboard',dashboard);

app.post('/review',review);

app.get('/getreview',async (req,res)=>{
    console.log('getting reviews');
    const userid=req.userid;
    const productid=req.query.product;
    const review=await  getReviews({userid,productid});
    if(!review){
        console.log('value for it');
        return res.status(500).send()
    }
    else{
        console.log('this is reviw for it');
        console.log(review);
        return res.json(review);
    }
});









app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
},async()=>{
  
    console.log('database connected')
});
