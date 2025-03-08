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


// Function to include the sidebar navigation
function includeNavbar() {
  const sidebarContainers = document.querySelectorAll('.container nav');
  
  sidebarContainers.forEach(container => {
    fetch('list.html')
      .then(response => response.text())
      .then(data => {
        container.innerHTML = data;
        
        // Set active class based on current page
        const currentPath = window.location.pathname;
        if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
          document.getElementById('nav-dashboard').classList.add('active');
        } else if (currentPath.includes('patients.html')) {
          document.getElementById('nav-patients').classList.add('active');
        } else if (currentPath.includes('patient-detail.html')) {
          document.getElementById('nav-patients').classList.add('active'); // Patient detail is under Patients
        } else if (currentPath.includes('settings.html')) {
          document.getElementById('nav-settings').classList.add('active');
        } else if (currentPath.includes('medicament.html')) {
          document.getElementById('nav-medicament').classList.add('active');
        }
      })
      .catch(error => console.error('Error loading the navigation bar:', error));
  });
}

// Function to include the header
function includeHeader() {
  const headerContainers = document.querySelectorAll('.content header');
  
  headerContainers.forEach(container => {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        container.innerHTML = data;
        
        // Set breadcrumb based on current page
        const currentPath = window.location.pathname;
        const breadcrumb = document.getElementById('page-breadcrumb');
        
        if (breadcrumb) {
          if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
            breadcrumb.innerHTML = '<span>Dashboard</span>';
          } else if (currentPath.includes('patients.html')) {
            breadcrumb.innerHTML = '<span>Patients</span>';
          } else if (currentPath.includes('patient-detail.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const patientId = urlParams.get('id');
            const patientName = document.getElementById('patient-full-name') ? 
                                document.getElementById('patient-full-name').textContent : 
                                'Patient Details';
            breadcrumb.innerHTML = '<a href="patients.html">Patients</a> / <span id="patient-name-header">' + patientName + '</span>';
          } else if (currentPath.includes('appointment-detail.html')) {
            const patientName = 'Patient Name'; // This should be dynamic in a real app
            breadcrumb.innerHTML = '<a href="patients.html">Patients</a> / <a href="#" id="patient-link">' + patientName + '</a> / <span>Appointment Details</span>';
          } else if (currentPath.includes('settings.html')) {
            breadcrumb.innerHTML = '<span>Settings</span>';
          } else if (currentPath.includes('medicament.html')) {
            breadcrumb.innerHTML = '<span>Medicament</span>';
          } else if (currentPath.includes('report.html')) {
            breadcrumb.innerHTML = '<span>Rapports</span>';
          }
        }
        
        // Hide search box for pages that don't need it
        const searchBox = document.getElementById('header-search');
        if (searchBox) {
          if (currentPath.includes('patient-detail.html') || 
              currentPath.includes('appointment-detail.html') || 
              currentPath.includes('settings.html')) {
            searchBox.style.display = 'none';
          } else {
            // Set placeholder text based on page
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
              if (currentPath.includes('patients.html')) {
                searchInput.placeholder = 'Search patient...';
              } else if (currentPath.includes('medicament.html')) {
                searchInput.placeholder = 'Search medicament...';
              } else {
                searchInput.placeholder = 'Search...';
              }
            }
          }
        }
        
        // Initialize clock
        initializeClock();
      })
      .catch(error => console.error('Error loading the header:', error));
  });
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Include the navigation bar
  includeNavbar();
  
  // Include the header
  includeHeader();
  
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
  } else if (currentPath.includes('report.html')) {
    initializeReportPage();
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

  // Add event listener for patient details modal
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-patient-btn')) {
      const patientId = e.target.getAttribute('data-id');
      openPatientDetailsModal(patientId);
    }

    if (e.target.classList.contains('close')) {
      closeAllModals();
    }
  });
  
  // Add New Patient Modal
  const addPatientBtn = document.getElementById('add-patient-btn');
  const addPatientModal = document.getElementById('add-patient-modal');
  const cancelAddPatientBtn = document.getElementById('cancel-add-patient');
  const addPatientForm = document.getElementById('add-patient-form');
  
  if (addPatientBtn && addPatientModal) {
    addPatientBtn.addEventListener('click', function() {
      addPatientModal.style.display = 'block';
    });
  }
  
  if (cancelAddPatientBtn) {
    cancelAddPatientBtn.addEventListener('click', function() {
      addPatientModal.style.display = 'none';
    });
  }
  
  if (addPatientForm) {
    addPatientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('patient-name').value;
      const dob = document.getElementById('patient-dob').value;
      const gender = document.getElementById('patient-gender').value;
      const cin = document.getElementById('patient-cin').value;
      const phone = document.getElementById('patient-phone').value;
      
      // In a real app, you would save this data to a database
      // For demo purposes, just alert and close the modal
      alert(`Patient ${name} added successfully!`);
      addPatientModal.style.display = 'none';
      addPatientForm.reset();
      
      // Refresh patient list (in a real app, this would fetch updated data)
      // Here we're just reloading the mock data
      loadPatientsListData();
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === addPatientModal) {
      addPatientModal.style.display = 'none';
    }
  });
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
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
  
  // Initialize edit modal
  const editBtn = document.getElementById('edit-patient-btn');
  const editModal = document.getElementById('edit-patient-modal');
  const cancelEditBtn = document.getElementById('cancel-edit-patient');
  const closeEditModal = editModal ? editModal.querySelector('.close') : null;
  
  if (editBtn && editModal) {
    editBtn.addEventListener('click', function() {
      // Pre-fill the form with patient details
      document.getElementById('edit-patient-name').value = document.getElementById('patient-name').textContent;
      document.getElementById('edit-patient-cin').value = document.getElementById('patient-cin').textContent;
      document.getElementById('edit-patient-phone').value = document.getElementById('patient-phone').textContent;
      document.getElementById('edit-patient-allergies').value = document.getElementById('patient-allergies').textContent;
      document.getElementById('edit-patient-conditions').value = document.getElementById('patient-conditions').textContent;
      
      // Show the modal
      editModal.style.display = 'block';
    });
  }
  
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function() {
      editModal.style.display = 'none';
    });
  }
  
  if (closeEditModal) {
    closeEditModal.addEventListener('click', function() {
      editModal.style.display = 'none';
    });
  }
  
  // Initialize schedule modal
  const scheduleBtn = document.getElementById('schedule-patient-btn');
  const scheduleModal = document.getElementById('schedule-modal');
  const cancelScheduleBtn = document.getElementById('cancel-schedule');
  const closeScheduleModal = scheduleModal ? scheduleModal.querySelector('.close') : null;
  
  if (scheduleBtn && scheduleModal) {
    scheduleBtn.addEventListener('click', function() {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('appointment-date').valueAsDate = tomorrow;
      
      // Show the modal
      scheduleModal.style.display = 'block';
    });
  }
  
  if (cancelScheduleBtn) {
    cancelScheduleBtn.addEventListener('click', function() {
      scheduleModal.style.display = 'none';
    });
  }
  
  if (closeScheduleModal) {
    closeScheduleModal.addEventListener('click', function() {
      scheduleModal.style.display = 'none';
    });
  }
  
  // Handle form submissions
  const editForm = document.getElementById('edit-patient-form');
  const scheduleForm = document.getElementById('schedule-appointment-form');
  
  if (editForm) {
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // In a real app, you would save this data to a database
      alert('Patient information updated successfully!');
      editModal.style.display = 'none';
    });
  }
  
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const date = document.getElementById('appointment-date').value;
      const type = document.getElementById('appointment-type').value;
      
      // In a real app, you would save this data to a database
      alert(`Appointment scheduled for ${date} successfully!`);
      scheduleModal.style.display = 'none';
    });
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === editModal) {
      editModal.style.display = 'none';
    } else if (e.target === scheduleModal) {
      scheduleModal.style.display = 'none';
    }
  });
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
    { id: 1, name: 'John Smith', age: 45, gender: 'Male', time: '09:30 AM', image: 'https://randomuser.me/api/portraits/men/32.jpg', hasAppointment: true },
    { id: 2, name: 'Sarah Johnson', age: 38, gender: 'Female', time: '10:15 AM', image: 'https://randomuser.me/api/portraits/women/44.jpg', hasAppointment: false },
    { id: 3, name: 'Michael Brown', age: 52, gender: 'Male', time: '11:00 AM', image: 'https://randomuser.me/api/portraits/men/45.jpg', hasAppointment: true }
  ];

  const examinationPatients = [
    { id: 4, name: 'Emily Davis', age: 29, gender: 'Female', time: 'Since 09:45 AM', image: 'https://randomuser.me/api/portraits/women/22.jpg', hasAppointment: false }
  ];

  const scheduledPatients = [
    { id: 5, name: 'Robert Wilson', age: 62, gender: 'Male', time: '01:30 PM', image: 'https://randomuser.me/api/portraits/men/78.jpg', hasAppointment: true },
    { id: 6, name: 'Lisa Martin', age: 41, gender: 'Female', time: '02:15 PM', image: 'https://randomuser.me/api/portraits/women/56.jpg', hasAppointment: false },
    { id: 7, name: 'David Taylor', age: 35, gender: 'Male', time: '03:45 PM', image: 'https://randomuser.me/api/portraits/men/60.jpg', hasAppointment: true },
    { id: 8, name: 'Jennifer Adams', age: 28, gender: 'Female', time: '04:30 PM', image: 'https://randomuser.me/api/portraits/women/33.jpg', hasAppointment: false }
  ];

  const completedPatients = [
    { id: 9, name: 'Thomas Wright', age: 55, gender: 'Male', time: '08:45 AM', image: 'https://randomuser.me/api/portraits/men/22.jpg', hasAppointment: false },
    { id: 10, name: 'Jessica Lee', age: 31, gender: 'Female', time: '09:20 AM', image: 'https://randomuser.me/api/portraits/women/28.jpg', hasAppointment: true }
  ];
  
  const canceledPatients = [
    { id: 11, name: 'Richard Anderson', age: 50, gender: 'Male', time: '11:30 AM', image: 'https://randomuser.me/api/portraits/men/67.jpg', hasAppointment: true },
    { id: 12, name: 'Laura Miller', age: 34, gender: 'Female', time: '02:00 PM', image: 'https://randomuser.me/api/portraits/women/63.jpg', hasAppointment: true },
    { id: 13, name: 'Kevin Thompson', age: 42, gender: 'Male', time: '03:15 PM', image: 'https://randomuser.me/api/portraits/men/52.jpg', hasAppointment: false }
  ];

  // Populate patient lists
  populatePatientList('waiting', waitingPatients);
  populatePatientList('examination', examinationPatients);
  populatePatientList('scheduled', scheduledPatients);
  populatePatientList('completed', completedPatients);
  populatePatientList('canceled', canceledPatients);
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

  // Add last appointment info
  document.getElementById('patient-last-diagnostic').textContent = patientDetails.visits[0].diagnosis;
  document.getElementById('last-appointment-date').textContent = formatDateSimple(patientDetails.visits[0].date);
  document.getElementById('last-appointment-type').textContent = patientDetails.visits[0].type;
  document.getElementById('last-appointment-treatment').textContent = patientDetails.visits[0].treatment;

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
  const searchInput = document.getElementById('search-input');
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
  closeAllModals();
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

