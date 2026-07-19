import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import * as Papa from "papaparse";
// import { adminDb, adminStorage } from "@/lib/firebase-admin"; 

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const sheetUrl = formData.get("sheetUrl") as string;
    const month = formData.get("month") as string;
    const year = formData.get("year") as string;

    if (!file || !sheetUrl) {
      return NextResponse.json({ error: "Missing file or sheet URL" }, { status: 400 });
    }

    // 1. Fetch Google Sheet Data (assuming it's a published CSV link for simplicity)
    // To get a CSV link: Google Sheet -> File -> Share -> Publish to Web -> CSV
    const sheetResponse = await fetch(sheetUrl);
    const csvText = await sheetResponse.text();
    
    // Parse CSV: Expecting columns like "PageNumber", "BankAccount"
    const parsedCsv = Papa.parse(csvText, { header: true }).data as any[];
    
    // Create a map of PageNumber -> BankAccount
    const pageToAccountMap: Record<number, string> = {};
    parsedCsv.forEach((row, index) => {
      // Assuming 1-indexed pages in the sheet, or just sequence
      const pageNum = parseInt(row.PageNumber) || (index + 1);
      if (row.BankAccount) {
        pageToAccountMap[pageNum] = row.BankAccount.trim().replace(/-/g, ""); // Remove dashes
      }
    });

    // 2. Read and Split PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    const uploadedSlips = [];

    // 3. Process each page
    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      const bankAccount = pageToAccountMap[pageNum];

      if (!bankAccount) continue;

      // Create a new PDF with just this page
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();

      // 4. Upload to Firebase Storage (Mocked out for now)
      /*
      const fileName = `slips/${year}/${month}/${bankAccount}.pdf`;
      const fileRef = adminStorage.bucket().file(fileName);
      await fileRef.save(Buffer.from(pdfBytes), { contentType: "application/pdf" });
      const downloadUrl = await fileRef.getSignedUrl({ action: 'read', expires: '03-09-2491' });
      */
      
      const downloadUrl = `https://mock-storage.com/${year}/${month}/${bankAccount}.pdf`;

      // 5. Save metadata to Firestore (Mocked out for now)
      /*
      await adminDb.collection("slips").add({
        bankAccount,
        month,
        year,
        url: downloadUrl[0],
        createdAt: new Date()
      });
      */

      uploadedSlips.push({ bankAccount, url: downloadUrl });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${uploadedSlips.length} pages`,
      slips: uploadedSlips 
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    // Sentry.captureException(error); // Error tracking
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
