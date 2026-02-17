import express from 'express';
import {getMessages} from '../controller/message.controller.js';

const router=express.Router();

router.get('/',getMessages);

export default router;