// Medicament Page Initialization
function initializeMedicamentPage() {
  // Load mock medicament data
  loadMedicamentData();

  // Add event listeners for search
  const searchInput = document.getElementById('medicament-search');

  if (searchInput) {
    searchInput.addEventListener('input', filterMedicaments);
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
  const medications = [    { code: 'MED001', name: 'Amoxicillin 500mg', price: 12.50 },
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

function filterMedicaments() {
  const searchInput = document.getElementById('search-input');
  const rows = document.querySelectorAll('#medicament-list-body tr');

  if (!searchInput || !rows.length) return;

  const searchText = searchInput.value.toLowerCase();

  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase(); // Name column

    // Check if the row matches search
    const matchesSearch = name.includes(searchText);

    row.style.display = matchesSearch ? '' : 'none';
  });
}

// Fonctions pour la page de rapport
function initializeReportPage() {
  // Définir la date actuelle pour les champs de date
  const today = new Date();
  const dateStart = document.getElementById('date-start');
  const dateEnd = document.getElementById('date-end');
  
  if (dateStart && dateEnd) {
    dateStart.valueAsDate = today;
    dateEnd.valueAsDate = today;
  }
  
  // Gestionnaire pour le sélecteur de plage de dates
  const dateRangeSelector = document.getElementById('date-range-selector');
  const customDateRange = document.getElementById('custom-date-range');
  
  if (dateRangeSelector && customDateRange) {
    dateRangeSelector.addEventListener('change', function() {
      if (this.value === 'custom') {
        customDateRange.style.display = 'flex';
      } else {
        customDateRange.style.display = 'none';
        loadReportData(this.value);
      }
    });
  }
  
  // Gestionnaire pour le bouton d'application de plage personnalisée
  const applyDateRange = document.getElementById('apply-date-range');
  if (applyDateRange) {
    applyDateRange.addEventListener('click', function() {
      const start = dateStart.value;
      const end = dateEnd.value;
      if (start && end) {
        loadReportData('custom', { start, end });
      } else {
        alert('Veuillez sélectionner des dates de début et de fin valides');
      }
    });
  }
  
  // Gestionnaires pour les boutons d'exportation
  const exportPdfBtn = document.getElementById('export-pdf');
  const exportExcelBtn = document.getElementById('export-excel');
  
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', function() {
      alert('Exportation PDF en cours... (fonctionnalité à implémenter)');
    });
  }
  
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', function() {
      alert('Exportation Excel en cours... (fonctionnalité à implémenter)');
    });
  }
  
  // Charger les données initiales (aujourd'hui par défaut)
  loadReportData('day');
}

