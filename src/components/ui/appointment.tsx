"use client";
// pages/appointments.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Calendar, Clock, User, Home, MessageSquare, FileText, Users, ChevronLeft, ChevronRight, Edit, X } from 'lucide-react';

interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  hasDot: boolean;
  isSelected?: boolean;
  date: Date;
}

interface Appointment {
  id: number;
  date: Date;
  time: string;
  title: string;
  person: string;
  department: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  color: string;
}

export default function AppointmentsPage(): JSX.Element {
  // Current date state
  const [today] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<string>('2 weeks');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  
  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    person: '',
    department: '',
    time: '09:00',
    status: 'Pending'
  });

  // Appointments data state
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: new Date(2025, 2, 20), // March 20, 2025
      time: '11:30 AM',
      title: 'Personal Loan Discussion',
      person: 'Ms. Emma Rodriguez',
      department: 'Loan Services',
      status: 'Confirmed',
      color: 'blue'
    },
    {
      id: 2,
      date: new Date(2025, 3, 2), // April 2, 2025
      time: '3:45 PM',
      title: 'Account Opening Appointment',
      person: 'Mr. David Lee',
      department: 'Personal Banking',
      status: 'Pending',
      color: 'orange'
    },
    {
      id: 3,
      date: new Date(2025, 3, 15), // April 15, 2025
      time: '10:00 AM',
      title: 'Home Loan Consultation',
      person: 'Ms. Lisa Brown',
      department: 'Mortgage Services',
      status: 'Confirmed',
      color: 'blue'
    }
  ]);

  // Generate calendar days based on current month view
  useEffect(() => {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Get the first day to display (might be from previous month)
    const firstDayToDisplay = new Date(firstDayOfMonth);
    firstDayToDisplay.setDate(firstDayToDisplay.getDate() - firstDayToDisplay.getDay());
    
    // Create 42 days (6 weeks)
    const appointmentDates = appointments.map(app => app.date.toDateString());
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(firstDayToDisplay);
      currentDate.setDate(firstDayToDisplay.getDate() + i);
      
      days.push({
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === currentMonth.getMonth(),
        hasDot: appointmentDates.includes(currentDate.toDateString()),
        isSelected: currentDate.toDateString() === selectedDate.toDateString(),
        date: new Date(currentDate)
      });
      
      // Break after we've shown the last day of the month and completed the week
      if (currentDate.getMonth() > currentMonth.getMonth() && currentDate.getDay() === 6) {
        break;
      }
    }
    
    setCalendarDays(days);
  }, [currentMonth, selectedDate, appointments]);

  // Format date helpers
  const formatMonth = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const formatDay = (date: Date): string => {
    return date.getDate().toString().padStart(2, '0');
  };
  
  const formatMonthShort = (date: Date): string => {
    return date.toLocaleString('default', { month: 'short' });
  };

  // Calendar navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };

  // Appointment handlers
  const openAddAppointmentModal = () => {
    setModalMode('add');
    setFormData({
      title: '',
      person: '',
      department: '',
      time: '09:00',
      status: 'Pending'
    });
    setShowModal(true);
  };
  
  const openEditAppointmentModal = (appointment: Appointment) => {
    setModalMode('edit');
    setCurrentAppointment(appointment);
    
    // Convert 12-hour format to 24-hour for input
    let timeFor24 = appointment.time;
    if (appointment.time.includes('AM') || appointment.time.includes('PM')) {
      const [time, period] = appointment.time.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      timeFor24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    setFormData({
      title: appointment.title,
      person: appointment.person,
      department: appointment.department,
      time: timeFor24,
      status: appointment.status
    });
    setShowModal(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert 24-hour time input to 12-hour format for display
    const timeDate = new Date();
    const [hours, minutes] = formData.time.split(':').map(Number);
    timeDate.setHours(hours, minutes);
    const formattedTime = timeDate.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    });
    
    if (modalMode === 'add') {
      // Add new appointment
      const newAppointment: Appointment = {
        id: Date.now(),
        date: new Date(selectedDate),
        time: formattedTime,
        title: formData.title,
        person: formData.person,
        department: formData.department,
        status: formData.status as 'Confirmed' | 'Pending' | 'Cancelled',
        color: formData.status === 'Confirmed' ? 'blue' : 'orange'
      };
      
      setAppointments(prev => [...prev, newAppointment]);
    } else if (modalMode === 'edit' && currentAppointment) {
      // Update existing appointment
      setAppointments(prev => 
        prev.map(app => 
          app.id === currentAppointment.id 
            ? {
                ...app,
                title: formData.title,
                person: formData.person,
                department: formData.department,
                time: formattedTime,
                status: formData.status as 'Confirmed' | 'Pending' | 'Cancelled',
                color: formData.status === 'Confirmed' ? 'blue' : 'orange'
              } 
            : app
        )
      );
    }
    
    setShowModal(false);
  };
  
  const handleCancelAppointment = (id: number) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: 'Cancelled', color: 'gray' }
          : app
      )
    );
  };
  
  const handleDeleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter(
    app => app.date.toDateString() === selectedDate.toDateString() && app.status !== 'Cancelled'
  );
  
  // Filter all upcoming appointments
  const upcomingAppointments = appointments.filter(
    app => app.date >= today && app.status !== 'Cancelled'
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Head>
        <title>Banking Appointments</title>
        <meta name="description" content="Schedule and manage your banking appointments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white py-4 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Banking Appointments</h1>
          <Calendar className="text-pink-500 w-6 h-6" />
        </div>
      </header>

      {/* Calendar Section */}
      <section className="px-4 py-6 bg-white mx-4 my-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-medium text-lg">{formatMonth(currentMonth)}</h2>
            <button className="text-gray-500" onClick={goToNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm">
            <select 
              className="bg-transparent outline-none" 
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          <div className="text-sm font-medium">Sun</div>
          <div className="text-sm font-medium">Mon</div>
          <div className="text-sm font-medium">Tue</div>
          <div className="text-sm font-medium">Wed</div>
          <div className="text-sm font-medium">Thu</div>
          <div className="text-sm font-medium">Fri</div>
          <div className="text-sm font-medium">Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 relative cursor-pointer ${
                day.isSelected ? 'bg-pink-500 text-white rounded-full' : 
                day.isCurrentMonth ? 'text-black hover:bg-gray-100' : 'text-gray-400'
              }`}
              onClick={() => handleDayClick(day)}
            >
              {day.day}
              {day.hasDot && !day.isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Selected Date Appointments */}
      <section className="px-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <button 
            onClick={openAddAppointmentModal}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add Appointment
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500">
            No appointments scheduled for this date.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{appointment.title}</h3>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditAppointmentModal(appointment)}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
          </section>
    
          {/* Upcoming Appointments Section */}
          <section className="flex-1 px-4  pb-16">
            <h2 className="flex items-center text-lg font-medium mb-4">
              <Clock className="text-pink-500 w-5 h-5 mr-2" />
              Upcoming Appointments
            </h2>
    
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className={`bg-white rounded-lg overflow-hidden shadow-sm border-l-4 ${
                    appointment.color === 'blue' ? 'border-blue-500' : 
                    appointment.color === 'orange' ? 'border-orange-500' : 'border-gray-300'
                  }`}
                >
                  <div className="flex">
                    <div className="w-20 bg-gray-50 flex flex-col items-center justify-center py-4">
                      <span className="text-2xl font-bold">{formatDay(appointment.date)}</span>
                      <span className="text-gray-500">{formatMonthShort(appointment.date)}</span>
                      <span className="text-gray-500 text-sm mt-2">{appointment.time}</span>
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-medium text-lg">{appointment.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <User className="w-4 h-4 mr-1" />
                        <span>{appointment.person}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <Home className="w-4 h-4 mr-1" />
                        <span>{appointment.department}</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <span 
                            className={`px-3 py-1 rounded-full text-sm ${
                              appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' : 
                              'bg-orange-100 text-orange-600'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex space-x-3">
                          <button 
                            className="flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => openEditAppointmentModal(appointment)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Reschedule
                          </button>
                          <button 
                            className="flex items-center text-red-500 hover:text-red-700"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
    
              {upcomingAppointments.length === 0 && (
                <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                  No upcoming appointments scheduled.
                </div>
              )}
            </div>
          </section>
    
    
          {/* Modal for Add/Edit Appointment */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-medium text-lg">
                    {modalMode === 'add' ? 'Add New Appointment' : 'Edit Appointment'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Person
                    </label>
                    <input
                      type="text"
                      name="person"
                      value={formData.person}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-500 text-white rounded-md"
                    >
                      {modalMode === 'add' ? 'Add Appointment' : 'Update Appointment'}
                    </button>
                    
                    {modalMode === 'edit' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentAppointment) handleDeleteAppointment(currentAppointment.id);
                          setShowModal(false);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }