
// Add event listener for adding new medication in appointment detail page
document.addEventListener('DOMContentLoaded', function() {
  const addMedicationButton = document.getElementById('add-medication');
  if (addMedicationButton) {
    addMedicationButton.addEventListener('click', function() {
      const medicationList = document.getElementById('medication-list');
      const newMedItem = document.createElement('div');
      newMedItem.className = 'medication-item';
      
      newMedItem.innerHTML = `
        <div class="medication-inputs">
          <input type="text" placeholder="Medication name" class="form-input med-name">
          <input type="text" placeholder="Dosage" class="form-input med-dose">
          <input type="text" placeholder="Frequency" class="form-input med-freq">
          <input type="text" placeholder="Duration" class="form-input med-duration">
        </div>
        <button class="action-btn remove-med"><i class="fas fa-trash"></i></button>
      `;
      
      medicationList.appendChild(newMedItem);
      
      // Add event listener to remove button
      const removeButton = newMedItem.querySelector('.remove-med');
      removeButton.addEventListener('click', function() {
        medicationList.removeChild(newMedItem);
      });
    });
  }
  
  // Add event listeners to existing remove buttons
  const removeMedButtons = document.querySelectorAll('.remove-med');
  removeMedButtons.forEach(button => {
    button.addEventListener('click', function() {
      const medItem = button.closest('.medication-item');
      const medicationList = document.getElementById('medication-list');
      medicationList.removeChild(medItem);
    });
  });
});


// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Initialize different pages based on current page
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('index.html') || currentPath === '/') {
    initializeDashboard();
  } else if (currentPath.includes('patients.html')) {
    initializePatientsPage();
  } else if (currentPath.includes('patient-detail.html')) {
    initializePatientDetailPage();
  } else if (currentPath.includes('settings.html')) {
    initializeSettingsPage();
  } else if (currentPath.includes('medicament.html')) {
    initializeMedicamentPage();
  }
});

// Settings Page Initialization
function initializeSettingsPage() {
  // Add event listeners to save buttons
  const saveButtons = document.querySelectorAll('.settings-form .btn');
  
  saveButtons.forEach(button => {
    button.addEventListener('click', function() {
      // In a real app, this would save data to a backend
      // For demo purposes, just show a success message
      alert('Settings saved successfully!');
    });
  });
}

// Dashboard Page Initialization
function initializeDashboard() {
  // Initialize calendar
  initializeCalendar();
  
  // Load mock patient data
  loadPatientStatusData();
}

// Patients Page Initialization
function initializePatientsPage() {
  // Load mock patients data
  loadPatientsListData();
  
  // Add event listeners for search and filters
  const searchInput = document.getElementById('patient-search');
  const statusFilter = document.getElementById('filter-status');
  const sortFilter = document.getElementById('filter-sort');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterPatients);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', filterPatients);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', sortPatients);
  }
  
  // Add event listener for patient details modal
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-patient-btn')) {
      const patientId = e.target.getAttribute('data-id');
      openPatientDetailsModal(patientId);
    }
    
    if (e.target.classList.contains('close')) {
      closePatientDetailsModal();
    }
  });
}

// Patient Detail Page Initialization
function initializePatientDetailPage() {
  // Get patient ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('id');
  
  if (patientId) {
    loadPatientDetails(patientId);
  }
}

// Calendar Functions
function initializeCalendar() {
  const calendarBody = document.getElementById('calendar-body');
  const currentMonthElement = document.getElementById('current-month');
  
  if (!calendarBody || !currentMonthElement) return;
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Set current month and year
  currentMonthElement.textContent = `${getMonthName(currentMonth)} ${currentYear}`;
  
  // Generate calendar days
  generateCalendarDays(currentYear, currentMonth, calendarBody);
  
  // Add event listeners for month navigation
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
    nextMonthBtn.addEventListener('click', () => navigateMonth(1));
  }
}

