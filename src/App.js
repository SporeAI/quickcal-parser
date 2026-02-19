import React, { useState } from 'react';
import * as chrono from 'chrono-node';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

function App() {
  const [inputText, setInputText] = useState('');
  const [events, setEvents] = useState([]);

  const parseText = (text) => {
    const parsedDates = chrono.parse(text);
    const newEvents = parsedDates.map((parsed) => {
      const startDate = parsed.start.date();
      const endDate = parsed.end ? parsed.end.date() : new Date(startDate.getTime() + 60 * 60 * 1000);
      
      return {
        title: text.substring(Math.max(0, parsed.index - 30), parsed.index + parsed.text.length + 30).trim(),
        start: startDate,
        end: endDate,
        originalText: parsed.text,
      };
    });
    setEvents(newEvents);
  };

  const addToCalendar = (event) => {
    const startTime = format(event.start, "yyyy-MM-dd'T'HH:mm:ss");
    const endTime = format(event.end, "yyyy-MM-dd'T'HH:mm:ss");
    const title = encodeURIComponent(event.title);
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}`;
    window.open(url, '_blank');
  };

  const removeEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">QuickCal Parser</h1>
                <div className="mb-4">
                  <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    rows="4"
                    placeholder="Paste your text here..."
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      parseText(e.target.value);
                    }}
                  ></textarea>
                </div>

                {events.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Detected Events:</h2>
                    <div className="space-y-4">
                      {events.map((event, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <CalendarIcon className="h-5 w-5 mr-1" />
                              <span>{format(event.start, 'PPP')}</span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <ClockIcon className="h-5 w-5 mr-1" />
                              <span>{format(event.start, 'p')} - {format(event.end, 'p')}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => addToCalendar(event)}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              Add to Calendar
                            </button>
                            <button
                              onClick={() => removeEvent(index)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;