function loadReportData(timeRange, customDates) {
  // Simuler un chargement de données
  setTimeout(() => {
    // Générer des données aléatoires pour la démonstration
    const data = generateMockReportData(timeRange, customDates);
    
    // Mettre à jour les statistiques générales
    updateReportStats(data);
    
    // Générer les graphiques
    generateReportCharts(data);
    
    // Remplir le tableau des transactions
    populateTransactionsTable(data.transactions);
  }, 500);
}

function generateMockReportData(timeRange, customDates) {
  let totalPatients, completedAppointments, canceledAppointments, totalRevenue;
  const transactions = [];
  const dailyData = [];
  const appointmentTypes = {};
  
  // Générer des nombres aléatoires selon la plage de temps
  switch(timeRange) {
    case 'day':
      totalPatients = Math.floor(Math.random() * 20) + 10;
      completedAppointments = Math.floor(Math.random() * 15) + 5;
      canceledAppointments = Math.floor(Math.random() * 5) + 1;
      totalRevenue = (Math.random() * 1000 + 500).toFixed(2);
      
      // Générer des données horaires pour aujourd'hui
      for (let i = 9; i <= 17; i++) {
        dailyData.push({
          label: `${i}:00`,
          patients: Math.floor(Math.random() * 4) + 1,
          revenue: Math.floor(Math.random() * 200) + 50
        });
      }
      break;
      
    case 'week':
      totalPatients = Math.floor(Math.random() * 100) + 50;
      completedAppointments = Math.floor(Math.random() * 80) + 40;
      canceledAppointments = Math.floor(Math.random() * 20) + 5;
      totalRevenue = (Math.random() * 5000 + 2000).toFixed(2);
      
      // Générer des données quotidiennes pour la semaine
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      for (let i = 0; i < 7; i++) {
        dailyData.push({
          label: days[i],
          patients: Math.floor(Math.random() * 20) + 5,
          revenue: Math.floor(Math.random() * 1000) + 200
        });
      }
      break;
      
    case 'month':
      totalPatients = Math.floor(Math.random() * 400) + 200;
      completedAppointments = Math.floor(Math.random() * 350) + 150;
      canceledAppointments = Math.floor(Math.random() * 50) + 20;
      totalRevenue = (Math.random() * 20000 + 10000).toFixed(2);
      
      // Générer des données hebdomadaires pour le mois
      for (let i = 1; i <= 4; i++) {
        dailyData.push({
          label: `Semaine ${i}`,
          patients: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 5000) + 2000
        });
      }
      break;
      
    case 'custom':
      // Logique similaire pour les dates personnalisées
      totalPatients = Math.floor(Math.random() * 200) + 100;
      completedAppointments = Math.floor(Math.random() * 150) + 80;
      canceledAppointments = Math.floor(Math.random() * 30) + 10;
      totalRevenue = (Math.random() * 10000 + 5000).toFixed(2);
      
      // Générer des données pour la plage personnalisée
      const start = new Date(customDates.start);
      const end = new Date(customDates.end);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        dailyData.push({
          label: currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          patients: Math.floor(Math.random() * 20) + 5,
          revenue: Math.floor(Math.random() * 1000) + 200
        });
      }
      break;
  }
  
  // Générer des types de consultations aléatoires
  appointmentTypes['Consultation régulière'] = Math.floor(Math.random() * completedAppointments * 0.4) + Math.floor(completedAppointments * 0.2);
  appointmentTypes['Urgence'] = Math.floor(Math.random() * completedAppointments * 0.2) + Math.floor(completedAppointments * 0.1);
  appointmentTypes['Suivi'] = Math.floor(Math.random() * completedAppointments * 0.3) + Math.floor(completedAppointments * 0.15);
  appointmentTypes['Spécialiste'] = completedAppointments - (appointmentTypes['Consultation régulière'] + appointmentTypes['Urgence'] + appointmentTypes['Suivi']);
  
  // Générer des transactions aléatoires
  const patientNames = [
    'Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Petit', 'Thomas Dubois',
    'Julie Lambert', 'Nicolas Moreau', 'Camille Leroy', 'Antoine Robert', 'Émilie Simon'
  ];
  
  const appointmentTypesList = ['Consultation régulière', 'Urgence', 'Suivi', 'Spécialiste'];
  const statusOptions = ['Terminé', 'Annulé'];
  
  // Générer un nombre de transactions égal au total des patients
  for (let i = 0; i < totalPatients; i++) {
    const isCompleted = Math.random() > 0.2; // 80% de chance d'être terminé
    const type = appointmentTypesList[Math.floor(Math.random() * appointmentTypesList.length)];
    const status = isCompleted ? 'Terminé' : 'Annulé';
    const amount = isCompleted ? Math.floor(Math.random() * 150) + 50 : 0;
    
    // Générer une date aléatoire selon la plage
    let transactionDate;
    const today = new Date();
    
    switch(timeRange) {
      case 'day':
        // Aujourd'hui avec des heures différentes
        transactionDate = new Date(today);
        transactionDate.setHours(Math.floor(Math.random() * 8) + 9); // Entre 9h et 17h
        transactionDate.setMinutes(Math.floor(Math.random() * 60));
        break;
        
      case 'week':
        // Cette semaine
        transactionDate = new Date(today);
        transactionDate.setDate(today.getDate() - Math.floor(Math.random() * 7));
        break;
        
      case 'month':
        // Ce mois
        transactionDate = new Date(today);
        transactionDate.setDate(Math.floor(Math.random() * 30) + 1);
        break;
        
      case 'custom':
        // Entre les dates personnalisées
        const start = new Date(customDates.start);
        const end = new Date(customDates.end);
        const timeRange = end.getTime() - start.getTime();
        const randomTime = Math.random() * timeRange;
        transactionDate = new Date(start.getTime() + randomTime);
        break;
    }
    
    transactions.push({
      date: transactionDate,
      patient: patientNames[Math.floor(Math.random() * patientNames.length)],
      type: type,
      status: status,
      amount: amount
    });
  }
  
  // Trier les transactions par date
  transactions.sort((a, b) => b.date - a.date);
  
  return {
    totalPatients,
    completedAppointments,
    canceledAppointments,
    totalRevenue,
    transactions,
    dailyData,
    appointmentTypes
  };
}

