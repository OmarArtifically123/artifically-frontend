"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Target, 
  Users, 
  Mail, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Clapperboard,
  Headphones,
  MessageCircle
} from 'lucide-react';

// Icon fallbacks
const Clock = Target;
const User = Users;
const ArrowLeft = ({ className, ...props }: { className?: string; size?: number; strokeWidth?: number }) => (
  <ChevronDown className={`${className} rotate-90`} {...props} />
);
const Video = Clapperboard;
const Phone = Headphones;
const MessageSquare = MessageCircle;

// Types
interface TimeSlot {
  time: string;
  available: boolean;
  timezone: string;
}

interface CalendarDay {
  date: Date;
  slots: TimeSlot[];
  isToday: boolean;
  isSelected: boolean;
}

interface BookingForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  meetingType: 'demo' | 'consultation' | 'support';
  duration: 15 | 30 | 45 | 60;
  notes: string;
}

interface CalendarBookingProps {
  type?: 'demo' | 'consultation' | 'support';
  duration?: 15 | 30 | 45 | 60;
  onBooked?: (booking: BookingData) => void;
}

interface BookingData {
  id: string;
  date: Date | null;
  time?: string;
  duration: number;
  type: string;
  attendee: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  notes: string;
  meetingLink: string;
  status: string;
  calendarLink?: string;
}

