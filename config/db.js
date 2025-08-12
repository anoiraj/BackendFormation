const mongoose = require("mongoose")

module.exports.connecttoMongoDB = async () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.Url_Mongo).then(() => {console.log("connect to db")}
    ).catch (
        (error) => { console.log(error) }
    )
}


//login : anoirajej02
//password : 3SU97RNFrg7IuA7P