function generateCalendarDays(year, month, calendarBody) {
  // Clear existing calendar
  calendarBody.innerHTML = '';
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create day labels (Sun-Sat)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days.forEach(day => {
    const dayLabel = document.createElement('div');
    dayLabel.className = 'calendar-day day-label';
    dayLabel.textContent = day;
    calendarBody.appendChild(dayLabel);
  });
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarBody.appendChild(emptyDay);
  }
  
  // Generate actual days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = i;
    
    // Check if day is today
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      i === today.getDate()
    ) {
      dayElement.classList.add('today');
    }
    
    // Mock appointments (for demo)
    if ([5, 12, 18, 23, 25].includes(i)) {
      dayElement.classList.add('has-appointments');
    }
    
    dayElement.addEventListener('click', () => selectDate(year, month, i));
    calendarBody.appendChild(dayElement);
  }
}

function navigateMonth(direction) {
  const currentMonthElement = document.getElementById('current-month');
  const calendarBody = document.getElementById('calendar-body');
  
  if (!currentMonthElement || !calendarBody) return;
  
  // Get current month and year from title
  const [monthName, year] = currentMonthElement.textContent.split(' ');
  let month = getMonthNumber(monthName);
  let yearNumber = parseInt(year);
  
  // Calculate new month and year
  month += direction;
  if (month < 0) {
    month = 11;
    yearNumber--;
  } else if (month > 11) {
    month = 0;
    yearNumber++;
  }
  
  // Update title and regenerate calendar
  currentMonthElement.textContent = `${getMonthName(month)} ${yearNumber}`;
  generateCalendarDays(yearNumber, month, calendarBody);
}

function selectDate(year, month, day) {
  const selectedDate = new Date(year, month, day);
  const currentDateElement = document.getElementById('current-date');
  
  if (currentDateElement) {
    currentDateElement.textContent = `Selected: ${formatDate(selectedDate)}`;
    // You would typically load data for the selected date here
    loadPatientStatusData(selectedDate);
  }
}

// Mock Data Loaders
function loadPatientStatusData(date) {
  // Mock patient data - in real app, this would come from API
  const waitingPatients = [
    { id: 1, name: 'John Smith', age: 45, gender: 'Male', time: '09:30 AM', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Sarah Johnson', age: 38, gender: 'Female', time: '10:15 AM', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Michael Brown', age: 52, gender: 'Male', time: '11:00 AM', image: 'https://randomuser.me/api/portraits/men/45.jpg' }
  ];
  
  const examinationPatients = [
    { id: 4, name: 'Emily Davis', age: 29, gender: 'Female', time: 'Since 09:45 AM', image: 'https://randomuser.me/api/portraits/women/22.jpg' }
  ];
  
  const scheduledPatients = [
    { id: 5, name: 'Robert Wilson', age: 62, gender: 'Male', time: '01:30 PM', image: 'https://randomuser.me/api/portraits/men/78.jpg' },
    { id: 6, name: 'Lisa Martin', age: 41, gender: 'Female', time: '02:15 PM', image: 'https://randomuser.me/api/portraits/women/56.jpg' },
    { id: 7, name: 'David Taylor', age: 35, gender: 'Male', time: '03:45 PM', image: 'https://randomuser.me/api/portraits/men/60.jpg' },
    { id: 8, name: 'Jennifer Adams', age: 28, gender: 'Female', time: '04:30 PM', image: 'https://randomuser.me/api/portraits/women/33.jpg' }
  ];
  
  const completedPatients = [
    { id: 9, name: 'Thomas Wright', age: 55, gender: 'Male', time: '08:45 AM', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 10, name: 'Jessica Lee', age: 31, gender: 'Female', time: '09:20 AM', image: 'https://randomuser.me/api/portraits/women/28.jpg' }
  ];
  
  // Populate patient lists
  populatePatientList('waiting', waitingPatients);
  populatePatientList('examination', examinationPatients);
  populatePatientList('scheduled', scheduledPatients);
  populatePatientList('completed', completedPatients);
}

