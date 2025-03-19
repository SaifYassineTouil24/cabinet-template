
<div class="header-container">
  <div class="breadcrumb-container">
    <i class="fas fa-compass"></i>
    <div id="page-breadcrumb">
      @yield('breadcrumb')
    </div>
  </div>
  
  <div class="header-actions">
    <div class="search-box" id="header-search">
      <i class="fas fa-search"></i>
      <input type="text" id="search-input" placeholder="Search...">
    </div>
    
    <div class="clock">
      <i class="fas fa-clock"></i>
      <span id="live-clock">00:00:00</span>
    </div>
    
    <button class="header-btn add-patient" onclick="window.location.href='{{ route('patients.create') }}'">
      <i class="fas fa-user-plus"></i>
      <span>Ajouter Patient</span>
    </button>
    
    <button class="header-btn add-appointment">
      <i class="fas fa-calendar-plus"></i>
      <span>Ajouter Rendez-vous</span>
    </button>

    <div class="notifications">
      <i class="fas fa-bell"></i>
      <span class="notification-badge">3</span>
    </div>
    
    <div class="user-info">
      <div class="user-details">
        <span class="user-name">Dr. Smith</span>
        <span class="user-role">Administrator</span>
      </div>
      <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Profile">
    </div>
  </div>
</div>
