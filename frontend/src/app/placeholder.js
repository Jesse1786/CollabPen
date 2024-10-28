export const htmlPlaceholder = `<h1>CollabPen Demo</h1>
<h2 id="myMsg">Try clicking the button!</h2>
<button id="myBtn" onclick="updateText()">Click me!</button>`;

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

export const jsPlaceholder = `function updateText() {
  const msg = document.querySelector("#myMsg");
  msg.innerHTML = "This is so cool!";
}`;