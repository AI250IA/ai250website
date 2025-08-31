import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Image, Wand2, Download, Trash2, Zap, Mic, PenTool, Sparkles, Share, RotateCcw, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { useImageGeneration } from '../utils/hooks';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  size: string;
  timestamp: string;
}

export const ImageInterface: React.FC = () => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [activeMode, setActiveMode] = useState('text2img');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { generateFromText, generateFromImage, isPolling } = useImageGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim() || generateFromText.loading) return;
    
    try {
      const result = await generateFromText.execute(
        prompt.trim(),
        selectedStyle || 'realistic',
        selectedSize
      );

      if (result.status === 'completed' && result.imageUrl) {
        // 直接显示完成的图片
        const newImage: GeneratedImage = {
          id: result.taskId,
          url: result.imageUrl,
          prompt: prompt.trim(),
          style: selectedStyle || 'realistic',
          size: selectedSize,
          timestamp: new Date().toISOString()
        };
        setGeneratedImages(prev => [newImage, ...prev]);
        setPrompt('');
      }
      // 如果是processing状态，polling会在hooks中处理
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  // 监听polling完成事件
  useEffect(() => {
    if (generateFromText.data && generateFromText.data.status === 'completed' && generateFromText.data.imageUrl) {
      const existingIndex = generatedImages.findIndex(img => img.id === generateFromText.data.taskId);
      if (existingIndex === -1) {
        // 添加新的完成图片
        const newImage: GeneratedImage = {
          id: generateFromText.data.taskId,
          url: generateFromText.data.imageUrl,
          prompt: prompt || '生成的图片',
          style: selectedStyle || 'realistic',
          size: selectedSize,
          timestamp: new Date().toISOString()
        };
        setGeneratedImages(prev => [newImage, ...prev]);
      }
    }
  }, [generateFromText.data]);

  // 处理上传的图片文件
  const handleImageFile = async (file: File) => {
    if (!file || generateFromImage.loading) return;
    try {
      const result = await generateFromImage.execute(
        file,
        prompt.trim() || '图片重绘',
        selectedStyle || 'realistic'
      );

      if (result.status === 'completed' && result.imageUrl) {
        const newImage: GeneratedImage = {
          id: result.taskId,
          url: result.imageUrl,
          prompt: prompt.trim() || '图片重绘',
          style: selectedStyle || 'realistic',
          size: selectedSize,
          timestamp: new Date().toISOString()
        };
        setGeneratedImages(prev => [newImage, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate image from upload:', error);
    }
  };

  const generateAIPrompt = () => {
    const prompts = [
      '一只戴着魔法帽的小狐狸在星空下读书',
      '蒸汽朋克风格的机器人在花园里种花',
      '彩虹色的独角兽在云朵上睡觉',
      '穿着宇航服的猫咪在月球上钓鱼',
      '水彩风格的龙在樱花树下品茶'
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  };

  const imageStyles = [
    { key: 'anime', label: t('image.styles.anime'), preview: '🎨', gradient: 'from-pink-500 to-purple-500' },
    { key: 'realistic', label: t('image.styles.realistic'), preview: '📷', gradient: 'from-blue-500 to-cyan-500' },
    { key: 'painting', label: t('image.styles.painting'), preview: '🖼️', gradient: 'from-orange-500 to-red-500' },
    { key: 'sketch', label: t('image.styles.sketch'), preview: '✏️', gradient: 'from-gray-500 to-slate-600' },
    { key: 'digital', label: t('image.styles.digital'), preview: '💫', gradient: 'from-violet-500 to-indigo-500' },
    { key: 'watercolor', label: t('image.styles.watercolor'), preview: '🌈', gradient: 'from-teal-500 to-green-500' }
  ];

  const modes = [
    { key: 'text2img', label: t('image.modes.text2img'), icon: '💬' },
    { key: 'img2img', label: t('image.modes.img2img'), icon: '🖼️' },
    { key: 'voice', label: t('image.modes.voice'), icon: '🎤' },
    { key: 'sketch', label: t('image.modes.sketch'), icon: '✏️' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <motion.div 
            className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {t('image.title')}
          </h2>
        </div>
        <p className="text-slate-300 text-lg">{t('image.subtitle')}</p>
      </motion.div>

      {/* Mode Tabs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-md border-slate-700/50 mb-6">
            {modes.map((mode) => (
              <TabsTrigger 
                key={mode.key} 
                value={mode.key}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-slate-300"
              >
                <span className="mr-2">{mode.icon}</span>
                {mode.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="text2img" className="space-y-6">
            {/* Input Section */}
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-3">{t('image.prompt')}</label>
                    <div className="flex gap-3">
                      <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('image.prompt.placeholder')}
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-12 text-base"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={generateAIPrompt}
                          variant="outline"
                          className="border-pink-500/50 text-pink-400 hover:bg-pink-500/20 h-12 px-4"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          {t('image.ai.prompt')}
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-3">{t('image.style')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {imageStyles.map((style) => (
                        <motion.div
                          key={style.key}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedStyle(style.key)}
                          className={`cursor-pointer rounded-lg p-4 border-2 transition-all duration-300 ${
                            selectedStyle === style.key
                              ? `border-white bg-gradient-to-br ${style.gradient} text-white shadow-lg`
                              : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{style.preview}</div>
                            <div className="text-sm font-medium">{style.label}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-3">{t('image.size')}</label>
                    <div className="flex gap-3">
                      {[
                        { key: 'small', label: t('image.size.small'), ratio: '1:1' },
                        { key: 'medium', label: t('image.size.medium'), ratio: '16:9' },
                        { key: 'large', label: t('image.size.large'), ratio: '9:16' }
                      ].map((size) => (
                        <motion.button
                          key={size.key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSize(size.key)}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                            selectedSize === size.key
                              ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                              : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium">{size.label}</div>
                            <div className="text-xs text-slate-400">{size.ratio}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <motion.div 
                    className="flex justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || generateFromText.loading}
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      style={(generateFromText.loading || isPolling) ? {
                        background: 'linear-gradient(45deg, #ec4899, #8b5cf6, #6366f1)',
                        backgroundSize: '300% 300%',
                        animation: 'gradient-shift 2s ease infinite'
                      } : {}}
                    >
                      {(generateFromText.loading || isPolling) ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-3"
                          >
                            <Loader2 className="w-6 h-6" />
                          </motion.div>
                          {t('image.generating')}
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-6 h-6 mr-3" />
                          开始创作
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents */}
          <TabsContent value="img2img">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center text-slate-300">
                  <Upload className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl mb-2">图片转图片功能</h3>
                  <p>上传一张图片，让AI为你重新创作</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center text-slate-300">
                  <Mic className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl mb-2">语音描述功能</h3>
                  <p>用语音描述你想要的图片，AI来帮你实现</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sketch">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center text-slate-300">
                  <PenTool className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl mb-2">草图涂鸦功能</h3>
                  <p>画一个简单的草图，AI帮你变成精美的艺术作品</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Generated Images Gallery */}
      <AnimatePresence>
        {generatedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              {t('image.generated')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedImages.slice(0, 8).map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50 overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                        {/* Generated image */}
                        <ImageWithFallback
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Image info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-xs text-white leading-relaxed line-clamp-2">{image.prompt}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-pink-300 bg-pink-500/20 px-2 py-1 rounded">{image.style}</span>
                            <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded">{image.size}</span>
                          </div>
                        </div>
                        
                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
                            title="Remix"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            title="Download"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = image.url;
                              link.download = `generated-${image.id}.jpg`;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer?.files?.[0];
          if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
          }
        }}
      >
        <Card className={`bg-slate-800/50 backdrop-blur-md border-slate-700/50 border-dashed transition-all duration-300 ${
          dragActive ? 'border-pink-500 bg-pink-500/10 scale-105' : ''
        }`}>
          <CardContent className="p-12">
            <motion.div 
              className="text-center"
              animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={dragActive ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg text-white mb-2">{t('image.upload.title')}</h3>
              <p className="text-slate-400 mb-6 text-lg">{t('image.upload.desc')}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                  // reset value to allow re-upload same file
                  if (e.target) e.target.value = '';
                }}
              />
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!generateFromImage.loading}
              >
                {generateFromImage.loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('common.loading') || '处理中...'}
                  </>
                ) : (
                  t('image.upload.select')
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>


    </div>
  );
};
