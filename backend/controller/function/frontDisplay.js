const {randomValues30}=require('./queries')
async  function frontDisplay(req,res){
    console.log('request has come');
    const result=await randomValues30();
    if(!result){
        console.log('random failed');
        return res.status(500).json({msg:"server error encountered"});
    }
    else{
        return res.json(result);
    }
}
module.exports=frontDisplay;