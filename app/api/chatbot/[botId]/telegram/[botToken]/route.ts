// pages/api/chatbot/[botId]/chat.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request, { params }) {
    const apiKey = process.env.SERVER_API_KEY
    const apiUrl = process.env.OLLABOT_SERVER
    const { botId, botToken } = params
    const supabase = createRouteHandlerClient({ cookies })

    const { data: currentData, error: fetchError } = await supabase
        .from('chatbot')
        .select('botConfig')
        .eq('id', botId)
        .single()

    const description = currentData.botConfig.description;

    console.log(botId);
    const formData = new FormData()

    const data = await request.json();
    console.log(data);

    formData.append('bot_id', botId)
    formData.append('message', data.message.text)
    formData.append('description', description)

    if (data.message.text === "/start") {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: data.message.chat.id,
                text: "Hello! I'm an AI Agent. How may I help you?",
                // reply_to_message_id: data.message.message_id
            }),
            headers: { 'Content-Type': 'application/json' }
        });
    }
    else {
        try {
            const response = await axios.post(`${apiUrl}/chat`, formData, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
            })

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                body: JSON.stringify({
                    chat_id: data.message.chat.id,
                    text: response.data.content,
                    // reply_to_message_id: data.message.message_id
                }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error sending message:', error)
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                body: JSON.stringify({
                    chat_id: data.message.chat.id,
                    text: error,
                    // reply_to_message_id: data.message.message_id
                }),
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    return new Response(JSON.stringify({ "status": "good" }), { status: 200 });
}
