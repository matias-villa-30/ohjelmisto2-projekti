'use strict';

// Initialize variables
let player_position = 1;
let player2_position = 1;
let dice_roll_counter = 1; // Counts total rolls
let current_player = 1;    // Tracks the current player's turn (1 or 2)
let points_player1 = 0;
let points_player2 = 0;

// Roll Dice Functionality
function roll_dice() {
  const rolledNumber = Math.floor(Math.random() * 6) + 1;


  // Update the position based on the current player
  if (current_player === 1) {
    player_position = (player_position + rolledNumber) % 28;
    trigger_quiz(player_position, current_player);
    current_player = 2; // Switch to Player 2
  } else {
    player2_position = (player2_position + rolledNumber) % 28;
    trigger_quiz(player2_position, current_player);
    current_player = 1; // Switch to Player 1
  }

  // Increment the dice roll counter
  dice_roll_counter++;
}

// Trigger quizzes based on position
function trigger_quiz(position, player) {
  if ([2, 3, 5, 6, 7].includes(position)) {
    show_question1();
  } else if ([9, 10, 11, 13, 14].includes(position)) {
    kysymys2();
  } else if ([16, 17, 19, 20, 21].includes(position)) {
    kysymys3();
  } else if ([23, 24, 25, 27, 0].includes(position)) {
    kysymys4();
  } else if ([4, 8, 12, 15, 18, 22, 26].includes(position)) {
    // Trigger a random event
    console.log(`Random event triggered for Player ${player} at position ${position}`);
    randomEvent(player);
  }

  console.log(`Quiz or event triggered for Player ${player} at position ${position}`);
}

// Random Event Function
function randomEvent(player) {
  const events = [
    () => {
      points_player1 += 200;
      alert("Event: Player 1 gains 200 points!");
      console.log("Event: Player 1 gains 200 points!");
    },
    () => {
      points_player2 += 200;
      alert("Event: Player 2 gains 200 points!");
      console.log("Event: Player 2 gains 200 points!");
    },
    () => {
      points_player1 = 0;
      alert("Event: Player 1 points reset to 0!");
      console.log("Event: Player 1 points reset to 0!");
    },
    () => {
      points_player2 = 0;
      alert("Event: Player 2 points reset to 0!");
      console.log("Event: Player 2 points reset to 0!");
    },
    () => {
      points_player1 = 1000;
      console.log("Event: Player 1 wins the game with 1000 points!");
      alert("Event: Player 1 wins the game with 1000 points!");
      declareWinner(1);
    },
    () => {
      points_player2 = 1000;
      alert("Event: Player 2 wins the game with 1000 points!");
      console.log("Event: Player 2 wins the game with 1000 points!");
      declareWinner(2);
    }
  ];

  // Select and execute a random event
  const randomIndex = Math.floor(Math.random() * events.length);
  events[randomIndex]();

  // Update scores
  updatePointsTable();
}



// Declare Winner
function declareWinner(player) {
  alert(`Player ${player} wins the game!`);
  console.log(`Player ${player} has won the game!`);
  // Reset or trigger end-game logic
}

// Fetch Country Data
async function fetchCountriesData() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  return Object.values(await response.json());
}

