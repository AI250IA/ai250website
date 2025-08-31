Project notes: Chat dropdown models

- Goal: Replace hardcoded Chat tab dropdown with API-driven options. Fallback to a predefined list when API is unavailable.

- API:
  - Endpoint: `/generate/text/list`
  - Expected shape: `string[][]` where each item is `[modelId, label]`.

- Implementation:
  - `src/utils/api.tsx`
    - Added `chatAPI.getTextModels()` which returns API data or a safe fallback `DEFAULT_TEXT_MODELS`.
    - Extended `chatAPI.sendMessage(message, conversationId, modelOverride)` to accept selected model.
  - `src/utils/hooks.tsx`
    - `useChatMessage` forwards the optional model argument.
  - `src/components/ChatInterface.tsx`
    - Loads model list on mount, populates `<Select>` dynamically, and uses the selected model on send.

- Fallback list used when API fails or is empty:
  - ["deepseek-ai/DeepSeek-R1-0528-Qwen3-8B", "垂类研究"]
  - ["Tongyi-Zhiwen/QwenLong-L1-32B", "跨界融合"]
  - ["tencent/Hunyuan-A13B-Instruct", "结构输出"]
  - ["alibaba/Qwen2-72B-Instruct", "Gemini"]
  - ["alibaba/Qwen2-72B-Instruct", "ChatGPT"]

- Env:
  - Uses `VITE_API_BASE_URL` or defaults to production/dev URLs as defined in `api.tsx`.

No other functional changes.
