// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SkeletonCard = () => {
  return (
    <motion.div
      className="border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Placeholder */}
      <div className="bg-gray-300 rounded-lg h-40 w-full mb-4"></div>

      {/* Title Placeholder */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Subtitle / size placeholder */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>

      {/* Button Placeholder */}
      <div className="h-10 bg-gray-300 rounded w-full mt-auto"></div>
    </motion.div>
  );
};

export default SkeletonCard;