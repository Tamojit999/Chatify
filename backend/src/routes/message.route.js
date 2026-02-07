import express from 'express';

const router=express.Router();

router.get('/',(req,res)=>
{
    res.send("Message API");
});

export default router;