export default function CalendarBooking({ 
  type = 'demo', 
  duration = 30,
  onBooked 
}: CalendarBookingProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState<'calendar' | 'form' | 'confirmation'>('calendar');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    meetingType: type,
    duration: duration,
    notes: ''
  });
  const [booking, setBooking] = useState<BookingData | null>(null);

  // Generate calendar data
  const generateCalendarDays = useCallback(() => {
    const days: CalendarDay[] = [];
    const today = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Add previous month's trailing days
    const startWeekday = startDate.getDay();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - i - 1);
      days.push({
        date,
        slots: [],
        isToday: false,
        isSelected: false
      });
    }

    // Add current month's days
    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      
      // Generate time slots for business days (Mon-Fri)
      const dayOfWeek = date.getDay();
      const slots: TimeSlot[] = [];
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && date >= today) {
        // Business hours: 9 AM - 5 PM
        for (let hour = 9; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += duration) {
            if (hour === 16 && minute + duration > 60) break; // Don't go past 5 PM
            
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const slotDate = new Date(date);
            slotDate.setHours(hour, minute);
            
            // Mark as unavailable if in the past or randomly unavailable (simulation)
            const isPast = slotDate < new Date();
            const randomlyUnavailable = Math.random() < 0.3; // 30% unavailable
            
            slots.push({
              time: timeString,
              available: !isPast && !randomlyUnavailable,
              timezone: 'EST'
            });
          }
        }
      }

      days.push({
        date,
        slots,
        isToday,
        isSelected
      });
    }

    // Add next month's leading days
    const endWeekday = endDate.getDay();
    for (let i = 1; i < 7 - endWeekday; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() + i);
      days.push({
        date,
        slots: [],
        isToday: false,
        isSelected: false
      });
    }

    return days;
  }, [currentDate, selectedDate, duration]);

  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    setCalendarDays(generateCalendarDays());
  }, [currentDate, generateCalendarDays, selectedDate, duration]);

  // Handle date selection
  const handleDateSelect = (day: CalendarDay) => {
    if (day.slots.length === 0) return;
    setSelectedDate(day.date);
    setSelectedSlot(null);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep('form');
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingPayload = {
        date: selectedDate?.toISOString(),
        time: selectedSlot?.time,
        timezone: selectedSlot?.timezone,
        duration: formData.duration,
        type: formData.meetingType,
        attendee: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone
        },
        notes: formData.notes
      };

      const response = await fetch('/api/v1/calendar/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      const bookingData = {
        id: result.bookingId,
        date: selectedDate,
        time: selectedSlot?.time,
        duration: formData.duration,
        type: formData.meetingType,
        attendee: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone
        },
        notes: formData.notes,
        meetingLink: result.meetingLink,
        status: 'confirmed',
        calendarLink: result.calendarLink
      };

      setBooking(bookingData);
      setStep('confirmation');
      
      // Track booking completion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'booking_completed', {
          event_category: 'Calendar',
          event_label: formData.meetingType,
          value: 1,
          custom_parameters: {
            booking_id: result.bookingId,
            meeting_type: formData.meetingType,
            duration: formData.duration
          }
        });
      }
      
      if (onBooked) {
        onBooked(bookingData);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book meeting';
      console.error('Booking error:', error);
      alert(errorMessage + '. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const meetingTypeConfig = {
    demo: {
      title: 'Product Demo',
      description: 'See Artifically in action with a personalized walkthrough',
      icon: Clapperboard,
      color: 'bg-blue-500'
    },
    consultation: {
      title: 'Strategy Consultation',
      description: 'Discuss your automation goals with our experts',
      icon: MessageCircle,
      color: 'bg-green-500'
    },
    support: {
      title: 'Technical Support',
      description: 'Get help with implementation and technical questions',
      icon: Headphones,
      color: 'bg-purple-500'
    }
  };

  const currentConfig = meetingTypeConfig[formData.meetingType];

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${currentConfig.color} text-white p-6`}>
        <div className="flex items-center gap-3 mb-2">
          <currentConfig.icon className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{currentConfig.title}</h2>
        </div>
        <p className="text-white/90">{currentConfig.description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formData.duration} minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            <span>Video call</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Select a date
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                      <span className="font-medium text-slate-900 dark:text-white min-w-[120px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </span>
                      <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {weekDays.map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
                      const hasSlots = day.slots.length > 0;
                      const availableSlots = day.slots.filter(slot => slot.available).length;

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(day)}
                          disabled={!hasSlots || availableSlots === 0}
                          className={`
                            p-2 text-sm rounded-lg transition-colors
                            ${isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400'}
                            ${day.isToday ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300' : ''}
                            ${day.isSelected ? 'bg-blue-500 text-white' : ''}
                            ${hasSlots && availableSlots > 0 && !day.isSelected
                              ? 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                              : ''
                            }
                            ${!hasSlots || availableSlots === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div>{day.date.getDate()}</div>
                          {hasSlots && availableSlots > 0 && (
                            <div className="text-xs text-green-500 font-medium">
                              {availableSlots} slots
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    {selectedDate ? (
                      <>Available times for {selectedDate.toLocaleDateString()}</>
                    ) : (
                      'Select a date to see available times'
                    )}
                  </h3>

                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                      {calendarDays
                        .find(day => day.date.toDateString() === selectedDate.toDateString())
                        ?.slots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={!slot.available}
                            className={`
                              p-3 text-sm rounded-lg border transition-colors
                              ${slot.available
                                ? 'border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                              }
                            `}
                          >
                            {slot.time} {slot.timezone}
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Choose a date to see available time slots</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setStep('calendar')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Enter your details
                  </h3>
                </div>

                {/* Booking Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <div>📅 {selectedDate?.toLocaleDateString()}</div>
                    <div>🕐 {selectedSlot?.time}</div>
                    <div>⏱️ {formData.duration} min</div>
                    <div className="capitalize">📋 {formData.meetingType}</div>
                  </div>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="John Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="Acme Corp"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      What would you like to discuss?
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                      placeholder="Tell us about your automation goals, current challenges, or specific questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${currentConfig.color} text-white p-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Confirming booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && booking && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Booking Confirmed!
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-6 text-left">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Meeting Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{booking.date?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{booking.time} EST ({booking.duration} minutes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-slate-500" />
                    <a
                      href={booking.meetingLink}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join video call
                    </a>
                  </div>
                  {booking.calendarLink && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <a
                        href={booking.calendarLink}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add to calendar
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{booking.attendee.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{booking.attendee.email}</span>
                  </div>
                </div>
              </div>

              <div className="text-slate-600 dark:text-slate-400 mb-6">
                <p className="mb-2">
                  📧 A calendar invite and meeting details have been sent to your email.
                </p>
                <p>
                  📱 You'll receive a reminder 1 hour before the meeting.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setStep('calendar');
                    setSelectedDate(null);
                    setSelectedSlot(null);
                    setBooking(null);
                    setFormData({
                      name: '',
                      email: '',
                      company: '',
                      phone: '',
                      meetingType: type,
                      duration: duration,
                      notes: ''
                    });
                  }}
                  className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Schedule Another
                </button>
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-2 ${currentConfig.color} text-white rounded-lg hover:opacity-90`}
                >
                  Test Meeting Link
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