async function show_question1() {
  const titulo = document.getElementById("titulo");
  const results = document.getElementById("banderas");
  const check_box_container = document.getElementById("respuestas");
  const send_answer = document.getElementById("submit-answer");
  const next_question = document.getElementById('next-question');
  next_question.disabled = true;

  if (!titulo || !results || !check_box_container) {
    console.error("Missing required elements in the DOM.");
    return;
  }

  // Clear previous content
  titulo.innerHTML = "";
  results.innerHTML = "";
  check_box_container.innerHTML = "";

  const countriesData = await fetchCountriesData();
  const validCountries = countriesData.filter(
    (country) => country.population && country.flags
  );

  const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
  const correctFlag = correctCountry.flags.png;
  const correctName = correctCountry.name.common;

  // Display the title as <h1>
  const h1 = document.createElement("h1");
  h1.textContent = `Guess the country by its flag`;
  titulo.appendChild(h1);

  // Display the flag
  const img = document.createElement("img");
  img.src = correctFlag;
  img.alt = `${correctName} flag`;
  img.style.maxWidth = "100%";
  results.appendChild(img);

  const wrongCountries = [];
  while (wrongCountries.length < 3) {
    const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)].name.common;
    if (randomCountry !== correctName && !wrongCountries.includes(randomCountry)) {
      wrongCountries.push(randomCountry);
    }
  }

  const allOptions = shuffleOptions([...wrongCountries, correctName]);

  allOptions.forEach((option, index) => {
    const label = document.createElement("label");
    label.textContent = option;
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.value = option;
    radio.name = "country";
    radio.id = `radio-${index}`;
    label.prepend(radio);
    check_box_container.appendChild(label);
    check_box_container.appendChild(document.createElement("br"));
  });

  send_answer.onclick = () => {
    const selectedOption = document.querySelector('input[name="country"]:checked');
    if (!selectedOption) {
      alert("Please select an answer.");
      return;
    }

    const selectedValue = selectedOption.value;
    if (selectedValue === correctName) {
      alert("Correct answer!");
      if (current_player === 1) {
        points_player1 += 50;
      } else {
        points_player2 += 50;
      }
    } else {
      alert("Wrong answer!");
    }

    updatePointsTable();
    next_question.disabled = false;

    // Check if there is a winner
    checkWinner();
  };
}
function checkWinner() {
  const winningScore = 1000; // Define the winning score
  if (points_player1 >= winningScore) {
    declareWinner(1);
  } else if (points_player2 >= winningScore) {
    declareWinner(2);
  }
}

// Function to Declare Winner
function declareWinner(player) {
  alert(`Player ${player} wins the game with ${player === 1 ? points_player1 : points_player2} points!`);
  console.log(`Player ${player} has won the game!`);

  // Reset the game or end it
  resetGame();
}

// Function to Reset the Game
function resetGame() {
  player_position = 1;
  player2_position = 1;
  dice_roll_counter = 1;
  current_player = 1;
  points_player1 = 0;
  points_player2 = 0;

  // Update the points table
  updatePointsTable();

  // Reset the UI
  const titulo = document.getElementById("titulo");
  const results = document.getElementById("banderas");
  const check_box_container = document.getElementById("respuestas");

  titulo.innerHTML = "<h1>Welcome to the Game!</h1>";
  results.innerHTML = "";
  check_box_container.innerHTML = "";

  console.log("Game reset successfully.");
}



// Example function to update points table
function updatePointsTable() {
  document.getElementById("player1-points").textContent = points_player1;
  document.getElementById("player2-points").textContent = points_player2;
}


// Helper function to shuffle options
function shuffleOptions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Show Question 2
async function kysymys2() {
  // Get DOM elements
  const titulo = document.getElementById("titulo");
  const results = document.getElementById("banderas"); // Use "banderas" for the flag image
  const check_box_container = document.getElementById("respuestas"); // Use "respuestas" for the answer options
  const send_answer = document.getElementById("submit-answer"); // Button to submit the answer
  const next_question = document.getElementById('next-question');
  next_question.disabled = true;

  // Clear previous content
  titulo.innerHTML = "";
  results.innerHTML = "";
  check_box_container.innerHTML = "";

  try {
    // Fetch countries data
    const countriesData = await fetchCountriesData();
    const validCountries = countriesData.filter(
      (country) => country.capital && country.capital.length > 0 && country.flags
    );

    // Select the correct country and capital
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctCapital = correctCountry.capital[0];
    const correctFlag = correctCountry.flags.png;

    // Update the question title
    titulo.textContent = `What is the capital of ${correctCountry.name.common}?`;

    // Display the correct country's flag
    const img = document.createElement("img");
    img.src = correctFlag;
    img.alt = `${correctCountry.name.common} flag`;
    results.appendChild(img);

    // Generate wrong options
    const wrongCapitals = [];
    while (wrongCapitals.length < 3) {
      const randomCapital = validCountries[Math.floor(Math.random() * validCountries.length)].capital[0];
      if (randomCapital !== correctCapital && !wrongCapitals.includes(randomCapital)) {
        wrongCapitals.push(randomCapital);
      }
    }

    // Combine correct and wrong answers, then shuffle
    const allOptions = shuffleOptions([...wrongCapitals, correctCapital]);

    // Create radio buttons for all options
    allOptions.forEach((option, index) => {
      const label = document.createElement("label");
      label.textContent = option;

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.value = option;
      radio.name = "capital"; // Unique group name
      radio.id = `radio-${index}`; // Unique ID for each option

      label.prepend(radio);
      check_box_container.appendChild(label);
      check_box_container.appendChild(document.createElement("br"));
    });

    // Add an event listener for the submit button
    send_answer.onclick = () => {
      // Get the selected option
      const selectedOption = document.querySelector('input[name="capital"]:checked');
      if (!selectedOption) {
        alert("Please select an answer.");
        return;
      }

      const selectedValue = selectedOption.value;
      let pointsToAdd = 100; // Points to add for a correct answer

      // Check if the selected answer is correct
      if (selectedValue === correctCapital) {
        alert("Correct answer!");
        if (current_player === 1) {
          points_player1 += pointsToAdd; // Update Player 1's points
        } else {
          points_player2 += pointsToAdd; // Update Player 2's points
        }
      } else {
        alert("Wrong answer!");
      }

      // Update the points table
      updatePointsTable();

      // Enable next question button again
      next_question.disabled = false;
      dice_roll_counter++;
    };
  } catch (error) {
    console.error("Error fetching or processing country data:", error);
  }
}

