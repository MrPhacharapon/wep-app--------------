import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.events || body.events.length === 0) {
      return NextResponse.json({ status: 'ok' });
    }

    const event = body.events[0];
    
    if (event.source && event.source.type === 'group') {
      const groupId = event.source.groupId;
      const replyToken = event.replyToken;
      const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

      if (replyToken && channelAccessToken && (event.type === 'join' || event.type === 'message')) {
        let shouldReply = false;
        
        if (event.type === 'join') {
          shouldReply = true;
        } else if (event.type === 'message' && event.message.type === 'text') {
          if (event.message.text.includes('เช็คไอดีกลุ่ม')) {
            shouldReply = true;
          }
        }

        if (shouldReply) {
          const replyText = `สวัสดีครับ! บอทสลิปเงินเดือนพร้อมใช้งานแล้ว\n\nรหัสกลุ่ม (Group ID) ของคุณคือ:\n${groupId}\n\nกรุณาคัดลอกรหัสนี้ไปใส่ใน Vercel Environment Variables ในชื่อ LINE_GROUP_ID ครับ`;
          
          await fetch('https://api.line.me/v2/bot/message/reply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${channelAccessToken}`
            },
            body: JSON.stringify({
              replyToken: replyToken,
              messages: [{ type: 'text', text: replyText }]
            })
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
