const {Dashboard}=require('../function/queries');
async function dashboard(req,res){

    console.log('incoming dashboard request');
    const userid=req.userid;

    try{
        const data=await Dashboard(userid);
        console.log(data);
        return res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        return res.status(500).send();
    }
}
module.exports=dashboard;