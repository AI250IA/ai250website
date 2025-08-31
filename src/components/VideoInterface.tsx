import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { 
  Video, 
  Upload, 
  Wand2, 
  Download, 
  Share, 
  Sparkles, 
  Mic, 
  MicIcon,
  Play,
  Pause,
  Calendar,
  Trophy,
  Zap,
  FileText,
  Camera,
  Clock,
  Eye,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Move,
  Settings
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export const VideoInterface: React.FC = () => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [activeMode, setActiveMode] = useState('text2video');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('clear');
  const [duration, setDuration] = useState([10]);
  const [generatingVideos, setGeneratingVideos] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [scenes, setScenes] = useState<Array<{
    id: string;
    title: string;
    description: string;
    camera: string;
    audio: string;
    duration: number;
  }>>([
    {
      id: '1',
      title: `${t('video.scene')}1`,
      description: '',
      camera: 'medium',
      audio: '',
      duration: 3
    }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim() && selectedTemplate === '') return;
    
    setIsGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      const newVideo = prompt || selectedTemplate;
      setGeneratingVideos(prev => [...prev, newVideo]);
      setPrompt('');
      setIsGenerating(false);
    }, 5000);
  };

  const generateAIPrompt = () => {
    const prompts = language === 'zh' ? [
      '校园图书馆里，阳光透过窗户洒在桌上，学生们认真学习',
      '二次元风格的魔法少女在樱花飞舞的校园里施展魔法',
      '赛博朋克风格的未来教室，全息投影展示科技知识',
      '篮球场上，少年们挥洒汗水，夕阳西下超燃瞬间',
      '音乐社团在屋顶演奏，城市夜景作为背景'
    ] : [
      'In a campus library, sunlight streams through windows onto tables where students study attentively',
      'Anime-style magical girl casting spells on campus with cherry blossoms dancing around',
      'Cyberpunk-style future classroom with holographic projections showing tech knowledge',
      'Boys sweating on the basketball court, super cool moments at sunset',
      'Music club performing on the rooftop with city nightscape as background'
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  };

  const videoStyles = [
    { key: 'cinematic', label: t('video.styles.cinematic'), preview: '🎬', gradient: 'from-purple-500 to-indigo-600' },
    { key: 'animation', label: t('video.styles.animation'), preview: '🎨', gradient: 'from-pink-500 to-rose-500' },
    { key: 'documentary', label: t('video.styles.documentary'), preview: '📽️', gradient: 'from-green-500 to-teal-500' },
    { key: 'music-video', label: t('video.styles.music-video'), preview: '🎵', gradient: 'from-orange-500 to-amber-500' },
    { key: 'commercial', label: t('video.styles.commercial'), preview: '📺', gradient: 'from-blue-500 to-cyan-500' },
    { key: 'artistic', label: t('video.styles.artistic'), preview: '🌈', gradient: 'from-violet-500 to-purple-500' }
  ];

  const videoTemplates = [
    { key: 'campus', label: t('video.templates.campus'), preview: '🏫', description: t('video.templates.campus.desc') },
    { key: 'anime', label: t('video.templates.anime'), preview: '🌸', description: t('video.templates.anime.desc') },
    { key: 'scifi', label: t('video.templates.scifi'), preview: '🚀', description: t('video.templates.scifi.desc') },
    { key: 'romance', label: t('video.templates.romance'), preview: '💕', description: t('video.templates.romance.desc') },
    { key: 'comedy', label: t('video.templates.comedy'), preview: '😂', description: t('video.templates.comedy.desc') },
    { key: 'dance', label: t('video.templates.dance'), preview: '💃', description: t('video.templates.dance.desc') }
  ];

  const keywords = [
    t('video.keywords.campus'), t('video.keywords.youth'), t('video.keywords.friendship'), 
    t('video.keywords.dream'), t('video.keywords.technology'), t('video.keywords.future'),
    t('video.keywords.warm'), t('video.keywords.funny'), t('video.keywords.inspiring'), 
    t('video.keywords.romantic'), t('video.keywords.adventure'), t('video.keywords.growth')
  ];

  const modes = [
    { key: 'text2video', label: t('video.modes.text2video'), icon: '💬' },
    { key: 'voice2video', label: t('video.modes.voice2video'), icon: '🎤' },
    { key: 'script', label: t('video.modes.script'), icon: '📝' },
    { key: 'template', label: t('video.modes.template'), icon: '🎭' }
  ];

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const addScene = () => {
    const newScene = {
      id: String(scenes.length + 1),
      title: `${t('video.scene')}${scenes.length + 1}`,
      description: '',
      camera: 'medium',
      audio: '',
      duration: 3
    };
    setScenes(prev => [...prev, newScene]);
  };

  const removeScene = (id: string) => {
    if (scenes.length > 1) {
      setScenes(prev => prev.filter(scene => scene.id !== id));
    }
  };

  const updateScene = (id: string, field: string, value: string | number) => {
    setScenes(prev => prev.map(scene => 
      scene.id === id ? { ...scene, [field]: value } : scene
    ));
  };

  const moveScene = (id: string, direction: 'up' | 'down') => {
    const currentIndex = scenes.findIndex(scene => scene.id === id);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < scenes.length - 1)
    ) {
      const newScenes = [...scenes];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newScenes[currentIndex], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[currentIndex]];
      setScenes(newScenes);
    }
  };

  const cameraAngles = [
    { key: 'close', label: t('video.script.camera.close'), icon: '📷' },
    { key: 'medium', label: t('video.script.camera.medium'), icon: '🎥' },
    { key: 'wide', label: t('video.script.camera.wide'), icon: '🎬' },
    { key: 'overhead', label: t('video.script.camera.overhead'), icon: '🚁' },
    { key: 'lowangle', label: t('video.script.camera.lowangle'), icon: '⬆️' },
    { key: 'handheld', label: t('video.script.camera.handheld'), icon: '🤳' }
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
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Video className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('video.title')}
          </h2>
        </div>
        <p className="text-slate-300 text-lg">{t('video.subtitle')}</p>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 text-sm">{t('video.challenge.today')}</span>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            {t('video.challenge.desc')}
          </Badge>
        </motion.div>
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
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-slate-300"
              >
                <span className="mr-2">{mode.icon}</span>
                {mode.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Text to Video Tab */}
          <TabsContent value="text2video" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-3">{t('video.prompt')}</label>
                    <div className="flex gap-3">
                      <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('video.prompt.placeholder')}
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-12 text-base"
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={generateAIPrompt}
                          variant="outline"
                          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 h-12 px-4"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          {t('video.ai.prompt')}
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-3">{t('video.keywords')}</label>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword) => (
                        <motion.button
                          key={keyword}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleKeyword(keyword)}
                          className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                            selectedKeywords.includes(keyword)
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {keyword}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-3">{t('video.style')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {videoStyles.map((style) => (
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

                  {/* Quality & Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-slate-300 mb-3">{t('video.resolution')}</label>
                      <div className="space-y-2">
                        {[
                          { key: 'fast', label: t('video.quality.fast'), desc: '720p', color: 'from-green-500 to-emerald-500' },
                          { key: 'clear', label: t('video.quality.clear'), desc: '1080p', color: 'from-blue-500 to-cyan-500' },
                          { key: 'ultra', label: t('video.quality.ultra'), desc: '4K', color: 'from-purple-500 to-violet-500' }
                        ].map((quality) => (
                          <motion.button
                            key={quality.key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedQuality(quality.key)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                              selectedQuality === quality.key
                                ? `border-white bg-gradient-to-r ${quality.color} text-white`
                                : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{quality.label}</span>
                              <span className="text-sm opacity-80">{quality.desc}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-3">
                        {t('video.duration')}: {duration[0]}{t('video.duration.seconds')}
                      </label>
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        min={5}
                        max={60}
                        step={5}
                        className="w-full mb-4"
                      />
                      <div className="text-xs text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>{t('video.platform.tiktok')}: 15-30{t('video.duration.seconds')}</span>
                          <span>{duration[0] >= 15 && duration[0] <= 30 ? '✅' : '⚪'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('video.platform.bilibili')}: 30-60{t('video.duration.seconds')}</span>
                          <span>{duration[0] >= 30 && duration[0] <= 60 ? '✅' : '⚪'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('video.platform.xiaohongshu')}: 15-45{t('video.duration.seconds')}</span>
                          <span>{duration[0] >= 15 && duration[0] <= 45 ? '✅' : '⚪'}</span>
                        </div>
                      </div>
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
                      disabled={!prompt.trim() || isGenerating}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      style={isGenerating ? {
                        background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #ef4444)',
                        backgroundSize: '300% 300%',
                        animation: 'gradient-shift 2s ease infinite'
                      } : {}}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-3"
                          >
                            <Camera className="w-6 h-6" />
                          </motion.div>
                          {t('video.generating')}
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-6 h-6 mr-3" />
                          {t('video.generate')}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voice to Video Tab */}
          <TabsContent value="voice2video">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-32 h-32 mx-auto"
                  >
                    <Button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full h-full rounded-full ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      } text-white text-lg font-semibold`}
                    >
                      <Mic className="w-8 h-8" />
                    </Button>
                  </motion.div>
                  <div>
                    <h3 className="text-xl text-white mb-2">{t('video.voice.record')}</h3>
                    <p className="text-slate-400">
                      {isRecording ? t('video.recording') : t('video.voice.instruction')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Script Tab */}
          <TabsContent value="script">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-white mb-1">{t('video.script.title')}</h3>
                      <p className="text-sm text-slate-400">总时长: {scenes.reduce((total, scene) => total + scene.duration, 0)}{t('video.duration.seconds')}</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          // Preview all keyframes
                        }}
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t('video.script.preview.keyframe')}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                    <div className="space-y-4">
                      {scenes.map((scene, index) => (
                        <motion.div
                          key={scene.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          {/* Timeline dot */}
                          <div className="absolute left-5 top-4 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-slate-800 z-10"></div>
                          
                          {/* Scene card */}
                          <div className="ml-12 bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="space-y-4">
                              {/* Scene header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {scene.title}
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    {scene.duration}{t('video.duration.seconds')}
                                  </div>
                                </div>
                                
                                {/* Scene actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {index > 0 && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => moveScene(scene.id, 'up')}
                                      className="p-1 text-slate-400 hover:text-purple-400 transition-colors"
                                    >
                                      <ChevronUp className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                  {index < scenes.length - 1 && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => moveScene(scene.id, 'down')}
                                      className="p-1 text-slate-400 hover:text-purple-400 transition-colors"
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                  {scenes.length > 1 && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => removeScene(scene.id)}
                                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                </div>
                              </div>

                              {/* Scene content */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Description */}
                                <div>
                                  <label className="block text-sm text-slate-300 mb-2">{t('video.script.description')}</label>
                                  <Input
                                    value={scene.description}
                                    onChange={(e) => updateScene(scene.id, 'description', e.target.value)}
                                    placeholder={t('video.script.placeholder')}
                                    className="bg-slate-600/50 border-slate-500 text-white placeholder-slate-400"
                                  />
                                </div>

                                {/* Camera angle */}
                                <div>
                                  <label className="block text-sm text-slate-300 mb-2">{t('video.script.camera')}</label>
                                  <div className="grid grid-cols-3 gap-1">
                                    {cameraAngles.map((angle) => (
                                      <motion.button
                                        key={angle.key}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateScene(scene.id, 'camera', angle.key)}
                                        className={`p-2 rounded-lg text-xs transition-all duration-300 ${
                                          scene.camera === angle.key
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-500/50'
                                        }`}
                                      >
                                        <div className="text-center">
                                          <div className="text-sm mb-1">{angle.icon}</div>
                                          <div className="leading-tight">{angle.label}</div>
                                        </div>
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Audio and duration */}
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                  <label className="block text-sm text-slate-300 mb-2">{t('video.script.audio')}</label>
                                  <Input
                                    value={scene.audio}
                                    onChange={(e) => updateScene(scene.id, 'audio', e.target.value)}
                                    placeholder="背景音乐、音效描述..."
                                    className="bg-slate-600/50 border-slate-500 text-white placeholder-slate-400"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm text-slate-300 mb-2">{t('video.script.duration.label')}</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={scene.duration}
                                    onChange={(e) => updateScene(scene.id, 'duration', parseInt(e.target.value) || 1)}
                                    className="bg-slate-600/50 border-slate-500 text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Add scene button */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                    <div className="absolute left-5 top-4 w-3 h-3 bg-slate-600 rounded-full border-2 border-slate-800"></div>
                    <div className="ml-12">
                      <Button
                        onClick={addScene}
                        variant="outline"
                        className="w-full border-dashed border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-purple-500/50 py-8"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        {t('video.script.add')}
                      </Button>
                    </div>
                  </motion.div>

                  {/* Generate from script */}
                  <motion.div 
                    className="flex justify-center pt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        // Generate video from script
                        handleGenerate();
                      }}
                      disabled={scenes.some(scene => !scene.description.trim())}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <Camera className="w-6 h-6 mr-3" />
                      {t('video.generate')}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Template Tab */}
          <TabsContent value="template">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoTemplates.map((template) => (
                    <motion.div
                      key={template.key}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTemplate(template.key)}
                      className={`cursor-pointer rounded-lg p-6 border-2 transition-all duration-300 ${
                        selectedTemplate === template.key
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{template.preview}</div>
                        <h3 className="font-medium mb-2">{template.label}</h3>
                        <p className="text-sm opacity-80">{template.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Generated Videos Gallery */}
      <AnimatePresence>
        {generatingVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              {t('video.generated')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatingVideos.slice(-6).map((videoPrompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center relative overflow-hidden">
                        {/* Placeholder for generated video */}
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <div className="text-center p-3">
                            <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{videoPrompt}</p>
                          </div>
                        </div>
                        
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </motion.button>
                        </div>
                        
                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="w-full p-3 space-y-2">
                            <div className="flex items-center justify-between text-sm text-slate-400">
                              <span>{t('video.duration')}: {duration[0]}{t('video.duration.seconds')}</span>
                              <span>{t('video.quality.info')}</span>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex-1 p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                              >
                                <Download className="w-4 h-4 mx-auto" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex-1 p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors text-sm"
                              >
                                <Share className="w-4 h-4 mx-auto" />
                              </motion.button>
                            </div>
                            {/* AI Style Tag */}
                            <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 text-xs">
                              🎬 {t('video.ai.style.cyberpunk')}
                            </Badge>
                          </div>
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
          // Handle file drop
        }}
      >
        <Card className={`bg-slate-800/50 backdrop-blur-md border-slate-700/50 border-dashed transition-all duration-300 ${
          dragActive ? 'border-purple-500 bg-purple-500/10 scale-105' : ''
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
              <h3 className="text-lg text-white mb-2">{t('video.upload.title')}</h3>
              <p className="text-slate-400 mb-6 text-lg">{t('video.upload.desc')}</p>
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 py-3"
              >
                {t('video.upload.select')}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};