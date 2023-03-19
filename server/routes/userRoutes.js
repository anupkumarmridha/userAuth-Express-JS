import express from 'express';
const router = express.Router();
import UserContoller from '../controllers/UserController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

//two type of routes 1. public routes and 2. private routes
// check user midleware routes
router.use('/change-password', checkUserAuth);
router.use('/logged-user', checkUserAuth);

//public routes
router.post('/register', UserContoller.userResgistration);//when we insert value use post method
router.post('/login', UserContoller.userLogin);//when we insert value use post method
router.post('/reset-password-send-email', UserContoller.resetPasswordSendMail);
router.post('/reset-password/:id/:token', UserContoller.userResetPassword);

//private routes
router.post('/change-password', UserContoller.changePassword);
router.get('/logged-user', UserContoller.loggedUser);
//Blog routes


export default router;