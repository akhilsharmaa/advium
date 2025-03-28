import express, { Router } from 'express'; 
import getPost from "./posts/get"

const router: Router = express.Router(); 
router.use('', [getPost])

export default router; 