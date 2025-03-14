import styles from './page.module.css';

export default function Patients() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.columnContainer}>
        {/* Left Column - Patient List */}
        <div className={styles.sectionContainer}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={styles.sectionTitle}>Patients</h2>
            <button className="text-blue-500 hover:text-blue-600">
              + Add New
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((patient) => (
              <div 
                key={patient} 
                className={`${styles.patientListItem} ${
                  patient === 1 ? styles.activePatient : ''
                } flex justify-between items-center`}
              >
                <span>Patients {patient}</span>
                <span className="text-sm text-gray-500">ID: {1000 + patient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Patient Details */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Diagnosis History</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input 
                  type="text" 
                  className={styles.formInput}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input 
                  type="text" 
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                className={`${styles.actionButton} ${styles.secondaryButton}`}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`${styles.actionButton} ${styles.primaryButton}`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Patient Overview */}
        <div className={styles.rightColumn}>
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
        </div>
      </div>
    </div>
  );
}