// pages/api/chatbot/[botId]/chat.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request, { params }) {
    const apiKey = process.env.SERVER_API_KEY
    const apiUrl = process.env.OLLABOT_SERVER
    const { botId } = params

    // const formData = new FormData()
    // const body = await request.formData()
    // console.log(body);
    console.log("botId", botId);

    const data = await request.json();
    console.log(data.message.chat.id);

    await fetch(`https://api.telegram.org/bot7265310096:AAFb6WmKeN9C1zPqy9hDfTNNCXT-cm77KXM/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
            chat_id: data.message.chat.id,
            text: "response",
            reply_to_message_id: data.message.message_id
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    return new Response(JSON.stringify({ "ss": "fds" }), { status: 200 });
    // formData.append('bot_id', botId)
    // formData.append('message', body.get('message'))
    // formData.append('description', body.get('description'))
    // formData.append('company_name', body.get('company_name'))

    // const file = body.get('file')
    // if (file) {
    //     formData.append('file', file)
    // }

    // try {
    //     const response = await axios.post(`${apiUrl}/chat`, formData, {
    //         headers: {
    //             Authorization: `Bearer ${apiKey}`,
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     })
    //     // const response = { data: { content: markdownContent } }

    //     return new Response(JSON.stringify(response.data), { status: 200 })
    // } catch (error) {
    //     console.error('Error sending message:', error)
    //     return new Response(JSON.stringify({ error: 'Error sending message' }), {
    //         status: 500,
    //     })
    // }
}
