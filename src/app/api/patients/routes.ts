import { NextResponse } from 'next/server';

export async function GET() {
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
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get the raw response text
    const responseText = await response.text();
    
    // Log the raw response text
    console.log('Raw response text:', responseText);
    console.log('Raw response length:', responseText.length);
    console.log('First 100 characters:', responseText.slice(0, 100));

    // Check if response is empty or not JSON
    if (!responseText.trim()) {
      throw new Error('Empty response received');
    }

    // Attempt to parse the response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      
      // If parsing fails, return the raw text
      return NextResponse.json(
        { 
          error: 'Failed to parse JSON', 
          rawResponse: responseText 
        }, 
        { status: 500 }
      );
    }

    console.log('Parsed data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Detailed error in patient data fetch:', error);
    
    return NextResponse.json(
      { 
        error: 'Unable to fetch patient data', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}