function populatePatientList(containerId, patients) {
  const container = document.querySelector(`#${containerId} .patient-list`);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (patients.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No patients';
    container.appendChild(emptyMessage);
    return;
  }
  
  patients.forEach(patient => {
    const patientCard = document.createElement('div');
    patientCard.className = 'patient-card';
    patientCard.dataset.id = patient.id;
    
    patientCard.innerHTML = `
      <img src="${patient.image}" alt="${patient.name}">
      <div class="patient-info">
        <h4>${patient.name}</h4>
        <p>${patient.age}, ${patient.gender}</p>
      </div>
      <div class="patient-time">${patient.time}</div>
    `;
    
    patientCard.addEventListener('click', () => {
      window.location.href = `patient-detail.html?id=${patient.id}`;
    });
    
    container.appendChild(patientCard);
  });
}

function loadPatientsListData() {
  // Mock patients data with next visit information
  const patients = [
    { id: 'P001', name: 'John Smith', lastVisit: '2023-06-01', nextVisit: '2023-09-15' },
    { id: 'P002', name: 'Sarah Johnson', lastVisit: '2023-05-15', nextVisit: '2023-08-22' },
    { id: 'P003', name: 'Michael Brown', lastVisit: '2023-06-10', nextVisit: '2023-07-25' },
    { id: 'P004', name: 'Emily Davis', lastVisit: '2023-06-12', nextVisit: '2023-08-01' },
    { id: 'P005', name: 'Robert Wilson', lastVisit: '2023-04-20', nextVisit: '2023-08-10' },
    { id: 'P006', name: 'Lisa Martin', lastVisit: '2023-05-30', nextVisit: '' },
    { id: 'P007', name: 'David Taylor', lastVisit: '2023-03-15', nextVisit: '2023-07-28' },
    { id: 'P008', name: 'Jennifer Adams', lastVisit: '2023-06-02', nextVisit: '2023-09-05' }
  ];
  
  const tableBody = document.getElementById('patients-list-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  patients.forEach(patient => {
    const row = document.createElement('tr');
    row.dataset.id = patient.id;
    
    const nextVisitValue = patient.nextVisit ? formatDateSimple(patient.nextVisit) : 'Not scheduled';
    const nextVisitClass = patient.nextVisit ? '' : 'text-muted';
    
    row.innerHTML = `
      <td>${patient.id}</td>
      <td>${patient.name}</td>
      <td>${formatDateSimple(patient.lastVisit)}</td>
      <td class="${nextVisitClass}">${nextVisitValue}</td>
      <td>
        <button class="action-btn view-patient-btn" data-id="${patient.id}"><i class="fas fa-eye"></i></button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

function loadPatientDetails(patientId) {
  // Mock patient data - in real app, this would come from API
  const patientDetails = {
    id: 'P001',
    name: 'John Smith',
    dob: '1978-01-15',
    age: 45,
    gender: 'Male',
    cin: 'AE123456',
    phone: '(555) 123-4567',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    allergies: 'Penicillin, Peanuts',
    chronicConditions: 'Hypertension, Diabetes',
    medications: 'Lisinopril 10mg, Metformin 500mg',
    visits: [
      { date: '2023-06-01', type: 'Regular Check-up', doctor: 'Dr. Sarah Johnson', diagnosis: 'Well-controlled hypertension', treatment: 'Continue current medications', notes: 'Blood pressure 130/85, follow up in 3 months', money: 150 },
      { date: '2023-03-15', type: 'Illness', doctor: 'Dr. Michael Chen', diagnosis: 'Upper respiratory infection', treatment: 'Antibiotics, rest', notes: 'Prescribed amoxicillin for 7 days', money: 225 },
      { date: '2022-12-10', type: 'Regular Check-up', doctor: 'Dr. Sarah Johnson', diagnosis: 'Diabetes follow-up', treatment: 'Adjusted medication dosage', notes: 'HbA1c 7.2, improved from last visit', money: 175 }
    ]
  };
  
  // Populate patient information
  document.getElementById('patient-name-header').textContent = patientDetails.name;
  document.getElementById('patient-full-name').textContent = patientDetails.name;
  document.getElementById('patient-name').textContent = patientDetails.name;
  document.getElementById('patient-dob').textContent = formatDateSimple(patientDetails.dob);
  document.getElementById('patient-age').textContent = patientDetails.age;
  document.getElementById('patient-gender').textContent = patientDetails.gender;
  document.getElementById('patient-cin').textContent = patientDetails.cin || 'AE123456';
  document.getElementById('patient-phone').textContent = patientDetails.phone;
  document.getElementById('patient-allergies').textContent = patientDetails.allergies;
  document.getElementById('patient-conditions').textContent = patientDetails.chronicConditions;
  document.getElementById('patient-medications').textContent = patientDetails.medications;
  
  // Add last diagnostic
  document.getElementById('patient-last-diagnostic').textContent = patientDetails.visits[0].diagnosis;
  
  // Populate visit history
  const visitHistoryBody = document.getElementById('visit-history-body');
  const appointmentDetailContent = document.getElementById('appointment-detail-content');
  
  if (visitHistoryBody) {
    visitHistoryBody.innerHTML = '';
    
    // Generate more random visit data
    const visitTypes = ['Regular Check-up', 'Illness', 'Specialist', 'Emergency', 'Follow-up', 'Surgery Consultation', 'Vaccination', 'Lab Results Review'];
    const doctors = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. David Wilson', 'Dr. Maria Garcia', 'Dr. James Taylor', 'Dr. Lisa Brown', 'Dr. Robert Lee'];
    const diagnoses = [
      'Well-controlled hypertension', 
      'Upper respiratory infection', 
      'Diabetes follow-up', 
      'Cardiovascular assessment', 
      'Acute bronchitis', 
      'Allergic rhinitis', 
      'Mild anxiety', 
      'Lower back pain', 
      'Gastroenteritis',
      'Seasonal allergies',
      'Vitamin D deficiency',
      'Osteoarthritis',
      'Migraine headache',
      'Annual wellness visit'
    ];
    const treatments = [
      'Continue current medications', 
      'Antibiotics, rest', 
      'Adjusted medication dosage', 
      'No changes to current treatment', 
      'NSAIDs for pain management',
      'Prescribed antihistamines',
      'Physical therapy referral',
      'Dietary modifications',
      'Hydration and rest',
      'Stress management techniques',
      'Prescribed muscle relaxants',
      'Updated vaccination schedule',
      'Referred to specialist'
    ];
    
    // Create a dynamic array of visits with random dates over the past 3 years
    const randomVisits = [];
    const today = new Date();
    
    // First add the most recent visit to keep the last diagnostic consistent
    randomVisits.push({ 
      date: '2023-06-01', 
      type: 'Regular Check-up', 
      doctor: 'Dr. Sarah Johnson', 
      diagnosis: 'Well-controlled hypertension', 
      treatment: 'Continue current medications', 
      notes: 'Blood pressure 130/85, follow up in 3 months', 
      money: 150 
    });
    
    // Generate 15 random visits
    for (let i = 1; i < 15; i++) {
      // Generate a random date within the last 3 years
      const randomDate = new Date(today);
      randomDate.setDate(today.getDate() - Math.floor(Math.random() * 1095)); // 1095 days = 3 years
      
      // Format the date to YYYY-MM-DD
      const dateString = randomDate.toISOString().split('T')[0];
      
      // Get random elements from arrays
      const randomType = visitTypes[Math.floor(Math.random() * visitTypes.length)];
      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
      const randomDiagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
      
      // Generate random cost between $50 and $500
      const randomCost = Math.floor(Math.random() * 450) + 50;
      
      // Create random notes
      const vitalSigns = [`Blood pressure ${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 70}`, 
                         `Heart rate ${Math.floor(Math.random() * 40) + 60} bpm`, 
                         `Temperature ${(Math.random() * 1.5 + 97).toFixed(1)}°F`];
      const randomVital = vitalSigns[Math.floor(Math.random() * vitalSigns.length)];
      const followUpPeriods = ['2 weeks', '1 month', '3 months', '6 months', 'as needed'];
      const randomFollowUp = followUpPeriods[Math.floor(Math.random() * followUpPeriods.length)];
      
      const randomNotes = `${randomVital}, follow up in ${randomFollowUp}`;
      
      // Add the random visit
      randomVisits.push({
        date: dateString,
        type: randomType,
        doctor: randomDoctor,
        diagnosis: randomDiagnosis,
        treatment: randomTreatment,
        notes: randomNotes,
        money: randomCost
      });
    }
    
    // Sort visits by date (most recent first)
    randomVisits.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Set the visits array
    patientDetails.visits = randomVisits;
    
    patientDetails.visits.forEach((visit, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatDateSimple(visit.date)}</td>
        <td>${visit.type}</td>
        <td>$${visit.money || Math.floor(Math.random() * 200) + 50}</td>
        <td>
          <button class="visit-action-btn" data-index="${index}">View Details</button>
        </td>
      `;
      visitHistoryBody.appendChild(row);
      
      // Add event listener to view details button
      row.querySelector('.visit-action-btn').addEventListener('click', () => {
        showAppointmentDetail(visit);
      });
    });
    
    // Show first visit details by default
    if (patientDetails.visits.length > 0) {
      showAppointmentDetail(patientDetails.visits[0]);
    }
  }
  
  // Function to display appointment details
  function showAppointmentDetail(visit) {
    if (appointmentDetailContent) {
      appointmentDetailContent.innerHTML = `
        <div class="info-item">
          <span class="label">Date:</span>
          <span class="value">${formatDateSimple(visit.date)}</span>
        </div>
        <div class="info-item">
          <span class="label">Type:</span>
          <span class="value">${visit.type}</span>
        </div>
        <div class="info-item">
          <span class="label">Doctor:</span>
          <span class="value">${visit.doctor}</span>
        </div>
        <div class="info-item">
          <span class="label">Diagnosis:</span>
          <span class="value">${visit.diagnosis}</span>
        </div>
        <div class="info-item">
          <span class="label">Treatment:</span>
          <span class="value">${visit.treatment}</span>
        </div>
        <div class="info-item">
          <span class="label">Notes:</span>
          <span class="value">${visit.notes}</span>
        </div>
        <div class="info-item">
          <span class="label">Cost:</span>
          <span class="value">$${visit.money}</span>
        </div>
        <div style="margin-top: 20px;">
          <button class="btn schedule-btn" onclick="alert('Redirecting to appointment detail page...')">
            <i class="fas fa-calendar-check"></i> Go to Appointment
          </button>
        </div>
      `;
    }
  }
}

