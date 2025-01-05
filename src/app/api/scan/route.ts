import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();
  const timestamp = Date.now();

  const response = await axios.post(
    `https://twjwgs8v3s.apigw.ntruss.com/custom/v1/36009/970b3951c1308c7b56de4e1698bea7174f7438473c1d22546a5352adba6b46e1/general`,
    {
      params: {
        images: [
          {
            format: "png",
            name: "medium",
            data: null,
            url: url,
          },
        ],
        lang: "ko",
        requestId: "string",
        resultType: "string",
        timestamp: timestamp,
        version: "V1",
      },
      headers: {
        "Content-Type": "application/json",
        "X-OCR-SECRET": "eGR5UktVQXBkTkFqamJBZlN3RXpscktRbHVlUnZhT04=",
      },
    }
  );

  const cleanData = JSON.parse(JSON.stringify(response.data));
  return NextResponse.json({
    cleanData,
  });
}
