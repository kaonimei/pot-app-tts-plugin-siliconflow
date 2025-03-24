async function tts(text, _lang, options = {}) {
    const { config, utils } = options;
    const { http } = utils;
    const { fetch, Body } = http;

    let { 
        apiBaseUrl = "https://api.siliconflow.cn",
        apiKey,
        voice = "alex",
        speed = 1.0,
        gain = 0.0 
    } = config;

    apiBaseUrl = apiBaseUrl.replace(/\/$/, '');
    if (!apiBaseUrl.startsWith('http')) {
        apiBaseUrl = `https://${apiBaseUrl}`;
    }
    const endpointPath = '/v1/audio/speech';
    if (!apiBaseUrl.endsWith(endpointPath)) {
        apiBaseUrl += endpointPath;
    }
    if (!apiKey) {
        throw "[SiliconFlow] API key is required";
    }

    const MODEL_NAME = 'FunAudioLLM/CosyVoice2-0.5B';
    try {
        const res = await fetch(apiBaseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: Body.json({
                model: MODEL_NAME,
                input: text,
                voice: `${MODEL_NAME}:${voice}`,
                speed: Number(speed),
                gain: Number(gain),
                response_format: "mp3"
            }),
            responseType: 3
        });

        if (!res.ok) {
            throw new Error(`API Request Failed [${res.status}]: ${JSON.stringify(res.data)}`);
        }

        return res.data;
        
    } catch (error) {
        const debugInfo = {
            apiEndpoint: apiBaseUrl,
            voiceModel: MODEL_NAME,
            parameters: { voice, speed, gain }
        };
        console.error("[SiliconFlow TTS Error]", error, debugInfo);
        throw `[SiliconFlow] TTS Failed: ${error.message}\nDebug Info: ${JSON.stringify(debugInfo, null, 2)}`;
    }
}