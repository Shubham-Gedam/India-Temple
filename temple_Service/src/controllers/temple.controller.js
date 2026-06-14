import Temple from "../model/temple.model.js";
import { createTempleValidation, updateTempleValidation, validate } from "../validations/temple.validation.js";

export const createTemple = [
    ...createTempleValidation,   // Validation rules
    validate,                    // Check errors
    async (req, res, next) => {
        try {
            const temple = await Temple.create(req.body);
            
            res.status(201).json({
                success: true,
                message: "Temple created successfully",
                temple
            });
        } catch (error) {
            next(error);
        }
    }
];

export const getAllTemples = async (req, res, next) => {
    try {
        const {state,city,deity,page = 1,limit = 10} = req.query;
        let query = {};
        if (state) query['location.state'] = state;
        if (city) query['location.city'] = city;
        if (deity) query.deity = deity;

        const sortBy =req.query.sort || "createdAt";
        const temples = await Temple.find(query)
            .sort(sortBy)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const totalTemples = await Temple.countDocuments(query);

        res.status(200).json({
   success:true,
   currentPage:Number(page),
   totalPages:Math.ceil(
      totalTemples / limit
   ),
   totalTemples,
   temples
});
    } catch (error) {
        next(error);
    }
};

export const getTempleBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required"
            });
        }

        const temple = await Temple.findOne({ slug: slug });

        if (!temple) {
            return res.status(404).json({
                success: false,
                message: `Temple with slug '${slug}' not found`
            });
        }

        res.status(200).json({
            success: true,
            temple
        });
    } catch (error) {
        console.error("Error in getTempleBySlug:", error); // Debugging ke liye
        next(error);
    }
};

export const updateTemple = [
    ...updateTempleValidation,
    validate,
    async (req, res, next) => {
        try {
            const { slug } = req.params;

            const temple = await Temple.findOneAndUpdate(
                { slug },
                req.body,
                { new: true, runValidators: true }
            );

            if (!temple) {
                return res.status(404).json({
                    success: false,
                    message: `Temple with slug '${slug}' not found`
                });
            }

            res.status(200).json({
                success: true,
                message: "Temple updated successfully",
                temple
            });
        } catch (error) {
            next(error);
        }
    }
];

export const deleteTemple = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const temple = await Temple.findOneAndDelete({ slug });

        if (!temple) {
            return res.status(404).json({
                success: false,
                message: `Temple with slug '${slug}' not found`
            });
        }

        res.status(200).json({
            success: true,
            message: "Temple deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const searchTemples = async(req,res,next)=>{
    try{

        const { q } = req.query;

        if(!q){
            return res.status(400).json({
                success:false,
                message:"Search query is required"
            });
        }

        const temples = await Temple.find({
            $or:[
                { name: { $regex: q, $options: "i" } },
                { deity: { $regex: q, $options: "i" } },
                { "location.state": { $regex: q, $options: "i" } },
                { "location.city": { $regex: q, $options: "i" } },
                { significance: { $regex: q, $options: "i" } },
                { historicalBackground: { $regex: q, $options: "i" } }
            ]
        });

        res.status(200).json({
            success:true,
            count:temples.length,
            temples
        });

    }catch(error){
        next(error);
    }
}

export const getFeaturedTemples = async(req,res,next)=>{
   try{

      const temples = await Temple.find({
         featured:true
      });

      res.status(200).json({
         success:true,
         temples
      });

   }catch(error){
      next(error);
   }
}

export const getTempleStats = async(req,res,next)=>{

   try{

      const totalTemples =
      await Temple.countDocuments();

      const verifiedTemples =
      await Temple.countDocuments({
         isVerified:true
      });

      const unverifiedTemples =
      await Temple.countDocuments({
         isVerified:false
      });

      res.status(200).json({
         success:true,
         totalTemples,
         verifiedTemples,
         unverifiedTemples
      });

   }catch(error){
      next(error);
   }
}

export const verifyTemple = async(req,res,next)=>{

   try{

      const temple =
      await Temple.findOne({
         slug:req.params.slug
      });

      if(!temple){
         return res.status(404).json({
            success:false,
            message:"Temple not found"
         });
      }

      temple.isVerified = true;

      await temple.save();

      res.status(200).json({
         success:true,
         message:"Temple verified"
      });

   }catch(error){
      next(error);
   }
}