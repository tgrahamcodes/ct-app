import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    ('Attempting to fetch patient data', request);
    
    const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('coalition:skills-test').toString('base64')
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();      
      return NextResponse.json(
        { error: 'Fetch failed', status: response.status, details: errorText }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {    
    return NextResponse.json(
      { 
        error: 'Unable to fetch patient data', 
        details: error instanceof Error 
          ? {
              message: error.message,
              name: error.name,
              stack: error.stack
            }
          : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';