// Patient Search and Filter Functions
function filterPatients() {
  const searchInput = document.getElementById('patient-search');
  const statusFilter = document.getElementById('filter-status');
  const rows = document.querySelectorAll('#patients-list-body tr');
  
  if (!searchInput || !statusFilter || !rows.length) return;
  
  const searchText = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  
  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase(); // Name column
    const status = row.querySelector('.status-badge').textContent.toLowerCase();
    
    const matchesSearch = name.includes(searchText);
    const matchesStatus = statusValue === 'all' || status === statusValue.toLowerCase();
    
    row.style.display = matchesSearch && matchesStatus ? '' : 'none';
  });
}

function sortPatients() {
  const sortFilter = document.getElementById('filter-sort');
  const tableBody = document.getElementById('patients-list-body');
  
  if (!sortFilter || !tableBody) return;
  
  const rows = Array.from(tableBody.querySelectorAll('tr'));
  
  rows.sort((a, b) => {
    const sortValue = sortFilter.value;
    
    if (sortValue === 'name') {
      const nameA = a.children[1].textContent;
      const nameB = b.children[1].textContent;
      return nameA.localeCompare(nameB);
    } else if (sortValue === 'recent') {
      const dateA = new Date(a.children[5].textContent);
      const dateB = new Date(b.children[5].textContent);
      return dateB - dateA;
    } else if (sortValue === 'id') {
      const idA = a.children[0].textContent;
      const idB = b.children[0].textContent;
      return idA.localeCompare(idB);
    }
    
    return 0;
  });
  
  // Remove all rows
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  
  // Add sorted rows
  rows.forEach(row => tableBody.appendChild(row));
}

