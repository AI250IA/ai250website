import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../LanguageContext';
import metaDiaLogo from 'figma:asset/336b4fef317f4db582809faad02340ea38abe7be.png';

export const AuthHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="inline-flex items-center gap-3 mb-4">
        <motion.div 
          className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ImageWithFallback
            src={metaDiaLogo}
            alt="MetaDIA Logo"
            className="w-10 h-10 object-contain"
          />
        </motion.div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          MetaDIA
        </h2>
      </div>
    </motion.div>
  );
};