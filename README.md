# CRM for school / studio management. Work in progress. 

Hello! Here is a CRM for studios (like drawing, dancing, etc) - any that needs:
- groups / individual lessons
- timetable
- payment system (monthly based subscriptions for visiting lessons)
- attendance history
- info about each student / client
- employments
- possibility to list all your expenses & income
- self hosting

## Features:
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

This is a v1 pet project that started for practice, mainly react & nest. And because my wife needed such crm :) 
No warranity. Some bugs can still persist.
Feel free to ask anything. 

## Future plans (2025+):
- move frontend to React admin (MUI & Next.js & SSR)
- payment system refactoring (now it's locked with a specific of a drawing studio & monthly paid subscriptions, want to make to more universal)
- tests
- translation
- branding settings

## Development instruction:
### Database: 
  MongoDB is used as database on backend. Following example will be for Ubuntu. 
  Full instruction can you can find here: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

  1. Install MongoDB
  ```shell
  sudo apt update
  sudo apt install -y mongodb-org
  ```
  2. Run database as service
  ```shell
  sudo systemctl start mongod
  ```
  3. Make database start on system start:
  ```shell
  sudo systemctl enable mongod
  ```
### Getting repo & installation
Clone repo into working dir & make build.
  1. Clone repo: 
  ```shell
  git clone https://github.com/karlsonru/studio-crm.git
  ```
  2. Install dependencies: 
  ```shell
  npm ci
  cd backend && npm ci
  cd client && npm ci
  ```
  3. Run build
  ```shell
  npm run build
  ```

### Running
To run locally in development mode use:
```shell
npm run dev
```

To run in production:
1. Run backend 
```shell
cd backend && npm start
```
(better as service)

2. Run web server as proxy
You can use nginx as proxy to return frontend code & use as proxy for backend API calls.
Nginx example config in current directory