// Modal Functions
function openPatientDetailsModal(patientId) {
  const modal = document.getElementById('patient-details-modal');
  const modalBody = document.getElementById('patient-details');
  
  if (!modal || !modalBody) return;
  
  // Mock patient data - in real app, this would come from API based on patientId
  const patientDetails = {
    id: patientId,
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'john.smith@example.com',
    address: '123 Main St, Anytown, ST 12345',
    lastVisit: '2023-06-01',
    nextAppointment: '2023-09-15',
    doctor: 'Dr. Sarah Johnson'
  };
  
  modalBody.innerHTML = `
    <div class="patient-modal-info">
      <div class="info-item">
        <span class="label">Patient ID:</span>
        <span class="value">${patientDetails.id}</span>
      </div>
      <div class="info-item">
        <span class="label">Name:</span>
        <span class="value">${patientDetails.name}</span>
      </div>
      <div class="info-item">
        <span class="label">Age:</span>
        <span class="value">${patientDetails.age}</span>
      </div>
      <div class="info-item">
        <span class="label">Gender:</span>
        <span class="value">${patientDetails.gender}</span>
      </div>
      <div class="info-item">
        <span class="label">Phone:</span>
        <span class="value">${patientDetails.phone}</span>
      </div>
      <div class="info-item">
        <span class="label">CIN:</span>
        <span class="value">${patientDetails.cin || 'AE123456'}</span>
      </div>
      <div class="info-item">
        <span class="label">Last Visit:</span>
        <span class="value">${formatDateSimple(patientDetails.lastVisit)}</span>
      </div>
      <div class="info-item">
        <span class="label">Next Appointment:</span>
        <span class="value">${formatDateSimple(patientDetails.nextAppointment)}</span>
      </div>
      <div class="info-item">
        <span class="label">Primary Doctor:</span>
        <span class="value">${patientDetails.doctor}</span>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn" onclick="window.location.href='patient-detail.html?id=${patientId}'">
        <i class="fas fa-user"></i> Full Profile
      </button>
    </div>
  `;
  
  modal.style.display = 'block';
}

