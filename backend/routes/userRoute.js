const express = require("express");
const authRouter = express.Router();
const {Register,Login,Logout,deleteProfile,checkUser,getUserProfile,updateUserProfile,addSearchHistory,addClickedProduct} = require("../controllers/userAuthentication");
const userMiddleware = require("../middleware/userMiddleware");



authRouter.post("/register",Register)
authRouter.post("/login",Login)
authRouter.post("/logout",userMiddleware,Logout)
authRouter.post("/deleteProfile/:id",userMiddleware,deleteProfile)
authRouter.get("/check",userMiddleware,checkUser)
authRouter.get("/profile",userMiddleware,getUserProfile)
authRouter.put("/updateprofile",userMiddleware,updateUserProfile)
authRouter.post("/searchHistory",userMiddleware,addSearchHistory)
authRouter.post("/clickedProduct",userMiddleware,addClickedProduct)


module.exports = authRouter;