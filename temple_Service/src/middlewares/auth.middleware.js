import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
   // 1. Pehle Cookie dekho
   let token = req.cookies.token;

   // 2. Agar cookie nahi hai, toh incoming Header dekho (Jo frontend interceptor bhej raha hai)
   if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
   }

   // Agar dono jagah kuch nahi mila, tabhi 401 throw karo
   if (!token) {
      return res.status(401).json({
         message: "Unauthorized - Token missing entirely"
      });
   }

   try {
      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET
      );

      req.user = decoded;
      next();

   } catch (error) {
      return res.status(401).json({
         message: "Invalid token structure or verification failed"
      });
   }
}