import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface WorkoutEntry {
  userName: string;
  workoutType: string;
  workoutMinutes: number;
}

@Component({
  selector: 'app-root',
  template: `
    <nav class="z-10 bg-white  sticky top-0  shadow-md">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-shrink-0 items-center">
            <img
              class="h-8 w-auto"
              src="https://www.fylehq.com/assets/images/svg-images/fylelogo.svg"
              alt="Your Company"
            />
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="heading">
        <h1 class="text-2xl font-bold text-red-500  mb-4 ">
          Health Challenge Tracker
        </h1>
      </div>

      <form #workoutForm="ngForm" (ngSubmit)="onSubmit(workoutForm)">
        <div class="w-full max-w-5xl mx-auto p-8">
          <div
            class=" w-full bg-white dark:bg-white-100 p-8 rounded-lg shadow-md border "
          >
            <h1 class="text-2xl font-bold text-gray-800 dark:text-black mb-4">
              USER
            </h1>

            <!-- Shipping Address -->
            <div class="mb-6">
              <div>
                <label
                  for="userName"
                  class="block text-gray-700 dark:text-white mb-1"
                  >Name</label
                >
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  class="w-full rounded-lg border py-2 px-3 dark:bg-white dark:text-black dark:border-none"
                  [(ngModel)]="userName"
                  required
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="mt-4">
                  <label
                    for="workoutType"
                    class="block text-red-700 dark:text-white mb-1"
                    >Workout Type*</label
                  >
                  <select
                    id="workoutType"
                    class="w-full rounded-lg border py-2 px-3 dark:bg-white dark:text-black dark:border-none"
                    name="workoutType"
                    [(ngModel)]="workoutType"
                    required
                  >
                    <option value="">Select a workout type</option>
                    <option
                      *ngFor="let type of availableWorkoutTypes"
                      [value]="type"
                    >
                      {{ type }}
                    </option>
                  </select>
                </div>

                <div class="mt-4">
                  <label
                    for="workoutMinutes"
                    class="block text-gray-700 dark:text-white mb-1"
                    >Workout Minutes</label
                  >
                  <input
                    type="number"
                    id="workoutMinutes"
                    name="workoutMinutes"
                    class="w-full rounded-lg border py-2 px-3 dark:bg-white dark:text-black dark:border-none"
                    [(ngModel)]="workoutMinutes"
                  />
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                class="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-900"
                type="submit"
                [disabled]="!workoutForm.form.valid"
              >
                Add Workout
              </button>
            </div>
          </div>
        </div>
      </form>

      <div class="w-full max-w-5xl mx-auto p-8">
        <div
          class="w-full bg-white dark:bg-white-100 p-8 rounded-lg shadow-md border"
        >
          <h1 class="text-2xl font-bold text-gray-800 dark:text-black mb-4">
            Workout List
          </h1>
          <div class="filters">
            <input
              type="text"
              placeholder="Search by name"
              [(ngModel)]="searchTerm"
              (ngModelChange)="applyFilters()"
            />
            <select [(ngModel)]="filterType" (ngModelChange)="applyFilters()">
              <option value="">All Workout Types</option>
              <option *ngFor="let type of availableWorkoutTypes" [value]="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div class="relative overflow-x-auto shadow-md sm:rounded-lg border">
            <table
              class=" table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-white dark:bg-gray-100 dark:text-gray-600"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Name</th>
                  <th scope="col" class="px-6 py-3">Workouts</th>
                  <th scope="col" class="px-6 py-3">Number of Workouts</th>
                  <th scope="col" class="px-6 py-3">Total Workout Minutes</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="bg-white border-b dark:bg-white dark:border-gray-300 hover:bg-red-300 overflow-hidden truncate ..."
                  *ngFor="let entry of paginatedEntries"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium whitespace-nowrap overflow-hidden truncate ... "
                  >
                    {{ entry.userName }}
                  </th>
                  <td class="px-6 py-4">{{ entry.workoutType }}</td>
                  <td class="px-6 py-4">
                    {{ getNumberOfWorkouts(entry.userName) }}
                  </td>
                  <td class="px-6 py-4">
                    {{ getTotalWorkoutMinutes(entry.userName) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <nav
              class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
              aria-label="Table navigation"
            ></nav>
          </div>

          <div
            class=" max-w-2xl mx-auto grid grid-cols-4 gap-4 p-8  items-center justify-center"
          >
            <select
              class=" flex items-center justify-center px-3  h-10 ms-0 leading-tight"
              [(ngModel)]="itemsPerPage"
              (ngModelChange)="applyFilters()"
            >
              <option [value]="5">5 per page</option>
              <option [value]="10">10 per page</option>
              <option [value]="20">20 per page</option>
            </select>
            <button
              (click)="changePage(-1)"
              [disabled]="currentPage === 1"
              class="flex items-center justify-center px-3 h-10 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              &lt; Previous
            </button>
            <a
              class="flex items-center justify-center px-3 h-10 leading-tight text-white bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-500  dark:text-white dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
            </a>
            <button
              (click)="changePage(1)"
              class="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              [disabled]="currentPage === totalPages"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      <div class="w-full max-w-5xl mx-auto p-8">
        <div
          class="w-full flex bg-white dark:bg-white-100 gap-4 p-8 rounded-lg shadow-md border"
        >
          <div
            class=" w-1/4 bg-white dark:bg-white text-black p-4 rounded-lg text-ellipsis"
          >
            <div
              class="  dark:bg-gray-100 text-black p-4 rounded-lg shadow-md border text-ellipsis "
            >
              <h2>Users</h2>
              <select [(ngModel)]="user" (ngModelChange)="selectUser(user)">
                <option value="">Select User</option>
                <option *ngFor="let user of getUniqueUsers()" [value]="user">
                  {{ user }}
                </option>
              </select>
            </div>
          </div>
          <div
            class="max-w-3xl bg-white dark:bg-gray-100 text-black p-8 rounded-lg shadow-md border "
            *ngIf="selectedUser"
          >
            <h2>{{ selectedUser }}'s workout progress</h2>
            <canvas id="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        color: white;
        align-items: center;
        max-width: 100vw;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .heading {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      label {
        display: block;
        margin-bottom: 5px;
        color: #666;
      }

      input {
        width: 100%;
        color: black;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      select {
        width: 100%;
        color: black;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }

      button {
        padding: 10px 20px;
        background-color: #f36;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #ff3333;
      }

      .filters {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
      }

      .workout-progress {
        color: black;
        display: flex;
        margin-top: 30px;
      }
      .user-list {
        width: 200px;
        margin-right: 20px;
      }
      .user-list ul {
        list-style-type: none;
        padding: 0;
      }
      .user-list li {
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
      }
      .user-list li.selected {
        background-color: #e0e0e0;
      }
      .chart-container {
        flex-grow: 1;
      }
      canvas {
        width: 100% !important;
        height: 300px !important;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  userName: string = '';
  workoutType: string = '';
  workoutMinutes: number = 0;
  workoutEntries: WorkoutEntry[] = [];
  filteredEntries: WorkoutEntry[] = [];
  paginatedEntries: WorkoutEntry[] = [];
  selectedUser: string | null = null;
  chart: Chart | null = null;

  searchTerm: string = '';
  filterType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  user: string = '';

  availableWorkoutTypes: string[] = [
    'Running',
    'Walking',
    'Cycling',
    'Swimming',
    'Weightlifting',
    'Yoga',
    'Pilates',
    'HIIT',
    'Dance',
    'Martial Arts',
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.loadFromLocalStorage();
    this.applyFilters();
  }

  loadFromLocalStorage() {
    const storedData = localStorage.getItem('workoutEntries');
    if (storedData) {
      this.workoutEntries = JSON.parse(storedData);
    } else {
      // Initialize with sample data if localStorage is empty
      this.workoutEntries = [
        { userName: 'John Doe', workoutType: 'Running', workoutMinutes: 30 },
        { userName: 'John Doe', workoutType: 'Cycling', workoutMinutes: 45 },
        { userName: 'Jane Smith', workoutType: 'Swimming', workoutMinutes: 60 },
        { userName: 'Jane Smith', workoutType: 'Running', workoutMinutes: 20 },
        { userName: 'Mike Johnson', workoutType: 'Yoga', workoutMinutes: 50 },
        {
          userName: 'Mike Johnson',
          workoutType: 'Cycling',
          workoutMinutes: 40,
        },
      ];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('workoutEntries', JSON.stringify(this.workoutEntries));
  }

  onSubmit(form: NgForm | any) {
    if (form.valid) {
      this.workoutEntries.push({
        userName: this.userName,
        workoutType: this.workoutType,
        workoutMinutes: this.workoutMinutes,
      });
      this.saveToLocalStorage();
      this.applyFilters();
      this.selectUser(this.userName);
      this.resetForm(form);
    }
  }

  resetForm(form: NgForm | any) {
    if (form.resetForm && typeof form.resetForm === 'function') {
      form.resetForm();
    }
    // Reset component properties
    this.userName = '';
    this.workoutType = '';
    this.workoutMinutes = 0;
  }

  getUniqueUsers(): string[] {
    return Array.from(
      new Set(this.workoutEntries.map((entry) => entry.userName))
    );
  }

  selectUser(user: string) {
    this.selectedUser = user;
    this.updateChart();
  }

  updateChart() {
    if (this.selectedUser) {
      const canvas =
        this.elementRef.nativeElement.querySelector('#chartCanvas');
      if (!canvas) return;

      const userEntries = this.workoutEntries.filter(
        (entry) => entry.userName === this.selectedUser
      );
      const workoutData: { [key: string]: number } = {};

      userEntries.forEach((entry) => {
        if (workoutData[entry.workoutType]) {
          workoutData[entry.workoutType] += entry.workoutMinutes;
        } else {
          workoutData[entry.workoutType] = entry.workoutMinutes;
        }
      });

      const labels = Object.keys(workoutData);
      const data = Object.values(workoutData);

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Workout Minutes',
              data: data,
              backgroundColor: 'rgba(255, 51, 102, 0.8)',

              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  applyFilters() {
    this.filteredEntries = this.workoutEntries.filter((entry) => {
      const nameMatch = entry.userName
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const typeMatch = this.filterType
        ? entry.workoutType === this.filterType
        : true;
      return nameMatch && typeMatch;
    });
    this.totalPages = Math.ceil(
      this.filteredEntries.length / this.itemsPerPage
    );
    this.currentPage = 1;
    this.updatePaginatedEntries();
  }

  updatePaginatedEntries() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedEntries = this.filteredEntries.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(delta: number) {
    this.currentPage += delta;
    this.updatePaginatedEntries();
  }

  getNumberOfWorkouts(userName: string): number {
    return this.workoutEntries.filter((entry) => entry.userName === userName)
      .length;
  }

  getTotalWorkoutMinutes(userName: string): number {
    return this.workoutEntries
      .filter((entry) => entry.userName === userName)
      .reduce((total, entry) => total + entry.workoutMinutes, 0);
  }
}
