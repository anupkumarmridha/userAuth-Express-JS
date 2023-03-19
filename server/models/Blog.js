import mongoose from 'mongoose';
import User from './User.js';
const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        requried: true,
    },
    content:{
        type: String,
        required: true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required: true,
    }
},
{   
    timestamps: true,
});

const BlogModel = mongoose.model("Blog",BlogSchema);
export default BlogModel;
