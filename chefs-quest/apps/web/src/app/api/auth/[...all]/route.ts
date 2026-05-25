import { NextResponse } from "next/server";

function notImplemented() {
	return NextResponse.json(
		{ error: "Authentication endpoint is not configured yet." },
		{ status: 501 },
	);
}

export async function GET() {
	return notImplemented();
}

export async function POST() {
	return notImplemented();
}
