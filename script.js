
// DOM Content Loaded Event - Entry Point
document.addEventListener('DOMContentLoaded', function() {
  // Include navigation and header
  includeNavbar();
  includeHeader();
  
  // Add appointment button listener
  document.addEventListener('click', function(e) {
    if (e.target.closest('.add-appointment')) {
      showAddAppointmentModal();
    }
  });
  
  // Initialize page-specific functionality
  initializePageByPath(window.location.pathname);
  
  // Initialize medication functionality
  initializeMedicationHandlers();
  
  // Add preparing patient click handler
  document.addEventListener('click', function(e) {
    const preparingCard = e.target.closest('#preparing .patient-card');
    if (preparingCard) {
      e.preventDefault();
      e.stopPropagation();
      showMeasurementsModal(preparingCard.dataset.id);
    }
  });
});

function showMeasurementsModal(patientId) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'measurements-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Take Measurements</h2>
        <span class="close">&times;</span>
      </div>
      <div class="modal-body">
        <form id="measurements-form">
          <div class="vital-signs-grid">
            <div class="vital-sign">
              <label>Blood Pressure</label>
              <input type="text" class="form-input" placeholder="120/80">
            </div>
            <div class="vital-sign">
              <label>Temperature</label>
              <input type="text" class="form-input" placeholder="37.0">
            </div>
            <div class="vital-sign">
              <label>Pulse</label>
              <input type="text" class="form-input" placeholder="72">
            </div>
            <div class="vital-sign">
              <label>Weight</label>
              <input type="text" class="form-input" placeholder="70">
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn edit-btn" id="cancel-measurements">Cancel</button>
            <button type="submit" class="btn schedule-btn">Save & Move to Examination</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  
  const closeBtn = modal.querySelector('.close');
  const cancelBtn = modal.querySelector('#cancel-measurements');
  const form = modal.querySelector('#measurements-form');
  
  closeBtn.onclick = () => modal.remove();
  cancelBtn.onclick = () => modal.remove();
  
  form.onsubmit = (e) => {
    e.preventDefault();
    // Here you would save the measurements and move patient to examination
    alert('Measurements saved. Patient moved to examination.');
    modal.remove();
  };
  
  window.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Initialize page based on current path
function initializePageByPath(currentPath) {
  if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
    initializeDashboard();
  } else if (currentPath.includes('patients.html')) {
    initializePatientsPage();
  } else if (currentPath.includes('patient-detail.html')) {
    initializePatientDetailPage();
  } else if (currentPath.includes('settings.html')) {
    initializeSettingsPage();
  } else if (currentPath.includes('medicament.html')) {
    initializeMedicamentPage();
  } else if (currentPath.includes('report.html')) {
    initializeReportPage();
  }
}

// Medication Handlers
function initializeMedicationHandlers() {
  const addMedicationButton = document.getElementById('add-medication');
  const addAnalysisButton = document.getElementById('add-analysis');
  
  if (addMedicationButton) {
    addMedicationButton.addEventListener('click', addNewMedication);
  }
  
  if (addAnalysisButton) {
    addAnalysisButton.addEventListener('click', addNewAnalysis);
  }

  // Add event listeners to existing remove buttons
  document.querySelectorAll('.remove-med').forEach(button => {
    button.addEventListener('click', removeMedication);
  });
  
  document.querySelectorAll('.remove-analysis').forEach(button => {
    button.addEventListener('click', removeAnalysis);
  });
}

function addNewAnalysis() {
  const analysesList = document.getElementById('analyses-list');
  const newAnalysisItem = document.createElement('div');
  newAnalysisItem.className = 'medication-item';

  newAnalysisItem.innerHTML = `
    <div class="medication-inputs">
      <input type="text" placeholder="Analysis name" class="form-input analysis-name">
    </div>
    <button class="action-btn remove-analysis" style="color: #f56565;"><i class="fas fa-trash"></i></button>
  `;

  analysesList.appendChild(newAnalysisItem);

  // Add event listener to remove button
  const removeButton = newAnalysisItem.querySelector('.remove-analysis');
  removeButton.addEventListener('click', removeAnalysis);
}

function removeAnalysis() {
  const analysisItem = this.closest('.analyses-item');
  const analysesList = document.getElementById('analyses-list');
  analysesList.removeChild(analysisItem);
}

