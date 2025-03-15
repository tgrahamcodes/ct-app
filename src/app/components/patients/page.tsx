'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

export default function Patients() {

  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatientData() {

      try {
        console.log('Fetching patient data...');

        const response = await fetch('/api/patients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Response status:', response.status);

        // Get the response text
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        // Check if response is not OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
        }

        // Parse the response
        let data;

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parsing Error:', parseError);
          setRawResponse(responseText);
          throw new Error(`Failed to parse response: ${responseText}`);
        }
        console.log('Parsed data:', data);
        setPatientData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Detailed fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    }
    fetchPatientData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (error) {

    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        {rawResponse && (
          <div>
            <h2>Raw Response:</h2>
            <pre>{rawResponse}</pre>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className={styles.pageContainer}>
      <div className={styles.columnContainer}>
        {/* Left Column - Patient List */}
        <div className={styles.sectionContainer}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={styles.sectionTitle}>Patient</h2>
            <Image 
              src="/search.svg" 
              alt="Search" 
              width={20} 
              height={20} 
              className="cursor-pointer"
            />
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((patient) => (
              <div 
                key={patient} 
                className={`${styles.patientListItem} ${
                  patient === 1 ? styles.activePatient : ''
                } flex justify-between items-center`}
              >
                <span>Patient {patient}</span>
                <span className="text-sm text-gray-500">ID: {1000 + patient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Patient Details */}
        <div className={styles.sectionContainer}>
          {/* Graph Section */}
          <div className={styles.graphSection}>
            <h2 className={styles.sectionTitle}>Patient Metrics</h2>
            <div className={styles.graphContainer}>
              <div className={styles.lineGraph}>
                <div className={styles.graphGrid}>
                  {[100, 200, 300].map((gridLine) => (
                    <div key={gridLine} className={styles.gridLine} style={{bottom: `${gridLine/3}%`}}>
                      <span>{gridLine}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.lineContainer}>
                  {[
                    { month: 'Jan', value: 120 },
                    { month: 'Feb', value: 180 },
                    { month: 'Mar', value: 220 },
                    { month: 'Apr', value: 190 },
                    { month: 'May', value: 250 },
                    { month: 'Jun', value: 300 }
                  ].map((data, index, array) => (
                    <div 
                      key={index} 
                      className={styles.linePoint}
                      style={{
                        bottom: `${data.value/3}%`,
                        left: `${(index / (array.length - 1)) * 100}%`
                      }}
                    >
                      <div className={styles.pointDot}></div>
                      <span className={styles.pointLabel}>{data.month}</span>
                    </div>
                  ))}
                  <svg className={styles.linePath}>
                    <path 
                      d={`M 0 ${300/3}% ${[
                        { month: 'Jan', value: 120 },
                        { month: 'Feb', value: 180 },
                        { month: 'Mar', value: 220 },
                        { month: 'Apr', value: 190 },
                        { month: 'May', value: 250 },
                        { month: 'Jun', value: 300 }
                      ].map((data, index, array) => 
                        `L ${(index / (array.length - 1)) * 100}% ${data.value/3}%`
                      ).join(' ')}`}
                      fill="none"
                      stroke="#01F0D0"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Squares Section */}
          <div className={styles.squaresContainer}>
            <div className={`${styles.square} ${styles.blueSquare}`}>
              <div className={styles.squareIconContainer}>
                <Image 
                  src="/lungs.svg" 
                  alt="Lungs Icon" 
                  width={96} 
                  height={96} 
                  className={styles.squareIcon}
                />
              </div>
              <h3 className={styles.squareTitle}>Total Patients</h3>
              <div className={styles.squareValue}>1,240</div>
              <p className={styles.squareSubtext}>+10% from last month</p>
            </div>
            <div className={`${styles.square} ${styles.pinkSquare}`}>
              <div className={styles.squareIconContainer}>
                <Image 
                  src="/temperature.svg" 
                  alt="Temperature Icon" 
                  width={96} 
                  height={96} 
                  className={styles.squareIcon}
                />
              </div>
              <h3 className={styles.squareTitle}>New Patients</h3>
              <div className={styles.squareValue}>240</div>
              <p className={styles.squareSubtext}>+5% from last week</p>
            </div>
            <div className={`${styles.square} ${styles.lightPinkSquare}`}>
              <div className={styles.squareIconContainer}>
                <Image 
                  src="/heart.svg" 
                  alt="Heart Icon" 
                  width={96} 
                  height={96} 
                  className={styles.squareIcon}
                />
              </div>
              <h3 className={styles.squareTitle}>Pending Appointments</h3>
              <div className={styles.squareValue}>54</div>
              <p className={styles.squareSubtext}>+2 from yesterday</p>
            </div>
          </div>

          {/* Diagnostic Information Section */}
          <div className={styles.diagnosticSection}>
            <h2 className={styles.sectionTitle}>Diagnostic Information</h2>
            <table className={styles.diagnosticTable}>
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Date</th>
                  <th>Result</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Blood Pressure</td>
                  <td>12/15/2023</td>
                  <td>120/80 mmHg</td>
                  <td><span className={styles.statusNormal}>Normal</span></td>
                </tr>
                <tr>
                  <td>Cholesterol</td>
                  <td>11/20/2023</td>
                  <td>190 mg/dL</td>
                  <td><span className={styles.statusWarning}>Borderline</span></td>
                </tr>
                <tr>
                  <td>Blood Sugar</td>
                  <td>10/10/2023</td>
                  <td>105 mg/dL</td>
                  <td><span className={styles.statusNormal}>Normal</span></td>
                </tr>
                <tr>
                  <td>Vitamin D</td>
                  <td>09/05/2023</td>
                  <td>25 ng/mL</td>
                  <td><span className={styles.statusWarning}>Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Patient Overview */}
        <div className={styles.rightColumn}>
          {/* Portrait Image */}
          <div className={styles.portraitContainer}>
            <Image 
              src="/portrait.png" 
              alt="Patient Portrait" 
              width={120} 
              height={120} 
              className={styles.portraitImage}
            />
          </div>

          <h2 className={styles.sectionTitle}>Patient Overview</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-[16px]">
              <h3 className="font-medium mb-2">Recent Visits</h3>
              <ul className="space-y-1">
                {[1, 2, 3].map((visit) => (
                  <li 
                    key={visit} 
                    className="text-sm text-gray-600 flex justify-between"
                  >
                    <span>Visit {visit}</span>
                    <span>01/01/2023</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-100 p-2 rounded-[16px] text-center">
                  <div className="text-xl font-bold text-blue-600">5</div>
                  <div className="text-xs text-blue-500">Appointments</div>
                </div>
                <div className="bg-green-100 p-2 rounded-[16px] text-center">
                  <div className="text-xl font-bold text-green-600">3</div>
                  <div className="text-xs text-green-500">Prescriptions</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Show All Information Button */}
          <div className="mt-4 flex justify-center">
            <button 
              className={`${styles.showAllButton}`}
            >
              Show All Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}