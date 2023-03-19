import express from 'express';
const router = express.Router();
import UserContoller from '../controllers/UserController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

//two type of routes 1. public routes and 2. private routes
// check user midleware routes
router.use('/changePassword', checkUserAuth);
router.use('/user_details', checkUserAuth);

//public routes
router.post('/register', UserContoller.userResgistration);//when we insert value use post method
router.post('/login', UserContoller.userLogin);//when we insert value use post method
router.post('/reset-password-send-email', UserContoller.resetPasswordSendMail);
router.post('/resetPassword/:id/:token', UserContoller.userresetPassword);
//private routes
router.post('/changePassword', UserContoller.changePassword);
router.get('/user_details', UserContoller.user_details);
//Blog routes


export default router;