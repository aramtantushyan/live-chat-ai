//Initial setup
1. Before running the project both in backend and frontend folders a new .env file must be added in the root directory. In the .env file of the backend directory a key "GOOGLE_GENERATIVE_API={api_key}" should be added, and respectively in the frontend directory - NEXT_PUBLIC_SERVER_URL=http://localhost:3001
2. To run both backend and frontend navigate to those directories in your command prompt and enter "npm run start" and "npm run dev" respectively for backend and frontend.

// Utilized tech stack
1. DB - better-sqlite3
It is lightweight and well-suited for small-scale projects. It doesn't require complex integration and I have experience working with that package

2.BE - express
Framework - I have experience working with two backend frameworks express and NestJS. I chose Express over NestJS because I had less experience with it and wanted to enhance my skills, also I find the setup of express to be more simple.
API/communication - I have used REST APIs for general communication and the Websocket package for streaming messages.

3.FE - NextJS
Framewokr/lib - React.js's official documentation now recommends starting new projects with frameworks like Next.js. I feel comfortable with both React.js and NextJS, so I decided to move on with NextJS taking into account that it completly covers all React.js features.
UI/Styling - I haven't used any UI frameworks, instead I made the whole styling with plain SCSS. I have chosen SCSS since it provides more efficient and readable way of styling.

//Challenges
Well the most challenging for me was the backend and db implementation, since it was my first time doing it from the scratch. I encountered such problems as CORS issues, wrong SQL queries, some more framework-specific issues.

//How I solved them?
The main source of information for me while solving the aforementioned issues were official documentations and ChatGPT for software errors that were unclear for me.

//Spent time
Here is the breakdown of the time spent on each section of the projects:
BE, DB, Websocket, Gemini API integration - about 10 hours
FE(ui, styling, functionality) - about 7 hours
Testing - 1 hour
Totally - about 18 hours

