import React from 'react';
import { Card, CardContent } from './ui/card';
import { BarChart3, Bell, BookOpen } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion } from 'motion/react';

export const FeatureCards: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: BarChart3,
      titleKey: 'feature.report.title',
      descKey: 'feature.report.desc',
      gradient: 'from-blue-400 to-cyan-400',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Bell, 
      titleKey: 'feature.news.title',
      descKey: 'feature.news.desc',
      gradient: 'from-purple-400 to-pink-400',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: BookOpen,
      titleKey: 'feature.guide.title', 
      descKey: 'feature.guide.desc',
      gradient: 'from-emerald-400 to-green-400',
      bgGradient: 'from-emerald-500/10 to-green-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className={`group cursor-pointer bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2 group-hover:text-white/90 transition-colors">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};