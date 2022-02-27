const cors = require('cors');
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname,'reviews.json')

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.get('/review',(req,res)=>{
    
    const readData = fs.readFileSync(filePath,'utf-8');
    const parsedata = JSON.parse(readData);      
    const getByRating = (data,ratingNumber) => {
        return data.filter(e=> e.rating >= ratingNumber)
    }   
    const newData =  getByRating(parsedata,req.query.min_rating)
    var sortedData = newData;

    if(req.query.highest_first =='highest-first' && req.query.order_date =='newest-first'){
        sortedData = newData.sort((a,b)=> {
            if(a.rating === b.rating){
                return a.reviewCreatedOnTime > b.reviewCreatedOnTime? -1 : 1
            }
            else{
                return a.rating > b.rating ? -1 : 1
            }
           
        });   
    }   
    else if(req.query.highest_first =='highest-first' && req.query.order_date =='oldest-first'){
        sortedData = newData.sort((a,b)=> {
            if(a.rating === b.rating){
                return a.reviewCreatedOnTime < b.reviewCreatedOnTime? -1 : 1
            }
            else{
                return a.rating > b.rating ? -1 : 1
            }
           
        }); 
    
    }
    else if(req.query.highest_first =='lowest-first' && req.query.order_date =='newest-first'){
        sortedData = newData.sort((a,b)=> {
            if(a.rating === b.rating){
                return a.reviewCreatedOnTime > b.reviewCreatedOnTime? -1 : 1
            }
            else{
                return a.rating < b.rating ? -1 : 1
            }
           
        }); 
    
    }
       
    else if(req.query.highest_first =='lowest-first' && req.query.order_date =='oldest-first'){
        sortedData = newData.sort((a,b)=> {
            if(a.rating === b.rating){
                return a.reviewCreatedOnTime < b.reviewCreatedOnTime? -1 : 1
            }
            else{
                return a.rating < b.rating ? -1 : 1
            }
           
        }); 
    
    }
       
          
    if(req.query.prioritize_by_text=='yes'){
        const dataWithText = sortedData.filter(e => e.reviewText !== "")
        const dataWithOutText = sortedData.filter(e => e.reviewText === "")
        const finalData = [...dataWithText,...dataWithOutText]  
        return res.status(200).send(finalData);
    }    
    return res.status(200).send(sortedData);
})

app.listen(4000,err=>{  
    if(err){
        console.log(err.message);
    }
    else{
        console.log("server is runnig on port 4000");
    }
})