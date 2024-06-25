let express = require("express")

let app = express();

require('dotenv').config();

app.use(express.json())
let product = []

app.get('/Hello', (req,res)=>{

    try{
        res.status(200).send("Hello")
    }
    catch(err){
        res.status(500).send("Internal server Error")
    }
});

app.post('/createproduct',(req,res) => {
        
    try{
        let obj = req.body
        obj.id = product.length + 1
        obj.isdeleted = false // for soft delete method
        product.push(obj)
        console.log(req.body)
        res.status(201).send({
            "msg":"Product added successfully"
        })
    }
    catch(err){
        res.status(500).send("Internal server Error")
    }

})

// app.get('/product',(req,res) => {
        
//     console.log(product)

//     res.send({
//         data :product
//     })
// }) // this is to get the normal product in the array

app.get('/product',(req,res) => {

    try{
        console.log(product)
        let softdel = product.filter((val) => {
            if(val.isdeleted == false){
                return true
            }
        })

        res.status(200).send(softdel)
    }
    catch(err){
        res.status(500).send("Internal server Error")
    }
})

app.get('/query',(req,res)=>{
    try{
        let name = req.query.name
        let id = req.query.id
        res.status(200).send("Hello " + name + id)
    }
    catch(err){
        res.status(500).send("Internal server Error")
    }
})

app.get('/param:name',(req,res) => {

    try{
        let name = req.params.name
    res.status(200).send("Hello " + name)
    }
    catch(err){
        res.status(500).send("Internal server Error")
    }
})

app.put('/updateproduct',(req,res) => {
        
    try{
        // console.log(req.query.id)
        let id = req.query.id
        let obj = req.body
    
        // let filt = product.find((val) => {
        //     if(val.id == id){
        //         return true
        //     }
        // })
        let filt = product.find((val)=> (val.id == id))
        // console.log("SearchProduct",filt)
        if(filt.isdeleted == true){   // If is added for soft delete So pls change it for the report
            res.status(404).send("Product Not found")
        }
        else{
            filt.Productname = obj.Productname?obj.Productname:filt.Productname
            filt.Productcost = obj.Productcost?obj.Productcost:filt.Productcost
            filt.Productdes = obj.Productdes?obj.Productdes:filt.Productdes

            // product.push(filt)
            // console.log("products",product)

            res.status(200).send({msg:"Product Updated Successfully"})
        }
    }
    catch(err){
        res.status(500).send("Internal server Error")
    }
})

// app.delete('/deleteproduct',(req,res) => {
//     let id1 = req.query.id
//     let del = product.findIndex((val)=>(val.id == id1))
//     product.splice(del,1)

//     console.log(product)

//     res.send({msg:"Product Deleted Successfully"})
// })

app.delete('/softdeleteproduct',(req,res) => {

    try {
        let id1 = req.query.id
        let del = product.find((val)=>(val.id == id1))
        
        del.isdeleted = true
    
        res.status(200).send({msg:"Product Soft Deleted Successfully"})
        
    } catch(err) {
        res.status(500).send("Internal server Error")
    }
})

app.get('/sortascdes',(req,res) => {
    try {
        let sor = req.query.sor
        let arry = product.sort((a,b)=>{
            if(sor == "asc"){
                return a.cost - b.cost
            }
            else if(sor == "des"){
                return b.cost-a.cost
            }
            else{
                res.status(404).send({msg : "Wrong Input!!"})
            }

            res.status(200).send(arry)
        })
    } catch (err){
        res.status(500).send("Internal Server Error")
    }
})

app.listen(process.env.PORT,(err)=>{
    if(!err){
        console.log("Server running on "+process.env.PORT)
    }
})