import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { playerHand, dealerUpCard, playerTotal } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Call Gemini API with Flash-Lite (fastest model)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Blackjack: Player has ${playerTotal}, dealer shows ${dealerUpCard}. Answer only "HIT" or "STAND".`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 10,
            temperature: 0,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    const recommendation = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();

    // Validate response is either HIT or STAND
    if (recommendation !== 'HIT' && recommendation !== 'STAND') {
      return NextResponse.json({ recommendation: 'STAND' }); // Default fallback
    }

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('AI recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI recommendation' },
      { status: 500 }
    );
  }
}