function addNewMedication() {
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
  removeButton.addEventListener('click', removeMedication);
}

function removeMedication() {
  const medItem = this.closest('.medication-item');
  const medicationList = document.getElementById('medication-list');
  medicationList.removeChild(medItem);
}

// Navigation Functions
function includeNavbar() {
  fetchAndInjectHTML('.container nav', 'list.html', setActiveNavItem);
}

function includeHeader() {
  fetchAndInjectHTML('.content header', 'header.html', () => {
    setBreadcrumb();
    configureSearchBox();
    initializeClock();
  });
}

function fetchAndInjectHTML(selector, sourcePath, callback) {
  const containers = document.querySelectorAll(selector);
  
  if (containers.length === 0) return;
  
  fetch(sourcePath)
    .then(response => response.text())
    .then(data => {
      containers.forEach(container => {
        container.innerHTML = data;
      });
      if (typeof callback === 'function') {
        callback();
      }
    })
    .catch(error => console.error(`Error loading ${sourcePath}:`, error));
}

function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navItems = {
    'index.html': 'nav-dashboard',
    'patients.html': 'nav-patients',
    'patient-detail.html': 'nav-patients',
    'settings.html': 'nav-settings',
    'medicament.html': 'nav-medicament',
    'report.html': 'nav-reports'
  };
  
  // Set default for homepage
  if (currentPath === '/' || currentPath.endsWith('/')) {
    document.getElementById('nav-dashboard')?.classList.add('active');
    return;
  }
  
  // Find matching nav item
  for (const [page, navId] of Object.entries(navItems)) {
    if (currentPath.includes(page)) {
      document.getElementById(navId)?.classList.add('active');
      break;
    }
  }
}

function setBreadcrumb() {
  const currentPath = window.location.pathname;
  const breadcrumb = document.getElementById('page-breadcrumb');
  
  if (!breadcrumb) return;
  
  const breadcrumbMap = {
    'index.html': '<span>Dashboard</span>',
    'patients.html': '<span>Patients</span>',
    'settings.html': '<span>Settings</span>',
    'medicament.html': '<span>Medicament</span>',
    'report.html': '<span>Reports</span>'
  };
  
  // Default for homepage
  if (currentPath === '/' || currentPath.endsWith('/')) {
    breadcrumb.innerHTML = '<span>Dashboard</span>';
    return;
  }
  
  // Special case for patient detail page
  if (currentPath.includes('patient-detail.html')) {
    const patientName = document.getElementById('patient-full-name')?.textContent || 'Patient Details';
    breadcrumb.innerHTML = '<a href="patients.html">Patients</a> / <span id="patient-name-header">' + patientName + '</span>';
    return;
  }
  
  // Special case for appointment detail page
  if (currentPath.includes('appointment-detail.html')) {
    const patientName = 'Patient Name'; // This should be dynamic in a real app
    breadcrumb.innerHTML = '<a href="patients.html">Patients</a> / <a href="#" id="patient-link">' + patientName + '</a> / <span>Appointment Details</span>';
    return;
  }
  
  // Set breadcrumb for other pages
  for (const [page, content] of Object.entries(breadcrumbMap)) {
    if (currentPath.includes(page)) {
      breadcrumb.innerHTML = content;
      break;
    }
  }
}

function configureSearchBox() {
  const currentPath = window.location.pathname;
  const searchBox = document.getElementById('header-search');
  
  if (!searchBox) return;
  
  // Hide search for certain pages
  if (currentPath.includes('patient-detail.html') || 
      currentPath.includes('appointment-detail.html') || 
      currentPath.includes('settings.html')) {
    searchBox.style.display = 'none';
    return;
  }
  
  // Configure search placeholder
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const placeholders = {
      'patients.html': 'Search patient...',
      'medicament.html': 'Search medicament...'
    };
    
    for (const [page, placeholder] of Object.entries(placeholders)) {
      if (currentPath.includes(page)) {
        searchInput.placeholder = placeholder;
        return;
      }
    }
    
    // Default placeholder
    searchInput.placeholder = 'Search...';
  }
}