function closePatientDetailsModal() {
  const modal = document.getElementById('patient-details-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// No longer needed as date navigation is removed

// Utility Functions
function formatDate(date) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatDateSimple(dateStr) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function parseDate(dateStr) {
  const [month, day, year] = dateStr.split(' ');
  const monthNumber = getMonthNumber(month.replace(',', ''));
  return new Date(parseInt(year), monthNumber, parseInt(day));
}

function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber];
}

function getMonthNumber(monthName) {
  const months = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3,
    'May': 4, 'June': 5, 'July': 6, 'August': 7,
    'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  return months[monthName] || 0;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Medicament Page Initialization
function initializeMedicamentPage() {
  // Load mock medicament data
  loadMedicamentData();
  
  // Add event listeners for search and filters
  const searchInput = document.getElementById('medicament-search');
  const categoryFilter = document.getElementById('filter-category');
  const stockFilter = document.getElementById('filter-stock');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterMedicaments);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterMedicaments);
  }
  
  if (stockFilter) {
    stockFilter.addEventListener('change', filterMedicaments);
  }
  
  // Modal functionality
  const medicationModal = document.getElementById('medication-modal');
  const addMedicationBtn = document.getElementById('add-medication-btn');
  const closeModalBtn = document.querySelector('#medication-modal .close');
  const cancelBtn = document.getElementById('cancel-med-btn');
  const saveMedBtn = document.getElementById('save-med-btn');
  
  if (addMedicationBtn) {
    addMedicationBtn.addEventListener('click', () => {
      medicationModal.style.display = 'block';
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      medicationModal.style.display = 'none';
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      medicationModal.style.display = 'none';
    });
  }
  
  if (saveMedBtn) {
    saveMedBtn.addEventListener('click', () => {
      // In a real app, this would save data to the backend
      alert('Medication saved successfully!');
      medicationModal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === medicationModal) {
      medicationModal.style.display = 'none';
    }
  });
}

