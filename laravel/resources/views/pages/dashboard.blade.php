
@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="dashboard">
    <div class="dashboard-container">
        <div class="patient-status-container">
            @include('components.status-card', ['id' => 'scheduled', 'icon' => 'calendar-check', 'title' => 'Programmé'])
            @include('components.status-card', ['id' => 'waiting', 'icon' => 'clock', 'title' => 'Salle d\'attente'])
            @include('components.status-card', ['id' => 'preparing', 'icon' => 'clipboard-list', 'title' => 'En préparation'])
            @include('components.status-card', ['id' => 'examination', 'icon' => 'stethoscope', 'title' => 'En consultation'])
        </div>
        
        @include('components.calendar-widget')
        
        <div class="dashboard-bottom">
            @include('components.status-card', ['id' => 'completed', 'icon' => 'check-circle', 'title' => 'Terminé Aujourd\'hui'])
            @include('components.status-card', ['id' => 'canceled', 'icon' => 'ban', 'title' => 'Annulé'])
        </div>
    </div>
</div>
@endsection
