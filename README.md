## Inspiration
QuikQ was inspired by the need to collaborate with friends on a Spotify queue during a dinner party. Even when all of the music is controlled via one person’s device, the idea of QuikQ would allow anyone in the room to partake. This obviously translates to any group setting including dinners, parties, and hackathons.

## What it does
QuikQ allows users to login and connect via Spotify in order to create & join listening rooms with their friends. Anybody logged into the same room can contribute to the shared queue and add whatever songs they would like by using the Spotify URI in the QuikQ rooms.

## How we built it
We built this app using Node.js and Express.js to handle the backend and HTML, CSS, and Javascript to handle the front end. The app works by having the NodeJS backend talk to the Spotify API and then send data up to the frontend in order to be displayed and interacted with by the end users. The majority of the code was done in the first 24 hour period of this competition, with Dean Tasiopoulos and Dennis Petlakh working on the front end design and functionality, and Dean Sellas working on the backend HTTP requests and API calls to the Spotify server.

## Challenges we ran into
On the front end, getting the CSS style formatting properly aligned and appearing correctly across different window sizes. Displaying information onscreen from the backend was also an issue we ran into.

One backend challenge was learning how to work with HTTP requests and how the Express.js router functioned. This was my (Dean Sellas) first time working with a node.js backend server and coming from languages like C++, Java, and C# It was an interesting experience getting used to the syntaxing and soft typing that Javascript has.

## Accomplishments that we're proud of
Built a working app that allows users to connect their spotify account and lets others add and listen to songs from one queue. 

## What we learned
We learned how to effectively work together as a team and utilize our strengths in order to build this application in a short amount of time.

## What's next for QuikQ
When adding the song URI, we want a working search option so you can just find and add a song that way rather than copying the song URI and adding it to the queue. We also would like to clean up the html and css code in order to have a mobile friendly design and a more browser friendly frontend design.

## Built With
### Backend
* NodeJS
* Express.js
* Heroku

#### Front End
* HTML
* CSS3
* Javascript
* Bootstrap
* jQuery