// Show Question 3
async function kysymys3(event) {
  if (event) {
    event.preventDefault(); // Prevent default form behavior if triggered by a form
  }

  // Get DOM elements
  const titulo = document.getElementById("titulo");
  const results = document.getElementById("banderas"); // Use "banderas" for the flag image
  const check_box_container = document.getElementById("respuestas"); // Use "respuestas" for the answer options
  const send_answer = document.getElementById("submit-answer"); // Button to submit the answer
  const next_question = document.getElementById('next-question');
  next_question.disabled = true;

  // Ensure required elements exist
  if (!titulo || !results || !check_box_container || !send_answer) {
    console.error("Missing required elements in the DOM. Ensure 'titulo', 'banderas', 'respuestas', and 'submit-answer' exist.");
    return;
  }

  // Clear previous content
  titulo.innerHTML = "";
  results.innerHTML = "";
  check_box_container.innerHTML = "";

  try {
    // Fetch countries data
    const countriesData = await fetchCountriesData();
    const validCountries = countriesData.filter(
      (country) => country.population && country.flags
    );

    // Select the correct country and population
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctPopulation = correctCountry.population;
    const correctFlag = correctCountry.flags.png;
    const correctName = correctCountry.name.common;

    // Update the question title
    titulo.textContent = `Guess the population of ${correctName}`;

    // Display the correct country's flag
    const img = document.createElement("img");
    img.src = correctFlag;
    img.alt = `${correctName} flag`;
    results.appendChild(img);

    // Generate wrong options
    const wrongPopulations = [];
    while (wrongPopulations.length < 3) {
      const randomIndex = Math.floor(Math.random() * validCountries.length);
      const wrongPopulation = validCountries[randomIndex].population;
      if (wrongPopulation !== correctPopulation && !wrongPopulations.includes(wrongPopulation)) {
        wrongPopulations.push(wrongPopulation);
      }
    }

    // Combine correct and wrong answers, then shuffle
    const allOptions = shuffleOptions([...wrongPopulations, correctPopulation]);

    // Create radio buttons for all options
    allOptions.forEach((option, index) => {
      const label = document.createElement("label");
      label.textContent = option.toLocaleString(); // Format population with commas

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.value = option; // Use the option value (population number)
      radio.name = "population"; // Unique group name
      radio.id = `radio-${index}`; // Unique ID for each option

      label.prepend(radio);
      check_box_container.appendChild(label);
      check_box_container.appendChild(document.createElement("br"));
    });

    // Add an event listener for the submit button
    send_answer.onclick = () => {
      // Get the selected option
      const selectedOption = document.querySelector('input[name="population"]:checked');
      if (!selectedOption) {
        alert("Please select an answer.");
        return;
      }

      const selectedValue = parseInt(selectedOption.value, 10); // Parse the selected value as a number
      let pointsToAdd = 150; // Points to add for a correct answer

      // Check if the selected answer is correct
      if (selectedValue === correctPopulation) {
        alert("Correct answer!");
        if (current_player === 1) {
          points_player1 += pointsToAdd; // Update Player 1's points
        } else {
          points_player2 += pointsToAdd; // Update Player 2's points
        }
      } else {
        alert("Wrong answer!");
      }

      // Update the points table
      updatePointsTable();
      // Enable next question button back

      next_question.disabled = false;
      // Increment the dice roll counter (if applicable in your game logic)
      dice_roll_counter++;
    };
  } catch (error) {
    console.error("Error fetching or processing country data:", error);
  }
}

