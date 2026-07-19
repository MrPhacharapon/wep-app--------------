import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Use the provided Google Sheet ID
    const sheetId = "1warnAj4x4d7lZecJ3vApaGltSxx1Ji_wv2CkOhcF0nI";

    // Fetch the Settings sheet as CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Settings`;
    
    const response = await fetch(csvUrl, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "ไม่สามารถเข้าถึง Google Sheet ได้ โปรดตรวจสอบว่าตั้งค่าแชร์เป็น Public แล้ว" },
        { status: 400 }
      );
    }

    const csvText = await response.text();
    
    // If the response is HTML (e.g. login page), it means it's not public
    if (csvText.trim().toLowerCase().startsWith("<!doctype html>")) {
      return NextResponse.json(
        { success: false, error: "Google Sheet ของคุณยังไม่ได้ตั้งค่าแชร์เป็นแบบสาธารณะ (Anyone with the link)" },
        { status: 400 }
      );
    }

    let correctPassword = null;
    
    const lines = csvText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
      
      // Check if this row contains the label
      if (parts[0] === "รหัสผ่านแอดมิน") {
        if (parts.length >= 2 && parts[1] !== "") {
          // Password is in the next column (B1)
          correctPassword = parts[1];
        } else if (i + 1 < lines.length) {
          // Password might be in the next row (A2)
          const nextParts = lines[i+1].split(',').map(p => p.replace(/^"|"$/g, '').trim());
          if (nextParts[0] !== "") {
            correctPassword = nextParts[0];
          }
        }
        break;
      }
    }

    if (!correctPassword) {
      return NextResponse.json(
        { success: false, error: "รหัสเข้าสู่ระบบผู้ดูแลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
