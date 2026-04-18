module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const prismaClientSingleton = ()=>{
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
};
const prisma = globalThis.prisma ?? prismaClientSingleton();
const __TURBOPACK__default__export__ = prisma;
if ("TURBOPACK compile-time truthy", 1) globalThis.prisma = prisma;
}),
"[project]/app/api/chatbot/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
const ZRA_KEYWORDS = [
    'tax',
    'zra',
    'zambia revenue authority',
    'vat',
    'paye',
    'income tax',
    'corporate tax',
    'customs',
    'excise',
    'duty',
    'filing',
    'return',
    'registration',
    'tpin',
    'withholding',
    'penalty',
    'compliance',
    'revenue',
    'taxation',
    'levy',
    'assessment',
    'audit',
    'refund',
    'business',
    'company',
    'individual',
    'taxpayer',
    'declaration',
    'payment',
    'deadline',
    'form',
    'certificate',
    'license',
    'zambia',
    'tpin',
    'itr',
    'tin',
    'turnover tax',
    'presumptive tax',
    'withholding tax',
    'pay as you earn',
    'value added tax',
    'paye',
    'pay as you earn',
    'employment tax',
    'salary tax',
    'corporate income tax',
    'cit',
    'business tax',
    'trade license',
    'import duty',
    'export duty',
    'customs clearance',
    'tax clearance',
    'compliance certificate',
    'tax certificate',
    'vat registration',
    'tpin application',
    'tax audit',
    'tax investigation',
    'tax dispute',
    'appeal',
    'objection',
    'tax refund',
    'restitution',
    'tax credit',
    'deduction',
    'tax return',
    'itr',
    'income tax return',
    'annual return',
    'monthly return',
    'quarterly return',
    'vat return',
    'paye return',
    'withholding tax return',
    'fringe benefits',
    'benefit in kind',
    'perquisite',
    'allowance',
    'bonus',
    'commission',
    'overtime',
    'severance',
    'gratuity',
    'capital gains',
    'property tax',
    'rental income',
    'investment income',
    'dividend',
    'interest',
    'royalty',
    'licensing',
    'permit',
    'authorization',
    'exemption',
    'relief',
    'rebate',
    'discount',
    'adjustment',
    'amendment'
];
function isZraRelated(message) {
    const lowerMessage = message.toLowerCase();
    return ZRA_KEYWORDS.some((keyword)=>lowerMessage.includes(keyword));
}
function isGreeting(message) {
    if (!message) return false;
    const messageLower = message.toLowerCase().trim();
    const greetings = [
        'hi',
        'hello',
        'hey',
        'greetings',
        'good morning',
        'good afternoon',
        'good evening'
    ];
    const firstWord = messageLower.split(/\s+/)[0];
    if (greetings.includes(firstWord) || greetings.some((g)=>messageLower.startsWith(g + ' ') || messageLower === g)) {
        if (isZraRelated(message)) return false;
        return true;
    }
    const simplePatterns = [
        /^(how are you|what's up|whats up|sup)$/,
        /^(help|assist|support)$/,
        /^can you help$/,
        /^(start|begin|getting started)$/
    ];
    for (const pattern of simplePatterns){
        if (pattern.test(messageLower)) {
            if (isZraRelated(message)) return false;
            return true;
        }
    }
    return false;
}
function getGreetingResponse() {
    return `Hello! 👋 I'm ZAX, your friendly AI assistant for the Zambia Revenue Authority (ZRA).

I'm here to help you with all your ZRA and tax-related questions, including:

📋 **Tax Services:**
• Tax registration and TPIN applications
• Income Tax, VAT, PAYE, and Corporate Tax
• Tax filing procedures and deadlines
• Tax compliance and penalty information

🏢 **Business Services:**
• Business registration tax requirements
• Customs and Excise duties
• Withholding tax procedures
• Tax certificates and clearances

💡 **General Support:**
• ZRA office locations and contacts
• Required documents and forms
• Payment methods and procedures
• Appeals and dispute resolution

How can I assist you with your tax matters today? Feel free to ask me anything related to ZRA services! 😊`;
}
function getFlexibleContextPrompt(userMessage, isGreetingMsg) {
    if (isGreetingMsg) {
        return `User is greeting you. Respond with the friendly ZRA introduction message. User said: ${userMessage}`;
    }
    const baseContext = `You are ZAX, a helpful and knowledgeable AI assistant for the Zambia Revenue Authority (ZRA). 
You are friendly, professional, and always ready to help with ZRA and Zambian tax-related matters.

Your expertise includes:
- All types of taxes (Income, VAT, PAYE, Corporate, Withholding)
- Tax registration and TPIN applications
- Business registration tax requirements
- Customs and Excise duties
- Tax filing procedures and deadlines
- Tax compliance and penalties
- ZRA services and office information
- Payment procedures and methods
- Appeals and dispute resolution

Guidelines for responses:
1. Be warm, helpful, and professional
2. Provide clear, step-by-step guidance when needed
3. Include relevant deadlines, requirements, and contact information
4. If you're unsure about specific details, recommend contacting ZRA directly
5. Use emojis occasionally to make responses friendly
6. For complex queries, break down information into easy-to-understand sections

FLEXIBILITY RULES:
- If someone asks about general business matters that relate to taxes, help them
- If someone asks about government services that connect to ZRA, provide guidance
- If someone needs help understanding tax implications of life events (marriage, death, etc.), assist them
- Only redirect to ZRA-only topics if the question is completely unrelated (like sports, entertainment, etc.)

For completely unrelated topics, politely say: "I specialize in ZRA and tax-related matters. While I'd love to chat about other topics, I'm here to help you with tax questions, filing procedures, and ZRA services. Is there anything tax-related I can assist you with?"
`;
    return `${baseContext}\nUser Question: ${userMessage}\n\nProvide a helpful, friendly ZAX response:`;
}
async function POST(req) {
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
        apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
    });
    try {
        const { message, session_id = 'anonymous' } = await req.json();
        if (!message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Message content is required'
            }, {
                status: 400
            });
        }
        // Check for uploaded files context FIRST
        const filesWithContent = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].uploadedFile.findMany({
            where: {
                OR: [
                    {
                        chatMessage: {
                            sessionId: session_id
                        }
                    },
                    {
                        realTimeChatMessage: {
                            chatSession: {
                                sessionId: session_id
                            }
                        }
                    }
                ],
                processed: true,
                AND: [
                    {
                        processedContent: {
                            not: null
                        }
                    },
                    {
                        processedContent: {
                            not: ""
                        }
                    }
                ]
            },
            orderBy: {
                uploadTime: 'desc'
            },
            take: 5
        });
        const hasFiles = filesWithContent.length > 0;
        const isGreetingOnly = isGreeting(message) && message.split(/\s+/).length < 5 && !message.toLowerCase().includes('file') && !message.toLowerCase().includes('document');
        if (isGreetingOnly && !hasFiles) {
            const recentMessages = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chatMessage.findMany({
                where: {
                    sessionId: session_id
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: 1
            });
            const isFirstMessage = recentMessages.length === 0;
            const aiResponse = isFirstMessage ? getGreetingResponse() : "Hello again! How can I assist you with your ZRA matters today? 😊";
            const chatMessage = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chatMessage.create({
                data: {
                    sessionId: session_id,
                    message,
                    response: aiResponse,
                    responseTime: 0.1
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message,
                response: aiResponse,
                session_id,
                timestamp: chatMessage.timestamp,
                response_time: 0.1
            });
        }
        // Fetch recent history for context
        const recentHistory = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chatMessage.findMany({
            where: {
                sessionId: session_id
            },
            orderBy: {
                timestamp: 'desc'
            },
            take: 5
        });
        const historyPrompt = recentHistory.reverse().map((msg)=>`User: ${msg.message}\nAssistant: ${msg.response}`).join('\n');
        let fileContext = "";
        if (filesWithContent.length > 0) {
            fileContext = "\n\n--- CONTEXT FROM UPLOADED DOCUMENTS ---\n" + filesWithContent.map((f)=>`FILE: ${f.originalFilename}\nTYPE: ${f.fileType}\nCONTENT:\n${f.processedContent}`).join('\n\n--- NEXT FILE ---\n\n');
            fileContext += "\n--- END OF UPLOADED DOCUMENTS ---\n";
        }
        const start = Date.now();
        const isGreetingMsg = isGreeting(message);
        const contextPrompt = getFlexibleContextPrompt(message, isGreetingMsg);
        const fullUserPrompt = `
CONVERSATION HISTORY:
${historyPrompt}

${fileContext}

CURRENT USER QUESTION: ${message}

INSTRUCTIONS: 
1. If there is context from UPLOADED DOCUMENTS above, use it to answer the question if it is relevant to ZRA, physical office locations, or taxation.
2. If the user's question is about ZRA office locations, contact details, TPIN, VAT, or any Zambian tax matter, answer it professionally.
3. If the user's question or the uploaded document is completely unrelated to ZRA, its offices, taxes, or business compliance in Zambia, politely decline to answer.
4. Always maintain a highly professional and formal tone.
`;
        const systemPrompt = `You are ZAX, the official AI assistant for the Zambia Revenue Authority (ZRA).
Your expertise is strictly limited to ZRA services, ZRA office locations and contacts, Zambian taxation, customs, excise, and business compliance.

Rules for your responses:
- Professionalism: Use formal, professional language at all times.
- Scope: Only respond to queries related to ZRA (including office locations, hours, and contacts), TPINs, VAT, Income Tax, Customs, Duties, and other tax-related matters in Zambia.
- Documents: If a user uploads a document, analyze it ONLY for tax-relevant information or ZRA-related compliance. If a document is unrelated to ZRA/tax, state that you cannot process it.
- Refusals: For any non-ZRA related query (e.g., general chat, sports, entertainment, unrelated legal matters), politely say: "I apologize, but my assistance is limited to Zambia Revenue Authority (ZRA) and tax-related matters. I cannot provide information on this topic."
- Identification: Always refer to ZRA as "our organization" or "the Authority" when appropriate. Do not use "their".`;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: fullUserPrompt
                }
            ],
            max_tokens: 400,
            temperature: 0.2
        });
        const aiResponse = response.choices[0].message.content?.trim() || "I'm sorry, I couldn't generate a response.";
        const responseTime = (Date.now() - start) / 1000;
        const chatMessage = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chatMessage.create({
            data: {
                sessionId: session_id,
                message,
                response: aiResponse,
                responseTime
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message,
            response: aiResponse,
            session_id,
            timestamp: chatMessage.timestamp,
            response_time: responseTime,
            follow_up_suggestions: [] // Logic to generate suggestions could be ported too
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ks._7f._.js.map