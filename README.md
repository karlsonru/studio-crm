CRM for school / studio management. Work in progress. 

Features:
- [x] Timetable. Look through all lessons planned for any week. Available views - ['week', 'day].
  - [ ] separated timetable for different locations
- [x] Lessons list. View all lessons, create new one. By double click can view specific lesson:
  - [x] edit & update lesson info
  - [x] change lesson teacher & add / remove students from lesson
  - [x] see all active and past subscriptions for this lesson
  - [x] support students with single-visit in specific date
- [x] Students list. View all students, create new one: 
  - [x] edit & update student info
  - [x] see all active and past subscriptions for this student 
- [x] Visited lessons history. Can look at visited lesson by day:
  - [x] Can set & change visit status for each students ['visited', 'missed', 'sick', 'postponed']
- [x] Billing service. Change / return visits from subscriptions based on students visit status.
- [x] Subscription templates. Template with fixed price and amount of visits. Based on template can checkout new subscription for specific student & lesson. 
- [x] Subsciptions list. View all subscriptions, create new one.
  - [x] edit & update subscription info
- [x] Employee list. Ability to create & edit employee. History of lessons done by empolyee. History of income done by empolyee. Salary rate. Est. month salary.
- [ ] Authorization with roles. Currently planned roles for using app: ['owner', 'administrator']
- [x] Financial analytics. Income statistics. 
- [ ] Translation & localization.

Instructions:
- [ ] Development instruction
- [ ] Swagger documentation


Development instruction:
* Database: 
  1. Install MongoDB
  2. Create roles in database
  3. Create users with roles
* Clone repo to working dir
  1. Install dependencies: 
    ```npm install```
    ```cd backend & npm install```
    ```cd client & npm install```
  2. Make build 
  3. Set nginx as proxy 

Development mode:
```npm run dev```
