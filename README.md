DESCRIPTION
This is a web application that allows the user to search for his favorite events, such as, music festivals or concerts of his favorite artist. The user can create a list of the events that I intends to go to and also access several details regarding them. 

USER STORIES
404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
Homepage - As a user I want to be able to sign up, log in, access my profile and search for events. 
Sign up - As a user I want to sign up on the webpage so that I can see all the events that I intend to attend
Login - As a user I want to be able to log in on the webpage so that I can get access to my profile
Logout - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
Event Search - As a user I want to be able to search for an event, access the details of that event and save it in my list of events.
Events List - As a user I want to see all the events that I saved in my list 

MPV
1.	Wireframe
2.	External API for events
3.	User flow
4.	Models Schema
5.	Routes
6.	Log-in/log-out/Sign-up
7.	Edit, add, delete options

BACKLOG
Allow the user to create and add a personal event to his list.

ROUTES
//INDEX
GET /
renders the Homepage

//AUTH
GET /auth/signup
redirects to / if user logged in
renders the signup form

POST /auth/signup
redirects to / if user logged in
body:
username
password

GET /auth/login
redirects to / if user logged in
renders the login page
POST /auth/login
redirects to / if user logged in
body:
username
password

POST /auth/logout
Render the homepage

//USER
GET /user/profile
renders the profile page
body: 
	username
country
favorite artists
avatar
list


GET /search
renders the search form

POST/ search
renders the search results

GET/ detailevents/:id
renders the event details

GET/profile/:id/add
adds event to the user’s list
redirects to profile

GET/profile/:id/delete
deletes event from the user’s list
redirects to profile

MODELS
USER - username: String, password: String, avatar: String, list:[ Schema.Types.ObjectId] 
EVENT - eventId: String, name: String, img: String, date: String, userId: String


ADDITIONAL LINKS:
Link to the application:
Link to the presentation: