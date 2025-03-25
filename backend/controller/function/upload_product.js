const  { insertProduct } =require("./queries");
async function upload_product({req,res}){
    if(req.status!=='admin'){
        return  res.status(403).send();
    }
    console.log('request incoming');
    req.body.filename=req.file.filename;
    console.log('filename'+req.file);
    try{
         val=await insertProduct({req,res});
         return  val;
    }
    catch(err){
        console.log(err);
        return res.status(500).json({})
    }
    
}
module.exports=upload_product;