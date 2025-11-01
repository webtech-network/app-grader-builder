# app-grader-builder
Frontend application for the Grader Builder service. 


## Environment Configuration

This application uses environment variables to configure backend API URLs. 

Create a `.env` file in the root directory (a `.env.example` is provided as template):

```bash
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_CONFIG_API_URL=http://localhost:8001
```

These variables configure:
- `REACT_APP_API_BASE_URL`: The templates API endpoint (default: http://localhost:8000)
- `REACT_APP_CONFIG_API_URL`: The configuration generator API endpoint (default: http://localhost:8001)


## Running the application

install dependencies 
```bash
npm i
```
start the dev server
```bash
npm start
```
Head to `http://localhost:3000` in your browser and have fun :)

> If you're a dev here, make sure to follow good commit and push practices. Don't be like Arthur Drumond!!
