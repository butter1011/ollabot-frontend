import { NextApiRequest } from 'next';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import FormData from 'form-data'; // Import FormData
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

let bot;

export async function POST(request: Request) {
    const apiKey = process.env.SERVER_API_KEY;
    const apiUrl = process.env.OLLABOT_SERVER;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    const { botToken, isStart, botId } = await request.json();
    const supabase = createRouteHandlerClient({ cookies })
    const { data: currentData, error: fetchError } = await supabase
        .from('chatbot')
        .select('botConfig')
        .eq('id', botId)
        .single()

    // console.log("current", )
    const description = currentData.botConfig.description
    console.log(botToken, ":::", isStart);

    // Check if botToken is provided
    if (!botToken) {
        return new Response(JSON.stringify({ message: 'tokenerror' }), { status: 400 });
    }

    // Initialize the bot if not already initialized
    if (!bot || bot.options.token !== botToken) {
        // bot = new TelegramBot(botToken, { polling: true });
        const webhookUrl = `${baseUrl}/api/chatbot/${botId}/telegram/${botToken}`;
        console.log(webhookUrl);
        try {
            await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Webhook set successfully');
        } catch (error) {
            console.error('Error setting webhook:', error);
        }

        // bot.on('message', async (msg) => {
        //     console.log("Here");
        //     const chatId = msg.chat.id;
        //     const userInput = msg.text;

        //     console.log(userInput);
        //     console.log(typeof (userInput));

        //     if (userInput === "/start") {
        //         bot.sendMessage(chatId, "Hello! I'm an AI Agent. How may I help you?");
        //     }
        //     else {
        //         const data = new FormData();
        //         data.append('bot_id', botId); // Ensure chatId is a string
        //         data.append('message', userInput);
        //         data.append('description', description);

        //         console.log("apiUrl", apiUrl, "userInput", userInput, "chatId", chatId);

        //         try {
        //             const response = await axios.post(`${apiUrl}/chat`, data, {
        //                 headers: {
        //                     Authorization: `Bearer ${apiKey}`,
        //                     ...data.getHeaders(), // Include FormData headers
        //                 },
        //             });

        //             console.log("response ::: ", response.data);

        //             // Check if the response contains the expected data
        //             if (response.data && response.data.content) {
        //                 bot.sendMessage(chatId, response.data.content);
        //             } else {
        //                 bot.sendMessage(chatId, 'Sorry, I did not understand that.');
        //             }
        //         } catch (error) {
        //             console.error('Error while sending message:', error);
        //             bot.sendMessage(chatId, 'An error occurred while processing your request.');
        //         }
        //     }

        // });
    }

    return new Response(JSON.stringify({ message: 'success' }), { status: 200 });
}
