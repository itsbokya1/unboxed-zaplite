import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, plan } = await req.json();
    // Your exact Kotak Bank / Google Pay linked UPI VPA
    const upiVpa = "iamvivekbhide-8@okaxis"; 
    const note = `ZapLite_${plan}_${Date.now().toString().slice(-4)}`;

    // Standardized UPI Deep Link Format
    const upiString = `upi://pay?pa=${upiVpa}&pn=Vivek%20Bhide&am=${amount}&cu=INR&tn=${note}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

    return NextResponse.json({
      success: true,
      qrUrl: qrCodeUrl,
      upiVpa,
      amount,
      txnId: note,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate QR Code" }, { status: 500 });
  }
}
