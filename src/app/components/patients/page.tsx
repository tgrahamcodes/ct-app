'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

// Explicitly define the interface with optional diagnostics
interface PatientData {
  patient_id: string;
  name: string;
  gender: string;
  age: number;
  profile_picture: string;
  date_of_birth: string;
  phone_number: string;
  emergency_contact: string;
  insurance_type: string;
  diagnosis_history?: {
    month: string;
    year: number;
    blood_pressure: {
      systolic: {
        value: number;
        levels: string;
      },
      diastolic: {
        value: number;
        levels: string;
      }
    },
    heart_rate: {
      value: number;
      levels: string;
    },
    respiratory_rate: {
      value: number;
      levels: string;
    };
    temperature: {
      value: number;
      levels: string;
    };
  }[];
}

export default function PatientsPage() {
  const [patientData, setPatientData] = useState<PatientData[] | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllInfo, setShowAllInfo] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/patients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data: PatientData[] = await response.json();
        setPatientData(data);

        // Select first patient by default
        if (data && data.length > 0) {
          setSelectedPatient(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // Diagnostic Information Section with Null Check
  const renderDiagnosticTable = () => {
    // Check if selectedPatient exists and has diagnostics
    if (!selectedPatient || !selectedPatient.diagnosis_history || selectedPatient.diagnosis_history.length === 0) {
      return (
        <div className={styles.diagnosticSection}>
          <h2 className={styles.sectionTitle}>Diagnostic Information</h2>
          <p className="text-gray-500">No diagnostic information available</p>
        </div>
      );
    }

    return (
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
            {selectedPatient.diagnosis_history.map((diagnostic, index) => (
              <tr key={index}>
                <td>Blood Pressure</td>
                <td>{diagnostic.month} {diagnostic.year}</td>
                <td>
                  {diagnostic.blood_pressure.systolic.value}/
                  {diagnostic.blood_pressure.diastolic.value}
                </td>
                <td>
                  <span
                    className={`
                      ${styles.statusBadge}
                      ${diagnostic.blood_pressure.systolic.levels.toLowerCase() === 'normal' ? styles.statusNormal :
                        diagnostic.blood_pressure.systolic.levels.toLowerCase() === 'warning' ? styles.statusWarning :
                          styles.statusCritical}
                    `}
                  >
                    {diagnostic.blood_pressure.systolic.levels}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // No Patients State
  if (!patientData || patientData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No Patients Found</h2>
          <p className="text-gray-500">There are currently no patients in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.columnContainer}>
        {/* Left Column - Patient List */}
        <div className={styles.sectionContainer}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={styles.sectionTitle}>Patients</h2>
            <Image
              src="/search.svg"
              alt="Search"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </div>
          <div>
            {patientData.map((patient) => (
              <div
                key={patient.patient_id}
                className={`${styles.patientListItem} ${selectedPatient?.patient_id === patient.patient_id ? styles.activePatient : ''
                  }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className={styles.patientInfo}>
                  <span className={styles.patientName}>{patient.name}</span>
                  <span className={styles.patientSubtext}>
                    {patient.gender}, {patient.age}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  <Image
                    src="/horizontal.svg"
                    alt="Horizontal"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Patient Details */}
        <div className={styles.sectionContainer}>
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
              <h3 className={styles.squareTitle}>Respiratory Rate</h3>
              <div className={styles.squareValue}>
                {selectedPatient?.diagnosis_history?.[0]?.respiratory_rate?.value || 'N/A'}
              </div>
              <p className={styles.squareSubtext}>
                {selectedPatient?.diagnosis_history?.[0]?.respiratory_rate?.levels || 'breaths per minute'}
              </p>
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
              <h3 className={styles.squareTitle}>Temperature</h3>
              <div className={styles.squareValue}>
                {selectedPatient?.diagnosis_history?.[0]?.temperature?.value || 'N/A'}
              </div>
              <p className={styles.squareSubtext}>
                {selectedPatient?.diagnosis_history?.[0]?.temperature?.levels || '°C'}
              </p>
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
              <h3 className={styles.squareTitle}>Heart Rate</h3>
              <div className={styles.squareValue}>
                {selectedPatient?.diagnosis_history?.[0]?.heart_rate?.value || 'N/A'}
              </div>
              <p className={styles.squareSubtext}>
                {selectedPatient?.diagnosis_history?.[0]?.heart_rate?.levels || 'bpm'}
              </p>
            </div>
          </div>

          {/* Render Diagnostic Table with Null Check */}
          {renderDiagnosticTable()}
        </div>

        {/* Right Column - Patient Overview */}
        <div className={styles.rightColumn}>
          {/* Portrait Image with Fallback */}
          <div className={styles.portraitContainer}>
            <Image
              src={selectedPatient?.profile_picture || '/default-avatar.png'}
              alt="Patient Portrait"
              width={120}
              height={120}
              className={styles.portraitImage}
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = '/default-avatar.png';
              }}
            />
          </div>

          {/* Patient Details with Null Check */}
          {selectedPatient ? (
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-[16px]">
                <h3 className="font-medium mb-2">Patient Details</h3>
                <div className="space-y-2">
                  <div className={styles.patientListItem}>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                        <Image
                          src="/birth-icon.svg"
                          alt="Date of Birth"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className={styles.patientName}>Date of Birth</span>
                        <div className={styles.patientSubtext}>{selectedPatient.date_of_birth}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.patientListItem}>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                        <Image
                          src={selectedPatient.gender.toLowerCase() === 'male'
                              ? '/male-icon.svg'
                              : '/female-icon.svg'
                          }
                          alt="Gender"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className={styles.patientName}>Gender</span>
                        <div className={styles.patientSubtext}>{selectedPatient.gender}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.patientListItem}>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                        <Image
                          src="/phone-icon.svg"
                          alt="Contact Info"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className={styles.patientName}>Contact Info</span>
                        <div className={styles.patientSubtext}>{selectedPatient.phone_number}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.patientListItem}>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                        <Image
                          src="/phone-icon.svg"
                          alt="Emergency Contact"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className={styles.patientName}>Emergency Contact</span>
                        <div className={styles.patientSubtext}>{selectedPatient.emergency_contact}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.patientListItem}>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                        <Image
                          src="/insurance-icon.svg"
                          alt="Insurance Provider"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div>
                        <span className={styles.patientName}>Insurance Provider</span>
                        <div className={styles.patientSubtext}>{selectedPatient.insurance_type}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information - Shown only when showAllInfo is true */}
              {showAllInfo && (
                <div className="bg-gray-100 p-3 rounded-[16px] mt-4">
                  <h3 className="font-medium mb-2">Detailed Diagnosis History</h3>
                  {selectedPatient.diagnosis_history?.map((history, index) => (
                    <div
                      key={index}
                      className="mt-2 bg-white p-2 rounded shadow-sm"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {history.month} {history.year}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            name: 'Blood Pressure',
                            value: `${history.blood_pressure.systolic.value}/${history.blood_pressure.diastolic.value}`,
                            levels: history.blood_pressure.systolic.levels
                          },

                          {
                            name: 'Heart Rate',
                            value: `${history.heart_rate.value} bpm`,
                            levels: history.heart_rate.levels
                          },

                          {
                            name: 'Respiratory Rate',
                            value: `${history.respiratory_rate.value}`,
                            levels: history.respiratory_rate.levels
                          },
                          {
                            name: 'Temperature',
                            value: `${history.temperature.value}°C`,
                            levels: history.temperature.levels
                          }
                        ].map((item, idx) => (
                          <div key={idx} className={styles.patientListItem}>
                            <div className={styles.patientInfo}>
                              <span className={styles.patientName}>{item.name}</span>
                              <span className={styles.patientSubtext}>{item.value}</span>
                            </div>
                            <span className={styles.patientSubtext}>
                              {item.levels}
                            </span>
                          </div>
                        ))}
                        <br />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Show All Information Button */}
              <br />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAllInfo(!showAllInfo)}
                  className={`${styles.showAllButton} flex items-center justify-center`}>
                  {showAllInfo ? 'Hide Additional Information' : 'Show All Information'}
                </button>
              </div>
            </div>

          ) : (
            <div className="text-center text-gray-500">
              Select a patient to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}