"use client";
import { useEffect, useState } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence";
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import Modal from './modal';
import ModalPrecos from './modalPrecos';
import ModalPessoas from './modalPessoas';
import ModalRoutes from './modalRoutes';

const eventsServicePlugin = createEventsServicePlugin();

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
}

function createLinkForBackend() {
  return "http://localhost:9000"
}


function CalendarApp() {
  let eventsArr: Event[] = [];


  function clear_all_events() {
    eventsArr = [];
    calendar.events.getAll().forEach((event) => {
      calendar.events.remove(event.id);
    });
  }


  function setEventsArr(events: Event[]) {
    clear_all_events();
    eventsArr = events;
    for (let i = 0; i < eventsArr.length; i++) {
      calendar.events.add(eventsArr[i]);
    }
  }

  const calendar = useCalendarApp({
    defaultView: 'monthAgenda',
    weekOptions: {
      nDays: 5,
      gridHeight: 2400,
    },
    callbacks: {
      isCalendarSmall($app) {
        return $app.elements.calendarWrapper?.clientWidth! < 500
      },
    },
    locale: 'pt-BR',
    dayBoundaries: {
      start: '08:00',
      end: '22:00',
    },
    views: [createViewMonthGrid(), createViewDay(), createViewWeek(), createViewMonthAgenda()],
    events: eventsArr,
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
      createEventRecurrencePlugin(),
      eventsServicePlugin,
      createCurrentTimePlugin(),
    ],
  });

  function call_backend_add_all_events() {
    fetch(createLinkForBackend() + '/getEvents', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {

        if (data && Array.isArray(data)) {
          const newEvents = data.map(event => ({
            id: event.id.toString(),
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description
          }));
          setEventsArr(newEvents);
        } else {
          console.error('Invalid data received');
          setEventsArr([]);
        }
      });
  }



  useEffect(() => {
    const date = new Date();

    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    call_backend_add_all_events();
  }, []);



  return (
    <div className="p-4 bg-white h-screen">
      <div className="flex max-w-6xl mx-auto justify-between mb-4">
        <Modal onEventsChange={(events) => setEventsArr(events)} />
        <ModalPessoas />
        <ModalRoutes />
        <ModalPrecos eventsArr={eventsArr} />
      </div>
      <div className="max-w-6xl mx-auto">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  )
}

export default CalendarApp;
