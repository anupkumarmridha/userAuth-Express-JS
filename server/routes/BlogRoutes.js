import express from 'express';
const router = express.Router();
import checkUserAuth from '../middlewares/auth-middleware.js';
import BlogController from '../controllers/BlogController.js';
//check middleware
router.use('/add-blog-post', checkUserAuth);
router.use('/get-all-user-blogs', checkUserAuth);
router.use('/update-blog', checkUserAuth);
router.use('/delete-blog', checkUserAuth);

//public
router.get('/get-all-blogs',BlogController.getAllBlogs);

//private
router.post('/add-blog-post',BlogController.createBlogpost);
router.get('/get-all-user-blogs',BlogController.getAllBlogsOfUser);
router.post('/update-blog',BlogController.updateOneBlogOfUser);
router.delete('/delete-blog',BlogController.deleteOneBlogOfUser);
export default router;