// Show Question 4
async function kysymys4(event) {
  if (event) {
    event.preventDefault(); // Prevent default form behavior
  }

  // Get DOM elements
  const titulo = document.getElementById("titulo");
  const results = document.getElementById("banderas"); // Use "banderas" for additional information like population
  const check_box_container = document.getElementById("respuestas"); // Use "respuestas" for the answer options
  const send_answer = document.getElementById("submit-answer"); // Button to submit the answer
  const next_question = document.getElementById('next-question');
  next_question.disabled = true;

  // Ensure required elements exist
  if (!titulo || !results || !check_box_container || !send_answer) {
    console.error("Missing required elements in the DOM. Ensure 'titulo', 'banderas', 'respuestas', and 'submit-answer' exist.");
    return;
  }

  // Clear previous content
  titulo.innerHTML = "";
  results.innerHTML = "";
  check_box_container.innerHTML = "";

  try {
    // Fetch countries data
    const countriesData = await fetchCountriesData();
    const validCountries = countriesData.filter(
      (country) => country.population && country.timezones && country.timezones.length > 0
    );

    // Select the correct country and data
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctPopulation = correctCountry.population;
    const correctName = correctCountry.name.common;
    const correctTimezones = correctCountry.timezones;

    // Update the question title
    titulo.textContent = `Guess the timezones of ${correctName}`;

    // Display the correct country's population in "banderas"
    const populationInfo = document.createElement("p");
    populationInfo.textContent = `Population: ${correctPopulation.toLocaleString()}`;
    results.appendChild(populationInfo);

    // Generate wrong options
    const wrongTimezones = [];
    while (wrongTimezones.length < 3) {
      const randomIndex = Math.floor(Math.random() * validCountries.length);
      const wrongCountry = validCountries[randomIndex];
      const wrongTimezone = wrongCountry.timezones;
      if (
        wrongCountry.name.common !== correctName &&
        !wrongTimezones.some((tz) => JSON.stringify(tz) === JSON.stringify(wrongTimezone))
      ) {
        wrongTimezones.push(wrongTimezone);
      }
    }

    // Combine correct and wrong answers, then shuffle
    const allOptions = shuffleOptions([...wrongTimezones, correctTimezones]);

    // Create radio buttons for all options
    allOptions.forEach((option, index) => {
      const label = document.createElement("label");
      label.textContent = option.join(", "); // Combine timezones into a string

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.value = option.join(", "); // Use the timezones as the value
      radio.name = "timezones"; // Unique group name
      radio.id = `radio-${index}`; // Unique ID for each option

      label.prepend(radio);
      check_box_container.appendChild(label);
      check_box_container.appendChild(document.createElement("br"));
    });

    // Add an event listener for the submit button
    send_answer.onclick = () => {
      // Get the selected option
      const selectedOption = document.querySelector('input[name="timezones"]:checked');
      if (!selectedOption) {
        alert("Please select an answer.");
        return;
      }

      const selectedValue = selectedOption.value.split(", "); // Split the selected value back into an array
      let pointsToAdd = 75; // Points to add for a correct answer

      // Check if the selected answer is correct
      const isCorrect = selectedValue.every((timezone) => correctTimezones.includes(timezone));
      if (isCorrect) {
        alert("Correct answer!");
        if (current_player === 1) {
          points_player1 += pointsToAdd; // Update Player 1's points
        } else {
          points_player2 += pointsToAdd; // Update Player 2's points
        }
      } else {
        alert("Wrong answer!");
      }

      // Update the points table
      updatePointsTable();
      // Enable next question button back

      next_question.disabled = false;
      // Increment the dice roll counter (if applicable in your game logic)
      dice_roll_counter++;
    };
  } catch (error) {
    console.error("Error fetching or processing country data:", error);
  }
}
