'use strict';

function player_name() {
  // Create the form HTML
  <!-- Contenedor para ingresar nombres -->

  const PlayerForms = `
              <form id="query" class="player-input-container">
                <h3>Enter Player 1 and 2 names</h3>
                <input type="text" id="nombre-player1" placeholder="Player 1"
                       required/>
                <input type="text" id="nombre-player2" placeholder="Player 2"
                       required/>
                <button type="submit">Submit Names</button>
              </form>
              `;

  // Insert the forms into the container
  const container = document.getElementById('player-data');
  container.innerHTML = PlayerForms;

  // Add event listener to the form
  const form = document.getElementById("query");
  form.addEventListener("submit", gameOn);

}

async function gameOn(event) {
    event.preventDefault();

    const player1 = document.getElementById("nombre-player1").value;
    const player2 = document.getElementById("nombre-player2").value;

    // Hide the container with the form
    const container = document.getElementById("player-data");
    container.style.display = "none";

    // Display player names in the stats box
    const stats_box = document.getElementById("stats-box"); // Updated target
   stats_box.innerHTML = `
    <div class="button_container">
        <button class="button" id="submit-answer">Check answer</button>
        <button class="button" id="next-question" onclick="roll_dice()">Next question</button>
    </div>
    <table class="player-stats-table">
        <thead>
            <tr>
                <th></th>
                <th>${player1}</th>
                <th>${player2}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Points</td>
                <td id="player1-points">0</td>
                <td id="player2-points">0</td>
            </tr>
            <tr>
                <td>Correct Answers</td>
                <td id="player1-correct">0</td>
                <td id="player2-correct">0</td>
            </tr>
            <tr>
                <td>Wrong Answers</td>
                <td id="player1-wrong">0</td>
                <td id="player2-wrong">0</td>
            </tr>
            <tr>
                <td>Random Events</td>
                <td id="player1-events">0</td>
                <td id="player2-events">0</td>
            </tr>
        </tbody>
    </table>
`;


    // Disable the start button
    const start_button = document.getElementById("start-button");
    start_button.disabled = true;
    const mainElement = document.querySelector('.main');

  // Remove the background image
  mainElement.style.background = 'none';
}


const quit_button = document.getElementById('quit-button');
quit_button.onclick = () => {
    const confirmation = confirm("Are you sure you want to quit the game?");
    if (confirmation) {
        // Clear the screen content and provide the back-to-home button
        document.body.innerHTML = `
            <h1>Thank you for playing!</h1>
            <button id="main-page-button">Back to game</button>
        `;

        // Add functionality to redirect to Flask's home route
        const mainPageButton = document.getElementById('main-page-button');
        mainPageButton.onclick = () => {
            window.location.href = "/"; // Flask's home route
        };
    }
};

