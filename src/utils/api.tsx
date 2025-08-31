// API基础配置
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  (import.meta.env.PROD ? 'https://api.ai250.org/api/v1' : 'http://0.0.0.0:8000/api/v1');

// 通用API请求函数
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// 文本模型默认回退列表（API不可用时使用）
const DEFAULT_TEXT_MODELS: string[][] = [
  ["deepseek-ai/DeepSeek-R1-0528-Qwen3-8B", "垂类研究"],
  ["Tongyi-Zhiwen/QwenLong-L1-32B", "跨界融合"],
  ["tencent/Hunyuan-A13B-Instruct", "结构输出"],
  ["alibaba/Qwen2-72B-Instruct", "Gemini"],
  ["alibaba/Qwen2-72B-Instruct", "ChatGPT"],
];

// Chat API
export const chatAPI = {
  // 获取文本模型列表
  getTextModels: async () => {
    try {
      const list = await apiRequest<string[][]>('/generate/text/list');
      if (Array.isArray(list) && list.length > 0) return list;
      return DEFAULT_TEXT_MODELS;
    } catch (e) {
      return DEFAULT_TEXT_MODELS;
    }
  },

  // 发送消息 - 使用真实的文本生成API
  sendMessage: async (message: string, conversationId?: string, modelOverride?: string) => {
    // 获取可用的文本模型
    const models = await chatAPI.getTextModels();
    const defaultModel = modelOverride || models[0]?.[0] || 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B';
    
    const result = await apiRequest<{
      message: string;
      role: string;
    }>('/generate/text/siliconflow', {
      method: 'POST',
      body: JSON.stringify({
        model: defaultModel,
        prompt: message,
        new_session: !conversationId
      }),
    });

    // 转换为期望的格式
    return {
      response: result.message,
      conversationId: conversationId || crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  },

  // 获取对话历史 (本地存储实现)
  getConversation: async (conversationId: string) => {
    const stored = localStorage.getItem(`conversation_${conversationId}`);
    return {
      messages: stored ? JSON.parse(stored) : []
    };
  },

  // 创建新对话
  createConversation: async () => {
    return { conversationId: crypto.randomUUID() };
  },
};

// Image API
export const imageAPI = {
  // 获取可用模型列表
  getModels: async () => {
    return apiRequest<{ models: string[][] }>('/generate/image/list');
  },

  // 文本生成图像 - 使用真实的SiliconFlow API
  generateFromText: async (prompt: string, style: string, size: string) => {
    // 获取可用的图像模型
    const { models } = await imageAPI.getModels();
    const defaultModel = models[0]?.[0] || 'Kwai-Kolors/Kolors';
    
    // 映射尺寸到API格式
    const sizeMap: { [key: string]: string } = {
      'small': '512x512',
      'medium': '1024x1024', 
      'large': '1024x1536'
    };

    const result = await apiRequest<{
      images: Array<{ url: string }>;
    }>('/generate/image/siliconflow', {
      method: 'POST',
      body: JSON.stringify({
        model: defaultModel,
        prompt: prompt,
        negative_prompt: '',
        image_size: sizeMap[size] || '1024x1024',
        batch_size: 1,
        num_inference_steps: 20,
        guidance_scale: 7.5
      }),
    });

    const taskId = crypto.randomUUID();
    
    return {
      imageUrl: result.images[0]?.url || '',
      taskId: taskId,
      status: 'completed' as const
    };
  },

  // 图像转图像 - 使用base64编码
  generateFromImage: async (imageFile: File, prompt: string, style: string) => {
    // 将文件转换为base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });

    // 获取可用的图像模型
    const { models } = await imageAPI.getModels();
    const defaultModel = models[0]?.[0] || 'Kwai-Kolors/Kolors';

    const result = await apiRequest<{
      images: Array<{ url: string }>;
    }>('/generate/image/siliconflow', {
      method: 'POST',
      body: JSON.stringify({
        model: defaultModel,
        prompt: prompt,
        negative_prompt: '',
        image_size: '1024x1024',
        batch_size: 1,
        num_inference_steps: 20,
        guidance_scale: 7.5,
        image_base64: base64
      }),
    });

    const taskId = crypto.randomUUID();
    
    return {
      imageUrl: result.images[0]?.url || '',
      taskId: taskId,
      status: 'completed' as const
    };
  },

  // 获取生成任务状态 (即时完成，不需要轮询)
  getTaskStatus: async (taskId: string) => {
    return {
      status: 'completed' as const,
      imageUrl: '',
      progress: 100
    };
  },
};

// Video API - 目前使用模拟实现，待后端视频API上线
export const videoAPI = {
  // 文本生成视频 - 模拟实现
  generateFromText: async (prompt: string, style: string, duration: number, quality: string) => {
    const taskId = crypto.randomUUID();
    
    // 模拟异步处理
    setTimeout(() => {
      const event = new CustomEvent('videoTaskComplete', {
        detail: {
          taskId,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          status: 'completed'
        }
      });
      window.dispatchEvent(event);
    }, 8000);

    return {
      videoUrl: '',
      taskId: taskId,
      status: 'processing' as const
    };
  },

  // 脚本生成视频 - 模拟实现
  generateFromScript: async (scenes: Array<{
    description: string;
    camera: string;
    audio: string;
    duration: number;
  }>) => {
    const taskId = crypto.randomUUID();
    
    setTimeout(() => {
      const event = new CustomEvent('videoTaskComplete', {
        detail: {
          taskId,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          status: 'completed'
        }
      });
      window.dispatchEvent(event);
    }, 10000);

    return {
      videoUrl: '',
      taskId: taskId,
      status: 'processing' as const
    };
  },

  // 获取视频任务状态 - 模拟实现
  getTaskStatus: async (taskId: string) => {
    return {
      status: 'processing' as const,
      videoUrl: '',
      progress: Math.floor(Math.random() * 80 + 10),
      keyframes: []
    };
  },
};

// Voice API - 目前使用模拟实现，待后端语音API上线
export const voiceAPI = {
  // 文本转语音 - 模拟实现
  textToSpeech: async (text: string, voice: string, language: string, speed: number, pitch: number) => {
    const taskId = crypto.randomUUID();
    
    // 使用浏览器的语音合成API作为临时方案
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'zh-cn' ? 'zh-CN' : 'en-US';
      utterance.rate = speed;
      utterance.pitch = pitch;
      
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 500);
    }

    return {
      audioUrl: '', // 浏览器语音合成不返回URL
      taskId: taskId,
      status: 'completed' as const
    };
  },

  // 语音处理 - 模拟实现
  processAudio: async (audioFile: File, action: 'transcribe' | 'enhance' | 'convert') => {
    const taskId = crypto.randomUUID();
    
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let result = '';
    switch (action) {
      case 'transcribe':
        result = '这是转录的文本内容示例。';
        break;
      case 'enhance':
        result = URL.createObjectURL(audioFile); // 返回原文件作为示例
        break;
      case 'convert':
        result = URL.createObjectURL(audioFile); // 返回原文件作为示例
        break;
    }

    return {
      result: result,
      taskId: taskId,
      status: 'completed' as const
    };
  },

  // 获取语音任务状态 - 模拟实现
  getTaskStatus: async (taskId: string) => {
    return {
      status: 'completed' as const,
      result: '',
      progress: 100
    };
  },
};