function loadMedicamentData() {
  // Mock medicament data - in a real app, this would come from an API
  const medications = [
    { code: 'MED001', name: 'Amoxicillin 500mg', category: 'antibiotics', stock: 125, price: 12.50, expiry: '2024-12-01' },
    { code: 'MED002', name: 'Ibuprofen 400mg', category: 'analgesics', stock: 85, price: 8.75, expiry: '2025-06-15' },
    { code: 'MED003', name: 'Metformin 850mg', category: 'antidiabetic', stock: 210, price: 15.30, expiry: '2024-08-22' },
    { code: 'MED004', name: 'Atorvastatin 20mg', category: 'antihypertensive', stock: 75, price: 18.90, expiry: '2024-07-10' },
    { code: 'MED005', name: 'Diclofenac 50mg', category: 'anti-inflammatory', stock: 42, price: 9.45, expiry: '2023-12-30' },
    { code: 'MED006', name: 'Clopidogrel 75mg', category: 'antihypertensive', stock: 95, price: 25.60, expiry: '2024-09-05' },
    { code: 'MED007', name: 'Allopurinol 100mg', category: 'other', stock: 110, price: 11.25, expiry: '2025-01-18' },
    { code: 'MED008', name: 'Azithromycin 250mg', category: 'antibiotics', stock: 15, price: 22.75, expiry: '2023-11-25' },
    { code: 'MED009', name: 'Paracetamol 500mg', category: 'analgesics', stock: 320, price: 5.50, expiry: '2025-03-12' },
    { code: 'MED010', name: 'Losartan 50mg', category: 'antihypertensive', stock: 0, price: 14.80, expiry: '2024-05-30' },
    { code: 'MED011', name: 'Aspirin 100mg', category: 'analgesics', stock: 10, price: 7.25, expiry: '2024-02-15' },
    { code: 'MED012', name: 'Fluoxetine 20mg', category: 'other', stock: 0, price: 19.30, expiry: '2024-04-22' }
  ];
  
  const tbody = document.getElementById('medicament-list-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  medications.forEach(med => {
    // Determine stock status
    let stockStatus, statusClass;
    if (med.stock === 0) {
      stockStatus = 'Out of Stock';
      statusClass = 'stock-out';
    } else if (med.stock <= 15) {
      stockStatus = 'Low Stock';
      statusClass = 'stock-low';
    } else {
      stockStatus = 'In Stock';
      statusClass = 'stock-normal';
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${med.code}</td>
      <td>${med.name}</td>
      <td>${capitalizeFirstLetter(med.category)}</td>
      <td><span class="stock-badge ${statusClass}">${stockStatus} (${med.stock})</span></td>
      <td>$${med.price.toFixed(2)}</td>
      <td>${formatDateSimple(med.expiry)}</td>
      <td>
        <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="action-btn" title="View details"><i class="fas fa-eye"></i></button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

function filterMedicaments() {
  const searchInput = document.getElementById('medicament-search');
  const categoryFilter = document.getElementById('filter-category');
  const stockFilter = document.getElementById('filter-stock');
  const rows = document.querySelectorAll('#medicament-list-body tr');
  
  if (!searchInput || !categoryFilter || !stockFilter || !rows.length) return;
  
  const searchText = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const stockValue = stockFilter.value;
  
  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase(); // Name column
    const category = row.children[2].textContent.toLowerCase(); // Category column
    const stockStatus = row.children[3].textContent.toLowerCase(); // Stock column
    
    // Check if the row matches all filters
    const matchesSearch = name.includes(searchText);
    const matchesCategory = categoryValue === 'all' || category.toLowerCase() === categoryValue;
    
    let matchesStock = true;
    if (stockValue === 'in-stock') {
      matchesStock = stockStatus.includes('in stock');
    } else if (stockValue === 'low-stock') {
      matchesStock = stockStatus.includes('low stock');
    } else if (stockValue === 'out-of-stock') {
      matchesStock = stockStatus.includes('out of stock');
    }
    
    row.style.display = matchesSearch && matchesCategory && matchesStock ? '' : 'none';
  });
}
