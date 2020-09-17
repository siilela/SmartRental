'use strict';

const mongoose =require('mongoose');

const userSchema=mongoose.Schema({

   inumber:String,
   name:String,
   email:String,
   bookDate:String,
   comments:String
 
});

const User=mongoose.model('User',userSchema);

module.exports =User;