// 认证API
export const authAPI = {
  // Google OAuth URL
  getGoogleAuthUrl: async () => {
    return apiRequest<{ url: string }>('/login/google_request');
  },

  // Google OAuth回调
  googleCallback: async (code: string, state: string) => {
    return apiRequest<{ token: { access_token: string; token_type: string } }>('/login/google_callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });
  },

  // GitHub OAuth URL
  getGitHubAuthUrl: async () => {
    return apiRequest<{ url: string }>('/login/github_request');
  },

  // GitHub OAuth回调
  githubCallback: async (code: string, state: string) => {
    return apiRequest<{ token: { access_token: string; token_type: string } }>('/login/github_callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });
  },

  // 发送短信验证码
  sendSmsCode: async (phone: string, data: string) => {
    return apiRequest<{ message: string }>('/login/aliyun_sms_sendcode', {
      method: 'POST',
      body: JSON.stringify({ phone, data }),
    });
  },

  // 手机验证码登录
  loginWithPhoneCode: async (phone: string, data: string) => {
    return apiRequest<{ message: string; token: string }>('/login/login_phone_code', {
      method: 'POST',
      body: JSON.stringify({ phone, data }),
    });
  },

  // 发送邮件验证码
  sendEmailCode: async (email: string, pin_code: string) => {
    return apiRequest<{}>('/login/email_code', {
      method: 'POST',
      body: JSON.stringify({ email, pin_code }),
    });
  },
};

// 通用工具API
export const utilsAPI = {
  // 上传文件 - 使用本地存储模拟
  uploadFile: async (file: File, type: 'image' | 'video' | 'audio') => {
    // 创建本地URL作为文件URL
    const fileUrl = URL.createObjectURL(file);
    const fileId = crypto.randomUUID();
    
    return {
      fileUrl,
      fileId
    };
  },

  // 健康检查
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate/text/list`);
      return {
        status: response.ok ? 'ok' : 'error',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString()
      };
    }
  },
};
