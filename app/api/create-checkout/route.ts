import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan } = body;

    return NextResponse.json({
      url: "https://checkout.stripe.com/pay/mock_session",
      plan,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
