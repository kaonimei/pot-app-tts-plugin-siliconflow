async function tts(text, _lang, options = {}) {
    const { config, utils } = options;
    const { http } = utils;
    const { fetch, Body } = http;

    let { 
        apiBaseUrl,
        apiKey,
        voice,
        speed,
        gain
    } = config;

    if (!apiBaseUrl) {
        apiBaseUrl = "https://api.siliconflow.cn";
    }
    if (!/https?:\/\/.+/.test(apiBaseUrl)) {
        apiBaseUrl = `https://${apiBaseUrl}`;
    }
    if (apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
    }
    if (!apiBaseUrl.endsWith('/audio/speech')) {
        apiBaseUrl += '/v1/audio/speech';
    }
    if (!apiKey) {
        throw "[SiliconFlow] API key is required";
    }
    if (!voice) {
        voice = "alex";
    }
    if (!speed) {
        speed = 1.0;
    }
    if (!gain) {
        gain = 0.0;
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