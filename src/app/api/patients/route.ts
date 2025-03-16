import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Attempting to fetch patient data');
    
    const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('coalition:skills-test').toString('base64')
      },
      cache: 'no-store'
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return NextResponse.json(
        { error: 'Fetch failed', status: response.status, details: errorText }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Parsed data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Detailed error in patient data fetch:', error);
    
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