// Page Initialization Functions
function initializeSettingsPage() {
  document.querySelectorAll('.settings-form .btn').forEach(button => {
    button.addEventListener('click', () => {
      alert('Settings saved successfully!');
    });
  });
}

function initializeDashboard() {
  initializeCalendar();
  loadPatientStatusData();
}

function initializePatientsPage() {
  loadPatientsListData();
  addPatientSearchListeners();
  setupPatientModals();
}

function addPatientSearchListeners() {
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('filter-status');
  const sortFilter = document.getElementById('filter-sort');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const currentPath = window.location.pathname;
      if (currentPath.includes('patients.html')) {
        filterPatients();
      } else if (currentPath.includes('medicament.html')) {
        filterMedicaments();
      }
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', filterPatients);
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', sortPatients);
  }
}

function setupPatientModals() {
  // View patient details event delegation
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-patient-btn')) {
      const patientId = e.target.getAttribute('data-id');
      openPatientDetailsModal(patientId);
    }

    if (e.target.classList.contains('close')) {
      closeAllModals();
    }
  });
  
  // Add patient modal
  const addPatientBtn = document.getElementById('add-patient-btn');
  const addPatientModal = document.getElementById('add-patient-modal');
  const cancelAddPatientBtn = document.getElementById('cancel-add-patient');
  const addPatientForm = document.getElementById('add-patient-form');
  
  if (addPatientBtn && addPatientModal) {
    addPatientBtn.addEventListener('click', () => {
      addPatientModal.style.display = 'block';
    });
  }
  
  if (cancelAddPatientBtn) {
    cancelAddPatientBtn.addEventListener('click', () => {
      addPatientModal.style.display = 'none';
    });
  }
  
  if (addPatientForm) {
    addPatientForm.addEventListener('submit', handleAddPatientSubmit);
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
}

function handleAddPatientSubmit(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('patient-name').value;
  
  // In a real app, you would save this data to a database
  alert(`Patient ${name} added successfully!`);
  document.getElementById('add-patient-modal').style.display = 'none';
  this.reset();
  
  // Refresh patient list
  loadPatientsListData();
}

function initializePatientDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('id');

  if (patientId) {
    loadPatientDetails(patientId);
  }
  
  setupPatientDetailModals();
}

function setupPatientDetailModals() {
  setupModal('edit-patient-btn', 'edit-patient-modal', 'cancel-edit-patient');
  setupModal('schedule-patient-btn', 'schedule-modal', 'cancel-schedule');
  
  // Handle form submissions
  setupFormSubmit('edit-patient-form', 'Patient information updated successfully!', 'edit-patient-modal');
  setupFormSubmit('schedule-appointment-form', 'Appointment scheduled successfully!', 'schedule-modal');
}

function setupModal(triggerBtnId, modalId, cancelBtnId) {
  const triggerBtn = document.getElementById(triggerBtnId);
  const modal = document.getElementById(modalId);
  const cancelBtn = document.getElementById(cancelBtnId);
  const closeModalBtn = modal?.querySelector('.close');
  
  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => {
      if (modalId === 'schedule-modal') {
        // Set default date to tomorrow for scheduling
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('appointment-date').valueAsDate = tomorrow;
      } else if (modalId === 'edit-patient-modal') {
        // Pre-fill the form with patient details
        prefillPatientEditForm();
      }
      
      modal.style.display = 'block';
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
  }
}

function prefillPatientEditForm() {
  document.getElementById('edit-patient-name').value = document.getElementById('patient-name').textContent;
  document.getElementById('edit-patient-cin').value = document.getElementById('patient-cin').textContent;
  document.getElementById('edit-patient-phone').value = document.getElementById('patient-phone').textContent;
  document.getElementById('edit-patient-allergies').value = document.getElementById('patient-allergies').textContent;
  document.getElementById('edit-patient-conditions').value = document.getElementById('patient-conditions').textContent;
}

function setupFormSubmit(formId, successMessage, modalId) {
  const form = document.getElementById(formId);
  const modal = document.getElementById(modalId);
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert(successMessage);
      modal.style.display = 'none';
    });
  }
}

function initializeMedicamentPage() {
  loadMedicamentData();
  
  const searchInput = document.getElementById('medicament-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterMedicaments);
  }
  
  setupMedicamentModal();
}

