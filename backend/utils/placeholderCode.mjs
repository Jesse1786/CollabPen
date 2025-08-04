export const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CollabPen Project</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <h1>Welcome to CollabPen</h1>
      <p id="status">
        Changes to HTML, CSS, and JS appear instantly. Collaborate in real time and see others' updates and cursors live.
      </p>
      <button id="tryBtn">Try it</button>
    </div>
    <script src="script.js"></script>
  </body>
</html>`;

export const PLACEHOLDER_CSS = `body {
  background-color: #121212;
  color: #e0e0e0;
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.container {
  text-align: center;
  max-width: 600px;
  padding: 20px;
}

button {
  background-color: #1e88e5;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

button:hover {
  background-color: #1565c0;
}`;

export const PLACEHOLDER_JS = `document.getElementById('tryBtn').addEventListener('click', function () {
  document.getElementById('status').innerHTML =
    "You're all set! Start editing and collaborating.<br>You can add another user to the project in the dashboard.";
});`;
