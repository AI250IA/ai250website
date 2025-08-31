import { useState, useEffect, useCallback } from 'react';
import { chatAPI, imageAPI, videoAPI, voiceAPI } from './api';
import { toast } from 'sonner@2.0.3';

// 通用API状态hook
interface UseApiStateOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export function useApiState<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiStateOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options.showToast) {
        toast.success('操作成功完成');
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      if (options.showToast !== false) {
        toast.error(`操作失败: ${error.message}`);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Chat hooks
export function useChatMessage() {
  return useApiState(async (message: string, conversationId?: string, modelOverride?: string) => {
    const result = await chatAPI.sendMessage(message, conversationId, modelOverride);
    
    // 保存到本地存储
    if (conversationId) {
      const stored = localStorage.getItem(`conversation_${conversationId}`);
      const messages = stored ? JSON.parse(stored) : [];
      
      // 添加用户消息和AI回复
      messages.push({
        id: crypto.randomUUID(),
        content: message,
        role: 'user',
        timestamp: result.timestamp
      });
      
      messages.push({
        id: crypto.randomUUID(),
        content: result.response,
        role: 'assistant',
        timestamp: result.timestamp
      });
      
      localStorage.setItem(`conversation_${conversationId}`, JSON.stringify(messages));
    }
    
    return result;
  }, {
    showToast: false, // Chat不需要toast提示
  });
}

export function useConversation() {
  return useApiState(chatAPI.getConversation, {
    showToast: false,
  });
}

export function useCreateConversation() {
  return useApiState(chatAPI.createConversation, {
    showToast: false,
  });
}

// Image hooks
export function useImageGeneration() {
  const [taskId, setTaskId] = useState<string | null>(null);

  const generateImage = useApiState(imageAPI.generateFromText, {
    onSuccess: (data) => {
      setTaskId(data.taskId);
      if (data.status === 'completed' && data.imageUrl) {
        toast.success('图片生成完成！');
      }
    },
    showToast: false,
  });

  const generateFromImage = useApiState(imageAPI.generateFromImage, {
    onSuccess: (data) => {
      setTaskId(data.taskId);
      if (data.status === 'completed' && data.imageUrl) {
        toast.success('图片生成完成！');
      }
    },
    showToast: false,
  });

  return {
    generateFromText: generateImage,
    generateFromImage,
    taskId,
    isPolling: false, // 新API是即时完成的，不需要轮询
  };
}

// Video hooks
export function useVideoGeneration() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoResult, setVideoResult] = useState<string | null>(null);

  const generateVideo = useApiState(videoAPI.generateFromText, {
    onSuccess: (data) => {
      if (data.status === 'processing') {
        setTaskId(data.taskId);
        setProgress(0);
        
        // 监听自定义事件
        const handleVideoComplete = (event: CustomEvent) => {
          if (event.detail.taskId === data.taskId) {
            setVideoResult(event.detail.videoUrl);
            setProgress(100);
            toast.success('视频生成完成！');
            window.removeEventListener('videoTaskComplete', handleVideoComplete as EventListener);
          }
        };
        
        window.addEventListener('videoTaskComplete', handleVideoComplete as EventListener);
        
        // 模拟进度更新
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 15 + 5;
          });
        }, 1000);
      }
    },
    showToast: false,
  });

  const generateFromScript = useApiState(videoAPI.generateFromScript, {
    onSuccess: (data) => {
      if (data.status === 'processing') {
        setTaskId(data.taskId);
        setProgress(0);
        
        const handleVideoComplete = (event: CustomEvent) => {
          if (event.detail.taskId === data.taskId) {
            setVideoResult(event.detail.videoUrl);
            setProgress(100);
            toast.success('视频生成完成！');
            window.removeEventListener('videoTaskComplete', handleVideoComplete as EventListener);
          }
        };
        
        window.addEventListener('videoTaskComplete', handleVideoComplete as EventListener);
      }
    },
    showToast: false,
  });

  return {
    generateFromText: generateVideo,
    generateFromScript,
    taskId,
    isPolling: !!taskId && !videoResult,
    progress,
    videoResult,
  };
}

// Voice hooks
export function useVoiceGeneration() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const textToSpeech = useApiState(voiceAPI.textToSpeech, {
    onSuccess: (data) => {
      if (data.status === 'processing') {
        setTaskId(data.taskId);
        startPolling(data.taskId);
      } else if (data.status === 'completed') {
        toast.success('语音生成完成！');
      }
    },
    showToast: false,
  });

  const processAudio = useApiState(voiceAPI.processAudio, {
    onSuccess: (data) => {
      if (data.status === 'processing') {
        setTaskId(data.taskId);
        startPolling(data.taskId);
      } else if (data.status === 'completed') {
        toast.success('音频处理完成！');
      }
    },
    showToast: false,
  });

  const startPolling = useCallback((taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await voiceAPI.getTaskStatus(taskId);
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          
          if (status.status === 'completed') {
            toast.success('语音处理完成！');
          } else if (status.status === 'failed') {
            toast.error('语音处理失败，请重试');
          }
        }
      } catch (error) {
        console.error('Voice polling error:', error);
      }
    }, 2000);

    setPollingInterval(interval);
  }, []);

  // 清理polling
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return {
    textToSpeech,
    processAudio,
    taskId,
    isPolling: !!pollingInterval,
  };
}

// 文件上传hook
export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const upload = useCallback(async (file: File, type: 'image' | 'video' | 'audio') => {
    setUploadProgress(0);
    
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // 这里可以集成真实的文件上传API
      const result = await new Promise<{fileUrl: string; fileId: string}>((resolve) => {
        setTimeout(() => {
          resolve({
            fileUrl: URL.createObjectURL(file),
            fileId: Math.random().toString(36).substr(2, 9)
          });
        }, 1000);
      });

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
      return result;
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      throw error;
    }
  }, []);

  return {
    upload,
    uploadProgress,
  };
}
