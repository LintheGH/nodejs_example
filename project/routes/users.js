const db = require('../db/dbhelper');
const apiResult = require('../utils/apiResult');
const token = require('../token/token');

module.exports = {
    register:(app) => {
        app.post('/register',async (request,response) => {
            let params = {
                name:request.body.name,
                password:request.body.password,
                age:request.body.age,
                gender:request.body.gender
            }
            let data = {
                name : request.body.name,
                password:request.body.password
            }
            let res = await db.mongo.find('users',data);
            if(res.length >0){
                response.send(apiResult(false,{},'account is already exit'));
            }else{
                let result = await db.mongo.insert('users',params);
                let output = apiResult(true,result,'register success')
                response.send(output);
            } 
        })
    },
    login:(app) => {
        app.get('/login',async (request,response) => {
            
            let params = {
                name : request.query.name,
                password : request.query.password
            }
            
            let result = await db.mongo.find('users',params);
            
            
            if(result.length > 0){
                let _token = token.codeToken(request.query.name)
                console.log(_token)
                response.send(apiResult(true,{data:result,token:_token},'login success!'));
            }else{
                let output = apiResult(result.length > 0,{},'name or password uncorrect');
                response.send(output);
            }
        })
    },
    update:(app) => {
        app.post('/update',async (request,response) => {
            let params = {
                name:request.body.name,
                password:request.body.password
            }
            let dataset = await db.mongo.find('users',params);
            if(dataset.length <= 0){
                response.send(apiResult(false,{},'account is not exit'))
            }else{
                dataset[0].password = request.body.newpassword;
                let result = db.mongo.update('users',params,dataset[0]);
                response.send(apiResult(true,result,'update successed'));
            }
        })
    },
    delete:(app) => {
        app.post('/delete',async (request,response) => {
            let params = {
                name:request.body.name,
                password:request.body.password
            }
            let dataset = db.mongo.find('users',params);
            console.log(dataset)
            if(dataset <= 0){
                response.send(apiResult(false,{},'eror,account not exit'))
            }else{
                let result = db.mongo.delete('users',params);
                response.send(apiResult(true,result,'the collection has been deleted'))
            }
        })
    }
}