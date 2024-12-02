export const htmlPlaceholder = `<h1>CollabPen Demo</h1>
<h2 id="myMsg">Counter: 0</h2>
<button id="myBtn">Click me!</button>
`;

export const cssPlaceholder = `body {
  background-color: #1e1e1e; 
  color: #ffffff;
  width: 60%;
  margin: auto;
}

#myBtn {
  background-color: #21ce99;
  border: none;
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
}`;

export const jsPlaceholder = `let counter = 0;

function incrementCounter() {
  counter++; // Increment the counter
  const msg = document.querySelector("#myMsg");
  msg.innerHTML = \`Counter: \${counter}\`; // Update the counter display
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#myBtn");
  button.addEventListener("click", incrementCounter);
});
`;