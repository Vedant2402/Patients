# Patient Dashboard Project

## About This Project
This is a simple patient dashboard that shows medical information for patients. It's built with HTML, CSS, and JavaScript, and gets real patient data from an API.

## What It Does
- Shows patient information like name, date of birth, and contact details
- Displays vital signs (heart rate, temperature, etc.)
- Shows a list of diagnoses and lab results
- Creates a blood pressure chart using Chart.js

## Files in the Project
1. `index.html` - The main webpage
2. `app.js` - Gets data from the API and updates the page
3. `styles.css` - Makes the page look nice

## How to Run the Project
1. Open PowerShell in the project folder
2. Run this command to start a simple server:
   ```powershell
   python -m http.server 8000
   ```
3. Open your web browser and go to: `http://localhost:8000`

Note: Don't just open the HTML file directly - it needs to be served through a web server to work properly.

## What You Should See
- Patient information card with photo
- Blood pressure chart
- List of diagnoses
- Lab results
- Vital signs

## Important Notes
- The page tries to show Jessica Taylor's information first
- There's a dropdown to view other patients (for testing)
- You need an internet connection for the API to work

## Help with Problems
If the page isn't working:
1. Check that the server is running
2. Open the browser's DevTools (F12) to see any error messages
3. Make sure you're using `http://localhost:8000` and not opening the file directly

## Credits
Built as a skills test project for Coalition Technologies using:
- HTML/CSS/JavaScript
- Chart.js for the blood pressure graph
- Coalition Technologies Patient Data API