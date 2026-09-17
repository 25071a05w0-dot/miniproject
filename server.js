import exp from"express";
import cookieParser from"cookie-parser";
import{connect}from"mongoose";
import{config}from"dotenv";
import{userRoutes}from"./api/userAPI.js";
import{jobRoutes}from"./api/jobAPI.js";
import{applicationRoutes}from"./api/applicationAPI.js";
import{adminRoutes}from"./api/adminAPI.js";
config();

const application=exp();

application.use(exp.json());
application.use(cookieParser());

// Root endpoint to check server status
application.get("/",(req,res)=>{
  res.json({success:true,message:"Job Portal Backend is running"});
});

// API routes
application.use("/user-api",userRoutes);
application.use("/job-api",jobRoutes);
application.use("/application-api",applicationRoutes);
application.use("/admin-api",adminRoutes);

const serverPort=process.env.PORT||3000;

// Connect to MongoDB and start server
async function connectDB(){
  try{
    await connect(process.env.MONGO_URI);
    console.log("DB Connected");
    application.listen(serverPort,()=>console.log(`server listening on ${serverPort}..`));
  }catch(err){
    console.log("err in db connect:",err);
  }
}
connectDB();

// Global error handling middleware
application.use((err,req,res,next)=>{
  console.log("err is",err);
  res.status(err.status||500).json({
    success:false,
    message:err.message||"Something went wrong"
  });
});