function updateReportStats(data) {
  document.getElementById('total-patients').textContent = data.totalPatients;
  document.getElementById('completed-appointments').textContent = data.completedAppointments;
  document.getElementById('canceled-appointments').textContent = data.canceledAppointments;
  document.getElementById('total-revenue').textContent = data.totalRevenue + ' €';
}

function generateReportCharts(data) {
  // Graphique des revenus
  const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
  
  // Détruire le graphique s'il existe déjà
  if (window.revenueChart) {
    window.revenueChart.destroy();
  }
  
  window.revenueChart = new Chart(revenueCtx, {
    type: 'bar',
    data: {
      labels: data.dailyData.map(item => item.label),
      datasets: [
        {
          label: 'Revenus (€)',
          data: data.dailyData.map(item => item.revenue),
          backgroundColor: 'rgba(46, 139, 87, 0.7)',
          borderColor: 'rgba(46, 139, 87, 1)',
          borderWidth: 1
        },
        {
          label: 'Patients',
          data: data.dailyData.map(item => item.patients),
          backgroundColor: 'rgba(88, 208, 245, 0.7)',
          borderColor: 'rgba(88, 208, 245, 1)',
          borderWidth: 1,
          type: 'line'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Graphique des types de consultations
  const typesCtx = document.getElementById('appointment-types-chart').getContext('2d');
  
  // Détruire le graphique s'il existe déjà
  if (window.typesChart) {
    window.typesChart.destroy();
  }
  
  window.typesChart = new Chart(typesCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(data.appointmentTypes),
      datasets: [{
        data: Object.values(data.appointmentTypes),
        backgroundColor: [
          'rgba(46, 139, 87, 0.7)',
          'rgba(88, 208, 245, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)'
        ],
        borderColor: [
          'rgba(46, 139, 87, 1)',
          'rgba(88, 208, 245, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

function populateTransactionsTable(transactions) {
  const tbody = document.getElementById('transactions-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    
    // Formater la date
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Déterminer la classe pour le statut
    const statusClass = transaction.status === 'Terminé' ? 'status-active' : 'status-inactive';
    
    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${transaction.patient}</td>
      <td>${transaction.type}</td>
      <td><span class="status-badge ${statusClass}">${transaction.status}</span></td>
      <td>${transaction.amount} €</td>
    `;
    
    tbody.appendChild(row);
  });
}