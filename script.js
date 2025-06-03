let eventStorage = {};

function saveEvents(){
    localStorage.setItem('savedtasks', JSON.stringify(eventStorage));
}

function loadEvents() {
            const saved = localStorage.getItem('savedtasks');
            return saved ? JSON.parse(saved) : {};
        }

class Calendar {
            constructor() {
                this.currentDate = new Date();
                this.events = loadEvents();
                this.init();
            }

            init() {
                this.render();
            }

            render() {
                this.renderHeader();
                this.renderCalendar();
            }

            renderHeader() {
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                const header = document.getElementById('monthYear');
                header.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
            }

            renderCalendar() {
                const calendar = document.getElementById('calendar');
                calendar.innerHTML = '';

                // Add day headers
                const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayHeaders.forEach(day => {
                    const headerCell = document.createElement('div');
                    headerCell.className = 'bg-gradient-to-r from-red-500 to-indigo-600 text-white p-3 text-center font-semibold text-sm rounded-t-lg';
                    headerCell.textContent = day;
                    calendar.appendChild(headerCell);
                });

                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startingDayOfWeek = firstDay.getDay();

                for (let i = 0; i < startingDayOfWeek; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'day-cell other-month bg-gray-50 border border-gray-200 p-2 opacity-50';
                    calendar.appendChild(emptyCell);
                }

                for (let day = 1; day <= daysInMonth; day++) {
                    const dayCell = document.createElement('div');
                    const dateKey = `${year}-${month}-${day}`;
                    const dayEvents = this.events[dateKey] || [];

                    let cellClasses = 'day-cell bg-white border border-gray-200 p-2 relative hover:bg-gray-50';

                    if (dayEvents.length > 0) {
                        cellClasses += ' border-l-4 border-l-blue-500 bg-blue-50';
                    }

                    dayCell.className = cellClasses;

                    const dayNumber = document.createElement('div');
                    dayNumber.className = 'day-number text-gray-800 text-sm mb-1';
                    dayNumber.textContent = day;
                    dayCell.appendChild(dayNumber);

                    if (dayEvents.length > 0) {
                        const indicator = document.createElement('div');
                        indicator.className = 'event-indicator bg-blue-500 absolute top-1 right-1';
                        dayCell.appendChild(indicator);
                    }

                    if (dayEvents.length > 0) {
                        const eventList = document.createElement('div');
                        eventList.className = 'space-y-1';

                        dayEvents.forEach((event, index) => {
                            const eventItem = document.createElement('div');
                            eventItem.className = 'event-item bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs border border-blue-200 hover:bg-blue-200';
                            eventItem.textContent = event.length > 12 ? event.substring(0, 12) + '...' : event;
                            eventItem.title = event;

                            eventItem.addEventListener('click', (e) => {
                                e.stopPropagation();
                                this.deleteEvent(dateKey, index);
                            });

                            eventList.appendChild(eventItem);
                        });

                        dayCell.appendChild(eventList);
                    }

                    dayCell.addEventListener('click', () => {
                        this.addEvent(dateKey, day);
                    });

                    calendar.appendChild(dayCell);
                }

                const totalCells = calendar.children.length;
                const remainingCells = 42 - totalCells; 
                for (let i = 0; i < remainingCells; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'day-cell other-month bg-gray-50 border border-gray-200 p-2 opacity-50';
                    calendar.appendChild(emptyCell);
                }
            }

            addEvent(dateKey, day) {
                const event = prompt(`Add an event for day ${day}:`);
                if (event && event.trim()) {
                    if (!this.events[dateKey]) {
                        this.events[dateKey] = [];
                    }
                    this.events[dateKey].push(event.trim());
                    eventStorage = this.events;
                    saveEvents();
                    this.render();

                    this.showToast('Event added successfully!', 'success');
                }
            }

            deleteEvent(dateKey, eventIndex) {
                const event = this.events[dateKey][eventIndex];
                if (confirm(`Delete event: "${event}"?`)) {
                    this.events[dateKey].splice(eventIndex, 1);
                    if (this.events[dateKey].length === 0) {
                        delete this.events[dateKey];
                    }
                    eventStorage = this.events;
                    saveEvents();
                    this.render();

                    this.showToast('Event deleted successfully!', 'danger');
                }
            }

            showToast(message, type) {
                let toastContainer = document.getElementById('toast-container');
                if (!toastContainer) {
                    toastContainer = document.createElement('div');
                    toastContainer.id = 'toast-container';
                    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
                    toastContainer.style.zIndex = '9999';
                    document.body.appendChild(toastContainer);
                }

                const toastId = 'toast-' + Date.now();
                const toastHTML = `
                    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
                        <div class="d-flex">
                            <div class="toast-body">
                                ${message}
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                    </div>
                `;

                toastContainer.insertAdjacentHTML('beforeend', toastHTML);

                const toastElement = document.getElementById(toastId);
                const toast = new bootstrap.Toast(toastElement);
                toast.show();

                toastElement.addEventListener('hidden.bs.toast', () => {
                    toastElement.remove();
                });
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new Calendar();
        });
