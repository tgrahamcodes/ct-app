'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartData,
	Chart,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

// Define the interface used from the API call
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
	}[],
	diagnostic_list: {
		name: string;
		description: string;
		status: string;
	}[],
	lab_results: [];
}

export default function PatientsPage() {

	const [isClient, setIsClient] = useState(false);

	console.log(isClient)
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Setup variables
	const [patientData, setPatientData] = useState<PatientData[] | null>(null);
	const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showAllInfo, setShowAllInfo] = useState(false);

	// Create Graph
	const prepareBloodPressureData = (): ChartData<"line", number[], string> => {

		if (!selectedPatient?.diagnosis_history) {
			return {
				labels: [],
				datasets: []
			};
		}

		const sortedHistory = [...selectedPatient.diagnosis_history].sort((a, b) => {

			return b.year - a.year ||
				['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
					.indexOf(b.month) -
				['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
					.indexOf(a.month);
		});

		return {
			labels: sortedHistory.map(h => `${h.month} ${h.year}`),
			datasets: [
				{
					label: 'Systolic',
					data: sortedHistory.map(h => h.blood_pressure.systolic.value),
					borderColor: '#C26EB4',
					backgroundColor: 'rgba(194, 110, 180, 0.5)',
					tension: 0.1
				},
				{
					label: 'Diastolic',
					data: sortedHistory.map(h => h.blood_pressure.diastolic.value),
					borderColor: '#7E6CAB',
					backgroundColor: 'rgba(126, 108, 171, 0.5)',
					tension: 0.1
				}
			]
		};
	};

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

	const renderDiagnosticTable = () => {
		if (!selectedPatient || !selectedPatient.diagnosis_history || selectedPatient.diagnosis_history.length === 0) {
			return (
				<div className={styles.diagnosticSection}>
					<h2 className={styles.sectionTitle}>Diagnostic List</h2>
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
							<th>Problem/Diagnosis</th>
							<th>Description</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{selectedPatient.diagnostic_list.map((property, index) => (
							<tr key={index}>
								<td>{property.name}</td>
								<td>{property.description}</td>
								<td>{property.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

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
						{patientData.map((patient, index) => (
							<div
								key={`patient-${patient.patient_id}-${index}`} // Unique key
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
				<div className={styles.sectionContainer}>
					<h2 className={styles.sectionTitle}>Diagnostic History</h2>
					{selectedPatient && (
						<div
							className={`${styles.sectionContainer} w-full`}
							style={{
								backgroundColor: '#F4F0FE',
								marginBottom: '1rem',
								height: 'auto',
								minHeight: '400px',
								overflow: 'visible'
							}}>
							<h2 className={styles.sectionTitle}>Blood Pressure</h2>
							<div className="flex">
								<div className="w-full">
									<Line
										data={prepareBloodPressureData()}
										options={{
											responsive: true,
											plugins: {
												legend: {
													position: 'right',
													labels: {
														usePointStyle: true,
														pointStyle: 'circle',
														font: {
															weight: 'bold'
														}
													}
												},
												title: {
													display: false,
												}
											},
											scales: {
												y: {
													min: 60,
													max: 180,
													ticks: {
														stepSize: 20
													}
												}
											}
										}}
										plugins={[
											{
												id: 'custom-legend',
												afterDraw: (chart: Chart) => {
													if (!selectedPatient?.diagnosis_history?.[0]) return;

													const legendContainer = document.createElement('div');
													legendContainer.style.display = 'flex';
													legendContainer.style.flexDirection = 'column';

													const systolicLabel = document.createElement('div');
													systolicLabel.style.display = 'flex';
													systolicLabel.style.alignItems = 'center';
													systolicLabel.style.marginBottom = '10px';

													const systolicPoint = document.createElement('div');
													systolicPoint.style.width = '10px';
													systolicPoint.style.height = '10px';
													systolicPoint.style.borderRadius = '50%';
													systolicPoint.style.backgroundColor = '#C26EB4';
													systolicPoint.style.marginRight = '10px';

													const systolicContent = document.createElement('div');
													systolicContent.innerHTML = `
              <span style="font-weight: bold;">Systolic</span><br>
              <span style="font-size: 1.5em; font-weight: bold;">
                ${selectedPatient.diagnosis_history[0].blood_pressure.systolic.value} mmHg
              </span><br>
              <span style="font-size: 0.8em; color: gray;">
                (${selectedPatient.diagnosis_history[0].blood_pressure.systolic.levels})
              </span>
            `;

													systolicLabel.appendChild(systolicPoint);
													systolicLabel.appendChild(systolicContent);

													const diastolicLabel = document.createElement('div');
													diastolicLabel.style.display = 'flex';
													diastolicLabel.style.alignItems = 'center';

													const diastolicPoint = document.createElement('div');
													diastolicPoint.style.width = '10px';
													diastolicPoint.style.height = '10px';
													diastolicPoint.style.borderRadius = '50%';
													diastolicPoint.style.backgroundColor = '#7E6CAB';
													diastolicPoint.style.marginRight = '10px';

													const diastolicContent = document.createElement('div');
													diastolicContent.innerHTML = `
              <span style="font-weight: bold;">Diastolic</span><br>
              <span style="font-size: 1.5em; font-weight: bold;">
                ${selectedPatient.diagnosis_history[0].blood_pressure.diastolic.value} mmHg
              </span><br>
              <span style="font-size: 0.8em; color: gray;">
                (${selectedPatient.diagnosis_history[0].blood_pressure.diastolic.levels})
              </span>
            `;

													diastolicLabel.appendChild(diastolicPoint);
													diastolicLabel.appendChild(diastolicContent);

													legendContainer.appendChild(systolicLabel);
													legendContainer.appendChild(diastolicLabel);

													const legendEl = document.getElementById(chart.canvas.id + '-legend');
													if (legendEl) {
														legendEl.innerHTML = '';
														legendEl.appendChild(legendContainer);
													}
												}
											}
										]}
									/>
								</div>
							</div>
						</div>
					)}

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
								{selectedPatient?.diagnosis_history?.[0]?.respiratory_rate?.value || 'N/A'} bpm
							</div>
							<p className={styles.squareSubtext}>
								{selectedPatient?.diagnosis_history?.[0]?.respiratory_rate?.levels}
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
								{selectedPatient?.diagnosis_history?.[0]?.temperature?.value || 'N/A'}°F
							</div>
							<p className={styles.squareSubtext}>
								{selectedPatient?.diagnosis_history?.[0]?.temperature?.levels}
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
								{selectedPatient?.diagnosis_history?.[0]?.heart_rate?.value || 'N/A'} bpm
							</div>
							<p className={styles.squareSubtext}>
								{selectedPatient?.diagnosis_history?.[0]?.heart_rate?.levels}
							</p>
						</div>
					</div>
					{renderDiagnosticTable()}
				</div>

				<div className={styles.rightColumn}>
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

							{showAllInfo && (
								<div className="bg-gray-100 p-3 rounded-[16px] mt-4">
									<h3 className="font-medium mb-2">Detailed Diagnosis History</h3>
									{selectedPatient.diagnosis_history?.map((history, historyIndex) => (
										<div
											key={`history-${historyIndex}-${history.month}-${history.year}`} // Unique key
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
												].map((item, itemIndex) => (
													<div
														key={`history-${historyIndex}-item-${itemIndex}`} // Unique key
														className={styles.patientListItem}
													>
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
							<div className="bg-gray-100 p-3 rounded-[16px] mt-4">
								<h3 className={styles.sectionTitle}>Lab Results</h3>
								<div>
									{(!selectedPatient?.lab_results || selectedPatient.lab_results.length === 0) && (
										<div className="text-center text-gray-500">
											No lab results available
										</div>
									)}

									{selectedPatient?.lab_results?.map((result, index) => (
										<div
											key={index}
											className={styles.patientListItem}
										>
											<div className={styles.patientInfo}>
												<span className={styles.patientName}>{result}</span>
												<span className={styles.patientSubtext}>Lab Test</span>
											</div>
											<div className="flex items-center space-x-2">
												<Image
													src="/download-icon.svg"
													alt="Download"
													width={20}
													height={20}
													className="cursor-pointer"
												/>
											</div>
										</div>
									))}
								</div>
							</div>

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