function setupMedicamentModal() {
  const medicationModal = document.getElementById('medication-modal');
  const addMedicationBtn = document.getElementById('add-medication-btn');
  const closeModalBtn = document.querySelector('#medication-modal .close');
  const cancelBtn = document.getElementById('cancel-med-btn');
  const saveMedBtn = document.getElementById('save-med-btn');

  if (addMedicationBtn && medicationModal) {
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
      alert('Medication saved successfully!');
      medicationModal.style.display = 'none';
    });
  }
}

function initializeReportPage() {
  // Set today's date as default in date picker
  const dateInput = document.getElementById('report-date');
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }

  // Add event listener for report generation
  const generateReportBtn = document.getElementById('generate-report');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', generateReports);
  }

  // Generate reports on page load
  generateReports();
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
  // Mock appointment data - in real app this would come from backend
  const appointmentCounts = {};
  for (let i = 1; i <= daysInMonth; i++) {
    appointmentCounts[i] = Math.floor(Math.random() * 20); // Random number 0-19
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const dateSpan = document.createElement('span');
    dateSpan.textContent = i;
    dayElement.appendChild(dateSpan);

    const count = appointmentCounts[i];
    const countSpan = document.createElement('span');
    countSpan.className = 'appointment-count';
    countSpan.textContent = count + ' apt';
    dayElement.appendChild(countSpan);

    // Add color based on appointment count
    if (count > 0) {
      if (count <= 5) dayElement.classList.add('appointments-low');
      else if (count <= 10) dayElement.classList.add('appointments-medium');
      else if (count <= 15) dayElement.classList.add('appointments-high');
      else if (count <= 20) dayElement.classList.add('appointments-very-high');
    }

    // Check if day is today
    if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
      dayElement.classList.add('today');
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
    loadPatientStatusData(selectedDate);
  }
}

// Data Loading Functions
function loadPatientStatusData(date) {
  // Mock patient data categories
  const patientCategories = {
    'waiting': [
      { id: 1, name: 'John Smith', age: 45, gender: 'Male', time: '09:30 AM', image: 'https://randomuser.me/api/portraits/men/32.jpg', hasAppointment: true },
      { id: 2, name: 'Sarah Johnson', age: 38, gender: 'Female', time: '10:15 AM', image: 'https://randomuser.me/api/portraits/women/44.jpg', hasAppointment: false },
      { id: 3, name: 'Michael Brown', age: 52, gender: 'Male', time: '11:00 AM', image: 'https://randomuser.me/api/portraits/men/45.jpg', hasAppointment: true }
    ],
    'preparing': [
      { id: 14, name: 'Emma Wilson', age: 33, gender: 'Female', time: '10:45 AM', image: 'https://randomuser.me/api/portraits/women/67.jpg', hasAppointment: true }
    ],
    'examination': [
      { id: 4, name: 'Emily Davis', age: 29, gender: 'Female', time: 'Since 09:45 AM', image: 'https://randomuser.me/api/portraits/women/22.jpg', hasAppointment: false }
    ],
    'scheduled': [
      { id: 5, name: 'Robert Wilson', age: 62, gender: 'Male', time: '01:30 PM', image: 'https://randomuser.me/api/portraits/men/78.jpg', hasAppointment: true },
      { id: 6, name: 'Lisa Martin', age: 41, gender: 'Female', time: '02:15 PM', image: 'https://randomuser.me/api/portraits/women/56.jpg', hasAppointment: false },
      { id: 7, name: 'David Taylor', age: 35, gender: 'Male', time: '03:45 PM', image: 'https://randomuser.me/api/portraits/men/60.jpg', hasAppointment: true },
      { id: 8, name: 'Jennifer Adams', age: 28, gender: 'Female', time: '04:30 PM', image: 'https://randomuser.me/api/portraits/women/33.jpg', hasAppointment: false }
    ],
    'completed': [
      { id: 9, name: 'Thomas Wright', age: 55, gender: 'Male', time: '08:45 AM', image: 'https://randomuser.me/api/portraits/men/22.jpg', hasAppointment: false },
      { id: 10, name: 'Jessica Lee', age: 31, gender: 'Female', time: '09:20 AM', image: 'https://randomuser.me/api/portraits/women/28.jpg', hasAppointment: true }
    ],
    'canceled': [
      { id: 11, name: 'Richard Anderson', age: 50, gender: 'Male', time: '11:30 AM', image: 'https://randomuser.me/api/portraits/men/67.jpg', hasAppointment: true },
      { id: 12, name: 'Laura Miller', age: 34, gender: 'Female', time: '02:00 PM', image: 'https://randomuser.me/api/portraits/women/63.jpg', hasAppointment: true },
      { id: 13, name: 'Kevin Thompson', age: 42, gender: 'Male', time: '03:15 PM', image: 'https://randomuser.me/api/portraits/men/52.jpg', hasAppointment: false }
    ]
  };

  // Populate patient lists
  Object.entries(patientCategories).forEach(([category, patients]) => {
    populatePatientList(category, patients);
  });
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
    patientCard.className = patient.hasAppointment ? 'patient-card has-rendez-vous' : 'patient-card';
    patientCard.dataset.id = patient.id;

    patientCard.innerHTML = `
      <img src="${patient.image}" alt="${patient.name}">
      <div class="patient-info">
        <h4>${patient.name}</h4>
        <p>${patient.age}, ${patient.gender}</p>
      </div>
      <div class="patient-time">${patient.time}</div>
    `;

    if (!containerId.includes('preparing')) {
      patientCard.addEventListener('click', () => {
        window.location.href = `patient-detail.html?id=${patient.id}`;
      });
    }

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
  const patientDetails = getMockPatientDetails(patientId);

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

  // Add last appointment info
  document.getElementById('patient-last-diagnostic').textContent = patientDetails.visits[0].diagnosis;
  document.getElementById('last-appointment-date').textContent = formatDateSimple(patientDetails.visits[0].date);
  document.getElementById('last-appointment-type').textContent = patientDetails.visits[0].type;
  document.getElementById('last-appointment-treatment').textContent = patientDetails.visits[0].treatment;

  // Populate visit history
  populateVisitHistory(patientDetails.visits);
}

