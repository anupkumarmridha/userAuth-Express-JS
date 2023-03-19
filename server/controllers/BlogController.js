import BlogModel from "../models/Blog.js";
class BlogController {
   static createBlogpost = async (req, res) => {
      try {
         const { title, content } = req.body;
         const author = req.user._id;
         console.log(author);
         if (!title || !content) {

            res.status(400).send({ status: "failed", message: "All filed are required" });
         }
         const newBlog = new BlogModel({
            title: title,
            content: content,
            author: author,
         });
         const Bolg = await newBlog.save();
         res.status(200).send({ status: "success", message: "saved successfully", Blog: Bolg });
      }
      catch (err) {
         console.log(err);
         res.status(500).send({ status: "failed", message: "internal server error" });
      }
   };
   /*
   //also we can do like this
   const newBlog = new BlogModel({
     title: title,
     content: content,
     author: req.user._id,
   });
   */

   /*
   //also we can do like this
   const { _id } = req.user;
   const newBlog = new BlogModel({
     title: title,
     content: content,
     author: _id,
   });
   */

   static getAllBlogs = async (req, res) => {
      try {
         // this method find all blogs without user information
         // const blogs = await BlogModel.find();
         // this method find all blogs with user information
         const blogs = await BlogModel.find().populate({
            path: 'author',
            select: '-password -_id -email',
         });
         res.status(200).send({ status: "success", blogs: blogs });
      } catch (error) {
         console.log(error);
         res.status(500).send({ status: "failed", message: "unable to get blogs" });
      }
   };

   static getAllBlogsOfUser = async (req, res) => {
      try {
         const author = req.user._id;
         //  const blogs = await BlogModel.find({ author: author });
         const blogs = await BlogModel.find({ author: author }).populate({
            path: 'author',
            select: '-password'
         });
         res.status(200).send({ status: "success", blogs: blogs });
      } catch (error) {
         console.log(error);
         res.status(500).send({ status: "failed", message: "unable to get blogs" });
      }
   };

   static updateOneBlogOfUser = async (req, res) => {
      try {
         const author = req.user._id;
         const { blogId, title, content } = req.body;
         if (!blogId) {
            res.status(400).send({ status: "failed", message: "blogId is not present in body" });
         }
         const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: blogId, author: author },
            { title:title, content:content },
            { new: true }
         );

         if (!updatedBlog) {
            return res.status(404).send({ status: "failed", message: "Blog not found" });
         }

         res.status(200).send({ status: "Update success", blog: updatedBlog });
      } catch (error) {
         console.error(error);
         res.status(500).send({ status: "failed", message: "Unable to update blog" });
      }
   };

   static deleteOneBlogOfUser = async (req, res) => {
      try {
         const userId = req.user._id;
         const { blogId } = req.body;

         if (!blogId) {
            return res.status(400).send({ status: "failed", message: "blogId is not present in body" });
         }

         const result = await BlogModel.deleteOne({ _id: blogId, author: userId });

         if (result.deletedCount === 0) {
            return res.status(404).send({ status: "failed", message: "Blog not found" });
         }

         res.status(200).send({ status: "success", result: result, count: result.deletedCount });
      } catch (error) {
         console.error(error);
         res.status(500).send({ status: "failed", message: "unable to Delete Blog" });
      }
   };

}

export default BlogController;