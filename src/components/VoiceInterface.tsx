import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mic, Play, Pause, Download, Trash2, Volume2, AudioWaveform, FileAudio } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';

export const VoiceInterface: React.FC = () => {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [generatedAudios, setGeneratedAudios] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([0]);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    // Simulate audio generation
    setTimeout(() => {
      setGeneratedAudios(prev => [...prev, text]);
      setText('');
      setIsGenerating(false);
    }, 2000);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // Simulate recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setText(t('voice.text.placeholder'));
      }, 3000);
    }
  };

  const togglePlay = (index: number) => {
    setPlayingIndex(playingIndex === index ? null : index);
  };

  const voices = [
    { key: 'female-1', label: t('voice.voices.female-1') },
    { key: 'female-2', label: t('voice.voices.female-2') },
    { key: 'male-1', label: t('voice.voices.male-1') },
    { key: 'male-2', label: t('voice.voices.male-2') },
    { key: 'child', label: t('voice.voices.child') },
    { key: 'elderly', label: t('voice.voices.elderly') }
  ];

  const languages = [
    { key: 'zh-cn', label: t('voice.languages.zh-cn') },
    { key: 'en-us', label: t('voice.languages.en-us') },
    { key: 'ja-jp', label: t('voice.languages.ja-jp') },
    { key: 'ko-kr', label: t('voice.languages.ko-kr') },
    { key: 'fr-fr', label: t('voice.languages.fr-fr') },
    { key: 'de-de', label: t('voice.languages.de-de') }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {t('voice.title')}
          </h2>
        </div>
        <p className="text-slate-300 text-lg">{t('voice.subtitle')}</p>
      </motion.div>

      {/* Generation Controls */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Voice and Language Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">{t('voice.select')}</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder={t('voice.select')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {voices.map(voice => (
                        <SelectItem key={voice.key} value={voice.key} className="text-slate-300 hover:bg-slate-700">
                          {voice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">{t('voice.language')}</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder={t('voice.language')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {languages.map(lang => (
                        <SelectItem key={lang.key} value={lang.key} className="text-slate-300 hover:bg-slate-700">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Voice Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    {t('voice.speed')}: {speed[0]}x
                  </label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    {t('voice.pitch')}: {pitch[0] > 0 ? '+' : ''}{pitch[0]}
                  </label>
                  <Slider
                    value={pitch}
                    onValueChange={setPitch}
                    min={-10}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">{t('voice.text')}</label>
                <div className="space-y-3">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('voice.text.placeholder')}
                    className="min-h-[120px] bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
                  />
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleRecord}
                        variant={isRecording ? "destructive" : "outline"}
                        className={`${isRecording 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isRecording ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Mic className="w-5 h-5 mr-2" />
                          </motion.div>
                        ) : (
                          <Mic className="w-5 h-5 mr-2" />
                        )}
                        {isRecording ? t('voice.record.stop') : t('voice.record.start')}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleGenerate}
                        disabled={!text.trim() || isGenerating}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6"
                      >
                        {isGenerating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Volume2 className="w-5 h-5 mr-2" />
                          </motion.div>
                        ) : (
                          <Volume2 className="w-5 h-5 mr-2" />
                        )}
{t('voice.generate')}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Audio List */}
      <AnimatePresence>
        {generatedAudios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl text-white">{t('voice.generated')}</h3>
            <div className="space-y-3">
              {generatedAudios.map((audioText, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-orange-500/50 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => togglePlay(index)}
                          className="p-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full"
                        >
                          {playingIndex === index ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </motion.button>
                        
                        <div className="flex-1">
                          <p className="text-white text-sm leading-relaxed">{audioText}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <AudioWaveform className="w-4 h-4 text-slate-400" />
                            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                              {playingIndex === index && (
                                <motion.div
                                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 3, ease: "linear" }}
                                />
                              )}
                            </div>
                            <span className="text-xs text-slate-400">00:03</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                          >
                            <Download className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700"
                          >
                            <Trash2 className="w-5 h-5" />
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

      {/* Audio Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 border-dashed">
          <CardContent className="p-8">
            <div className="text-center">
              <FileAudio className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">{t('voice.upload.title')}</h3>
              <p className="text-slate-400 mb-4">{t('voice.upload.desc')}</p>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                {t('voice.upload.select')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};