function getMockPatientDetails(patientId) {
  // Basic patient info
  const patientDetails = {
    id: patientId || 'P001',
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
    visits: []
  };

  // Generate visit history data
  patientDetails.visits = generateRandomVisits();
  
  return patientDetails;
}

function generateRandomVisits() {
  // Arrays for random data generation
  const visitTypes = ['Regular Check-up', 'Illness', 'Specialist', 'Emergency', 'Follow-up', 'Surgery Consultation', 'Vaccination', 'Lab Results Review'];
  const doctors = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. David Wilson', 'Dr. Maria Garcia', 'Dr. James Taylor', 'Dr. Lisa Brown', 'Dr. Robert Lee'];
  const diagnoses = [
    'Well-controlled hypertension', 'Upper respiratory infection', 'Diabetes follow-up', 
    'Cardiovascular assessment', 'Acute bronchitis', 'Allergic rhinitis', 
    'Mild anxiety', 'Lower back pain', 'Gastroenteritis', 'Seasonal allergies',
    'Vitamin D deficiency', 'Osteoarthritis', 'Migraine headache', 'Annual wellness visit'
  ];
  const treatments = [
    'Continue current medications', 'Antibiotics, rest', 'Adjusted medication dosage', 
    'No changes to current treatment', 'NSAIDs for pain management', 'Prescribed antihistamines',
    'Physical therapy referral', 'Dietary modifications', 'Hydration and rest',
    'Stress management techniques', 'Prescribed muscle relaxants', 'Updated vaccination schedule',
    'Referred to specialist'
  ];

  // Create visits array
  const visits = [];
  
  // First add the most recent visit to keep the last diagnostic consistent
  visits.push({ 
    date: '2023-06-01', 
    type: 'Regular Check-up', 
    doctor: 'Dr. Sarah Johnson', 
    diagnosis: 'Well-controlled hypertension', 
    treatment: 'Continue current medications', 
    notes: 'Blood pressure 130/85, follow up in 3 months', 
    money: 150 
  });

  // Generate random visits
  const today = new Date();
  for (let i = 1; i < 15; i++) {
    // Generate a random date within the last 3 years
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() - Math.floor(Math.random() * 1095)); // 1095 days = 3 years
    const dateString = randomDate.toISOString().split('T')[0];

    // Get random elements from arrays
    const randomType = visitTypes[Math.floor(Math.random() * visitTypes.length)];
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    const randomDiagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    const randomTreatment = treatments[Math.floor(Math.random() * treatments.length)];
    const randomCost = Math.floor(Math.random() * 450) + 50;

    // Generate random notes
    const vitalSigns = [
      `Blood pressure ${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 70}`, 
      `Heart rate ${Math.floor(Math.random() * 40) + 60} bpm`, 
      `Temperature ${(Math.random() * 1.5 + 97).toFixed(1)}°F`
    ];
    const randomVital = vitalSigns[Math.floor(Math.random() * vitalSigns.length)];
    const followUpPeriods = ['2 weeks', '1 month', '3 months', '6 months', 'as needed'];
    const randomFollowUp = followUpPeriods[Math.floor(Math.random() * followUpPeriods.length)];
    const randomNotes = `${randomVital}, follow up in ${randomFollowUp}`;

    // Add the random visit
    visits.push({
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
  return visits.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function populateVisitHistory(visits) {
  const visitHistoryBody = document.getElementById('visit-history-body');
  if (!visitHistoryBody) return;
  
  visitHistoryBody.innerHTML = '';

  visits.forEach((visit, index) => {
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
  if (visits.length > 0) {
    showAppointmentDetail(visits[0]);
  }
}

function showAppointmentDetail(visit) {
  const appointmentDetailContent = document.getElementById('appointment-detail-content');
  if (!appointmentDetailContent) return;
  
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

function loadMedicamentData() {
  // Mock medicament data - in a real app, this would come from an API
  const medications = [
    { code: 'MED001', name: 'Amoxicillin 500mg', price: 12.50 },
    { code: 'MED002', name: 'Ibuprofen 400mg', price: 8.75 },
    { code: 'MED003', name: 'Metformin 850mg', price: 15.30 },
    { code: 'MED004', name: 'Atorvastatin 20mg', price: 18.90 },
    { code: 'MED005', name: 'Diclofenac 50mg', price: 9.45 },
    { code: 'MED006', name: 'Clopidogrel 75mg', price: 25.60 },
    { code: 'MED007', name: 'Allopurinol 100mg', price: 11.25 },
    { code: 'MED008', name: 'Azithromycin 250mg', price: 22.75 },
    { code: 'MED009', name: 'Paracetamol 500mg', price: 5.50 },
    { code: 'MED010', name: 'Losartan 50mg', price: 14.80 },
    { code: 'MED011', name: 'Aspirin 100mg', price: 7.25 },
    { code: 'MED012', name: 'Fluoxetine 20mg', price: 19.30 }
  ];

  const tbody = document.getElementById('medicament-list-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  medications.forEach(med => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${med.code}</td>
      <td>${med.name}</td>
      <td>$${med.price.toFixed(2)}</td>
    `;

    tbody.appendChild(row);
  });
}

// Search and Filter Functions
function filterPatients() {
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('filter-status');
  const rows = document.querySelectorAll('#patients-list-body tr');

  if (!searchInput || !statusFilter || !rows.length) return;

  const searchText = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;

  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase(); // Name column
    const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';

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
  const sortValue = sortFilter.value;

  rows.sort((a, b) => {
    if (sortValue === 'name') {
      return a.children[1].textContent.localeCompare(b.children[1].textContent);
    } else if (sortValue === 'recent') {
      return new Date(b.children[5]?.textContent || '') - new Date(a.children[5]?.textContent || '');
    } else if (sortValue === 'id') {
      return a.children[0].textContent.localeCompare(b.children[0].textContent);
    }
    return 0;
  });

  // Remove all rows
  tableBody.innerHTML = '';

  // Add sorted rows
  rows.forEach(row => tableBody.appendChild(row));
}

function filterMedicaments() {
  const searchInput = document.getElementById('search-input');
  const rows = document.querySelectorAll('#medicament-list-body tr');

  if (!searchInput || !rows.length) return;

  const searchText = searchInput.value.toLowerCase();

  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase(); // Name column
    row.style.display = name.includes(searchText) ? '' : 'none';
  });
}

// Modal Functions
function showAddAppointmentModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'add-appointment-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add New Appointment</h2>
        <span class="close">&times;</span>
      </div>
      <div class="modal-body">
        <form id="add-appointment-form">
          <div class="form-group">
            <label for="patient-select">Patient</label>
            <select id="patient-select" class="form-input" required>
              <option value="">Select patient</option>
              <option value="1">John Smith</option>
              <option value="2">Sarah Johnson</option>
              <option value="3">Michael Brown</option>
            </select>
          </div>
          <div class="form-group">
            <label for="new-appointment-date">Appointment Date</label>
            <input type="date" id="new-appointment-date" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="new-appointment-time">Time</label>
            <input type="time" id="new-appointment-time" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="new-appointment-type">Type of Visit</label>
            <select id="new-appointment-type" class="form-input" required>
              <option value="">Select type</option>
              <option value="Regular Check-up">Regular Check-up</option>
              <option value="Illness">Illness</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Specialist">Specialist Consultation</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Lab Results">Lab Results Review</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="new-appointment-notes">Notes</label>
            <textarea id="new-appointment-notes" class="form-input" rows="3" placeholder="Any notes about the appointment"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn edit-btn" id="cancel-add-appointment">Cancel</button>
            <button type="submit" class="btn schedule-btn">Add Appointment</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close');
  const cancelBtn = modal.querySelector('#cancel-add-appointment');
  const form = modal.querySelector('#add-appointment-form');
  
  closeBtn.onclick = () => {
    modal.remove();
  };
  
  cancelBtn.onclick = () => {
    modal.remove();
  };
  
  form.onsubmit = (e) => {
    e.preventDefault();
    alert('Appointment added successfully!');
    modal.remove();
  };
  
  window.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };
}

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
    cin: 'AE123456',
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
        <span class="value">${patientDetails.cin}</span>
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

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// Reports Functions
function generateReports() {
  const dateInput = document.getElementById('report-date');
  const illnessType = document.getElementById('illness-type');
  
  const selectedDate = dateInput ? new Date(dateInput.value) : new Date();
  const selectedIllnessType = illnessType ? illnessType.value : 'all';

  // Generate mock data for reports based on selected filters
  generateMockReportData(selectedDate, 'all', selectedIllnessType);
}

function generateMockReportData(date, reportType, illnessType) {
  // Apply a multiplier based on illness type to simulate different data
  let multiplier = 1.0;
  
  if (illnessType !== 'all') {
    // Different illness types would have different weights
    const multipliers = {
      'Regular Check-up': 0.8,
      'Illness': 1.2,
      'Follow-up': 0.7,
      'Specialist': 1.5,
      'Vaccination': 0.6,
      'Lab Results': 0.5,
      'Emergency': 1.8,
      'Surgery Consultation': 2.0
    };
    multiplier = multipliers[illnessType] || 1.0;
  }
  
  // Update report data
  updateReportData('daily', multiplier);
  updateReportData('weekly', multiplier);
  updateReportData('monthly', multiplier);
}

function updateReportData(period, multiplier) {
  // Configuration for different report periods
  const config = {
    'daily': {
      minPatients: 5,
      maxPatients: 25,
      minAmount: 500,
      maxAmount: 2500
    },
    'weekly': {
      minPatients: 30,
      maxPatients: 90,
      minAmount: 3000,
      maxAmount: 11000
    },
    'monthly': {
      minPatients: 100,
      maxPatients: 300,
      minAmount: 15000,
      maxAmount: 45000
    }
  };
  
  const { minPatients, maxPatients, minAmount, maxAmount } = config[period];
  
  // Generate random data with multiplier applied
  const patients = Math.floor((Math.random() * (maxPatients - minPatients) + minPatients) * multiplier);
  const amount = ((Math.random() * (maxAmount - minAmount) + minAmount) * multiplier).toFixed(2);
  
  // Update DOM elements
  document.getElementById(`${period}-patients`).textContent = patients || "0";
  document.getElementById(`${period}-amount`).textContent = `$${amount || "0.00"}`;
}

// Clock functionality
function initializeClock() {
  const clockElement = document.getElementById('live-clock');
  if (!clockElement) return;
  
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  
  // Update clock immediately
  updateClock();
  
  // Update clock every second
  setInterval(updateClock, 1000);
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
