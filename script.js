
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
  }
});

// Dashboard Page Initialization
function initializeDashboard() {
  // Set current date
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const today = new Date();
    currentDateElement.textContent = `Today: ${formatDate(today)}`;
  }
  
  // Initialize calendar
  initializeCalendar();
  
  // Load mock patient data
  loadPatientStatusData();
  
  // Add event listeners for date navigation
  const prevDateBtn = document.getElementById('prev-date');
  const nextDateBtn = document.getElementById('next-date');
  
  if (prevDateBtn && nextDateBtn) {
    prevDateBtn.addEventListener('click', navigateDate);
    nextDateBtn.addEventListener('click', navigateDate);
  }
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
  
  // Populate patient lists
  populatePatientList('waiting', waitingPatients);
  populatePatientList('examination', examinationPatients);
  populatePatientList('scheduled', scheduledPatients);
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
  // Mock patients data
  const patients = [
    { id: 'P001', name: 'John Smith', age: 45, gender: 'Male', phone: '(555) 123-4567', lastVisit: '2023-06-01', status: 'active' },
    { id: 'P002', name: 'Sarah Johnson', age: 38, gender: 'Female', phone: '(555) 234-5678', lastVisit: '2023-05-15', status: 'active' },
    { id: 'P003', name: 'Michael Brown', age: 52, gender: 'Male', phone: '(555) 345-6789', lastVisit: '2023-06-10', status: 'active' },
    { id: 'P004', name: 'Emily Davis', age: 29, gender: 'Female', phone: '(555) 456-7890', lastVisit: '2023-06-12', status: 'active' },
    { id: 'P005', name: 'Robert Wilson', age: 62, gender: 'Male', phone: '(555) 567-8901', lastVisit: '2023-04-20', status: 'inactive' },
    { id: 'P006', name: 'Lisa Martin', age: 41, gender: 'Female', phone: '(555) 678-9012', lastVisit: '2023-05-30', status: 'active' },
    { id: 'P007', name: 'David Taylor', age: 35, gender: 'Male', phone: '(555) 789-0123', lastVisit: '2023-03-15', status: 'inactive' },
    { id: 'P008', name: 'Jennifer Adams', age: 28, gender: 'Female', phone: '(555) 890-1234', lastVisit: '2023-06-02', status: 'active' }
  ];
  
  const tableBody = document.getElementById('patients-list-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  patients.forEach(patient => {
    const row = document.createElement('tr');
    row.dataset.id = patient.id;
    
    const statusClass = patient.status === 'active' ? 'status-active' : 'status-inactive';
    
    row.innerHTML = `
      <td>${patient.id}</td>
      <td>${patient.name}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.phone}</td>
      <td>${formatDateSimple(patient.lastVisit)}</td>
      <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(patient.status)}</span></td>
      <td>
        <button class="action-btn view-patient-btn" data-id="${patient.id}"><i class="fas fa-eye"></i></button>
        <button class="action-btn"><i class="fas fa-edit"></i></button>
        <button class="action-btn"><i class="fas fa-calendar-plus"></i></button>
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
    bloodType: 'O+',
    phone: '(555) 123-4567',
    email: 'john.smith@example.com',
    address: '123 Main St, Anytown, ST 12345',
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
  document.getElementById('patient-id').textContent = patientDetails.id;
  document.getElementById('patient-dob').textContent = formatDateSimple(patientDetails.dob);
  document.getElementById('patient-age').textContent = patientDetails.age;
  document.getElementById('patient-gender').textContent = patientDetails.gender;
  document.getElementById('patient-blood').textContent = patientDetails.bloodType;
  document.getElementById('patient-phone').textContent = patientDetails.phone;
  document.getElementById('patient-email').textContent = patientDetails.email;
  document.getElementById('patient-address').textContent = patientDetails.address;
  document.getElementById('patient-image').src = patientDetails.image;
  document.getElementById('patient-allergies').textContent = patientDetails.allergies;
  document.getElementById('patient-conditions').textContent = patientDetails.chronicConditions;
  document.getElementById('patient-medications').textContent = patientDetails.medications;
  
  // Add last diagnostic
  document.getElementById('patient-last-diagnostic').textContent = patientDetails.visits[0].diagnosis;
  
  // Populate visit history
  const visitHistoryBody = document.getElementById('visit-history-body');
  if (visitHistoryBody) {
    visitHistoryBody.innerHTML = '';
    
    patientDetails.visits.forEach(visit => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatDateSimple(visit.date)}</td>
        <td>${visit.type}</td>
        <td>$${visit.money || Math.floor(Math.random() * 200) + 50}</td>
      `;
      visitHistoryBody.appendChild(row);
    });
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
        <span class="label">Email:</span>
        <span class="value">${patientDetails.email}</span>
      </div>
      <div class="info-item">
        <span class="label">Address:</span>
        <span class="value">${patientDetails.address}</span>
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

// Navigation Functions
function navigateDate(event) {
  const direction = event.currentTarget.id === 'prev-date' ? -1 : 1;
  const currentDateElement = document.getElementById('current-date');
  
  if (!currentDateElement) return;
  
  const dateText = currentDateElement.textContent;
  const currentDate = dateText.includes('Today:') ? new Date() : parseDate(dateText.split(': ')[1]);
  
  // Move to next or previous day
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + direction);
  
  // Update displayed date
  const prefix = dateText.includes('Today:') ? 'Selected: ' : dateText.includes('Selected:') ? 'Selected: ' : '';
  currentDateElement.textContent = `${prefix}${formatDate(newDate)}`;
  
  // Load data for the new date
  loadPatientStatusData(newDate);
}

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
