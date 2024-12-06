'use strict';

// Initialize variables
let player_position = 1;
let player2_position = 1;
let dice_roll_counter = 1; // Counts total rolls
let current_player = 1;    // Tracks the current player's turn (1 or 2)
let points_player1 = 0;
let points_player2 = 0;
let wrong_answers_player1 = 0;
let wrong_answers_player2 = 0;
let right_answers_player1 = 0;
let right_answers_player2 = 0;
let random_event_player1 = 0;
let random_event_player2 = 0;

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
      random_event_player1 ++;
      alert("Event: Player 1 gains 200 points!");
      console.log("Event: Player 1 gains 200 points!");
    },
    () => {
      points_player2 += 200;
      random_event_player2 ++;
      alert("Event: Player 2 gains 200 points!");
      console.log("Event: Player 2 gains 200 points!");
    },
    () => {
      points_player1 = 0;
      random_event_player1++;
      alert("Event: Player 1 points reset to 0!");
      console.log("Event: Player 1 points reset to 0!");
    },
    () => {
      points_player2 = 0;
      random_event_player2++;
      alert("Event: Player 2 points reset to 0!");
      console.log("Event: Player 2 points reset to 0!");
    },
    () => {
      points_player1 = 1000;
      random_event_player1++;
      console.log("Event: Player 1 wins the game with 1000 points!");
      alert("Event: Player 1 wins the game with 1000 points!");
      declareWinner(1);
    },
    () => {
      points_player2 = 1000;
      random_event_player2++;
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

// Fetch Country Data
async function fetchCountriesData() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  return Object.values(await response.json());
}
// fetch airport information
function fetchRandomAirport(countryCode) {
    fetch("/submit_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryCode })
    })
    .then(response => response.json())
    .then(data => {
        const airportDisplay = document.getElementById("airport-display");
        if (data.random_airport) {
            airportDisplay.textContent = `You landed at ${data.random_airport} in ${data.country_name}!`;
        } else {
            airportDisplay.textContent = "No airport found for the selected country.";
        }
    })
    .catch(error => {
        console.error("Error fetching airport data:", error);
    });
}
async function show_question1() {
  // Get DOM elements
  const titulo = document.getElementById("titulo");
  const results = document.getElementById("banderas"); // Use "banderas" for the flag image
  const check_box_container = document.getElementById("respuestas"); // Use "respuestas" for the answer options
  const send_answer = document.getElementById("submit-answer"); // Button to submit the answer
  const next_question = document.getElementById("next-question");
  next_question.disabled = true;

  // Validate required elements
  if (!titulo || !results || !check_box_container || !send_answer) {
    console.error("Missing required elements in the DOM.");
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

    // Select the correct country
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctFlag = correctCountry.flags.png;
    const correctName = correctCountry.name.common;

    // Display the title as <h1>
    const h1 = document.createElement("h1");
    h1.textContent = `Guess the country by its flag (50pts)`;
    titulo.appendChild(h1);

    // Display the correct country's flag
    const img = document.createElement("img");
    img.src = correctFlag;
    img.alt = `${correctName} flag`;
    img.style.maxWidth = "100%"; // Ensure the flag is responsive
    img.style.border = "1px solid #ccc";
    img.style.borderRadius = "8px";
    img.style.marginBottom = "10px";
    results.appendChild(img);

    // Generate 3 incorrect options
    const wrongCountries = [];
    while (wrongCountries.length < 3) {
      const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)].name.common;
      if (randomCountry !== correctName && !wrongCountries.includes(randomCountry)) {
        wrongCountries.push(randomCountry);
      }
    }

    // Combine all options and shuffle
    const allOptions = shuffleOptions([...wrongCountries, correctName]);

    // Create radio buttons for each option
    allOptions.forEach((option, index) => {
      const label = document.createElement("label");
      label.textContent = option;
      label.style.fontSize = "1.2rem"; // Larger font size for options

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.value = option; // Use the option as the value
      radio.name = "country"; // Group all options under the same name
      radio.id = `radio-${index}`;

      label.prepend(radio);
      check_box_container.appendChild(label);
      check_box_container.appendChild(document.createElement("br"));
    });

    // Add an event listener for the submit button
    send_answer.onclick = () => {
      // Get the selected option
      const selectedOption = document.querySelector('input[name="country"]:checked');
      if (!selectedOption) {
        alert("Please select an answer.");
        return;
      }

      const selectedValue = selectedOption.value;

      // Check if the selected answer is correct
      if (selectedValue === correctName) {
    alert("Correct answer!");
    if (current_player === 1) {
        points_player1 += 50;
        right_answers_player1++;
    } else {
        points_player2 += 50;
        right_answers_player2++;
    }
} else {
    alert("Wrong answer!");
    if (current_player === 1) {
        wrong_answers_player1++;
    } else {
        wrong_answers_player2++;
    }
}


      // Update the points table
      updatePointsTable();

      // Clear containers after the question is answered
      titulo.innerHTML = "";
      results.innerHTML = "";
      check_box_container.innerHTML = "";

      // Enable the next question button
      next_question.disabled = false;

      // Check if there is a winner
      checkWinner();
    };
  } catch (error) {
    console.error("Error fetching or processing country data:", error);
  }
}



function checkWinner() {
  const winningScore = 1000;// Define the winning score
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
  location.reload();
}



// Example function to update points table
function updatePointsTable() {
  document.getElementById("player1-points").textContent = points_player1;
  document.getElementById("player2-points").textContent = points_player2;
  document.getElementById('player1-correct').textContent = right_answers_player1;
  document.getElementById('player2-correct').textContent = right_answers_player2;
  document.getElementById('player1-wrong').textContent = wrong_answers_player1;
  document.getElementById('player2-wrong').textContent = wrong_answers_player2;
  document.getElementById('player1-events').textContent = random_event_player1;
  document.getElementById('player2-events').textContent = random_event_player2;
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
    // Select required DOM elements
    const titulo = document.getElementById("titulo");
    const results = document.getElementById("banderas");
    const check_box_container = document.getElementById("respuestas");
    const airportDisplay = document.getElementById("airport-display"); // Div for showing the airport
    const send_answer = document.getElementById("submit-answer");
    const next_question = document.getElementById('next-question');
    next_question.disabled = true;

    // Validate the existence of elements
    if (!titulo || !results || !check_box_container || !airportDisplay) {
        console.error("Missing required elements in the DOM. Ensure 'titulo', 'banderas', 'respuestas', and 'airport-display' exist.");
        return;
    }

    // Clear previous content
    titulo.innerHTML = "";
    results.innerHTML = "";
    check_box_container.innerHTML = "";
    airportDisplay.textContent = ""; // Clear previous airport display

    // Fetch country data
    const countriesData = await fetchCountriesData();
    const validCountries = countriesData.filter(
        (country) => country.capital && country.capital.length > 0 && country.flags && country.cca2
    );

    // Choose the correct country
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctCapital = correctCountry.capital[0];
    const correctFlag = correctCountry.flags.png;
    const correctName = correctCountry.name.common;
    const isoCountryCode = correctCountry.cca2; // ISO Country Code (2-letter)

    // Display the title inside an <h1> tag
    titulo.innerHTML = `<h1>What is the capital of ${correctName}?</h1>`;

    // Display the flag
    const img = document.createElement("img");
    img.src = correctFlag;
    img.alt = `${correctName} flag`;
    img.style.maxWidth = "100%"; // Ensure the flag is responsive
    results.appendChild(img);

    // Fetch a random airport for the selected country
    fetch("/submit_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: isoCountryCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.random_airport) {
                airportDisplay.textContent = `You landed at ${data.random_airport} in ${correctName}!`;
            } else {
                airportDisplay.textContent = "No airport found for the selected country.";
            }
        })
        .catch((error) => {
            console.error("Error fetching airport data:", error);
            airportDisplay.textContent = "Error fetching airport data.";
        });

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
        radio.name = "capital"; // Group all options under the same name
        radio.id = `radio-${index}`;

        label.prepend(radio);
        check_box_container.appendChild(label);
        check_box_container.appendChild(document.createElement("br"));
    });

    // Add event listener for the answer button
    if (send_answer) {
        send_answer.onclick = () => {
            // Get the selected option
            const selectedOption = document.querySelector('input[name="capital"]:checked');
            if (!selectedOption) {
                alert("Please select an answer.");
                return;
            }

            const selectedValue = selectedOption.value;

            // Check if the selected answer is correct
            if (selectedValue === correctCapital) {
                alert("Correct answer!");
                if (current_player === 1) {
                    points_player1 += 100;
                    right_answers_player1++;
                } else {
                    points_player2 += 100;
                    right_answers_player2++;
                }
            } else {
                alert("Wrong answer!");
                if (current_player === 1) {
                    wrong_answers_player1++;
                } else {
                    wrong_answers_player2++;
                }
            }

            // Enable next question button
            next_question.disabled = false;
            // Clean airport display
            airportDisplay.textContent = '';
            // Update the points table
            updatePointsTable();
        };
    }
}




// Show Question 3
async function kysymys3(event) {
    if (event) {
        event.preventDefault(); // Prevent default form behavior
    }

    // Select required DOM elements
    const titulo = document.getElementById("titulo");
    const results = document.getElementById("banderas");
    const check_box_container = document.getElementById("respuestas");
    const airportDisplay = document.getElementById("airport-display"); // Div for showing the airport
    const send_answer = document.getElementById("submit-answer");
    const next_question = document.getElementById('next-question');
    next_question.disabled = true;

    // Validate the existence of elements
    if (!titulo || !results || !check_box_container || !airportDisplay) {
        console.error("Missing required elements in the DOM. Ensure 'titulo', 'banderas', 'respuestas', and 'airport-display' exist.");
        return;
    }

    // Clear previous content
    titulo.innerHTML = "";
    results.innerHTML = "";
    check_box_container.innerHTML = "";
    airportDisplay.textContent = ""; // Clear previous airport display

    // Fetch country data
    const countriesData = await fetchCountriesData();
    const validCountries = countriesData.filter(
        (country) => country.population && country.flags && country.cca2
    );

    // Choose the correct country
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctPopulation = correctCountry.population;
    const correctFlag = correctCountry.flags.png;
    const correctName = correctCountry.name.common;
    const isoCountryCode = correctCountry.cca2; // ISO Country Code (2-letter)

    // Display the title
    titulo.innerHTML = `Guess the population of ${correctName}`;

    // Display the flag
    const img = document.createElement("img");
    img.src = correctFlag;
    img.alt = `${correctName} flag`;
    img.style.maxWidth = "100%"; // Ensure the flag is responsive
    results.appendChild(img);

    // Fetch a random airport for the selected country
    fetch("/submit_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: isoCountryCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.random_airport) {
                airportDisplay.textContent = `You landed at ${data.random_airport} in ${correctName}!`;
            } else {
                airportDisplay.textContent = "No airport found for the selected country.";
            }
        })
        .catch((error) => {
            console.error("Error fetching airport data:", error);
            airportDisplay.textContent = "Error fetching airport data.";
        });

    // Generate wrong options
    const wrongPopulations = [];
    while (wrongPopulations.length < 3) {
        const randomPopulation = validCountries[Math.floor(Math.random() * validCountries.length)].population;
        if (randomPopulation !== correctPopulation && !wrongPopulations.includes(randomPopulation)) {
            wrongPopulations.push(randomPopulation);
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
        radio.name = "population"; // Group all options under the same name
        radio.id = `radio-${index}`;

        label.prepend(radio);
        check_box_container.appendChild(label);
        check_box_container.appendChild(document.createElement("br"));
    });

    // Add event listener for the answer button
    if (send_answer) {
        send_answer.onclick = () => {
            // Get the selected option
            const selectedOption = document.querySelector('input[name="population"]:checked');
            if (!selectedOption) {
                alert("Please select an answer.");
                return;
            }

            const selectedValue = parseInt(selectedOption.value, 10); // Parse the selected value as a number

            // Check if the selected answer is correct
            if (selectedValue === correctPopulation) {
                alert("Correct answer!");
                if (current_player === 1) {
                    points_player1 += 150;
                    right_answers_player1++;
                } else {
                    points_player2 += 150;
                    right_answers_player2++;
                }
            } else {
                alert("Wrong answer!");
                if (current_player === 1) {
                    wrong_answers_player1++;
                } else {
                    wrong_answers_player2++;
                }
            }

            // Enable next question button
            next_question.disabled = false;
            // clean airport container
            airportDisplay.textContent = '';
            // Update the points table
            updatePointsTable();
        };
    }
}



// Show Question 4
async function kysymys4(event) {
    if (event) {
        event.preventDefault(); // Prevent default form behavior
    }

    // Select required DOM elements
    const titulo = document.getElementById("titulo");
    const results = document.getElementById("banderas");
    const check_box_container = document.getElementById("respuestas");
    const airportDisplay = document.getElementById("airport-display"); // Div for showing the airport
    const send_answer = document.getElementById("submit-answer");
    const next_question = document.getElementById('next-question');
    next_question.disabled = true;

    // Validate the existence of elements
    if (!titulo || !results || !check_box_container || !airportDisplay) {
        console.error("Missing required elements in the DOM. Ensure 'titulo', 'banderas', 'respuestas', and 'airport-display' exist.");
        return;
    }

    // Clear previous content
    titulo.innerHTML = "";
    results.innerHTML = "";
    check_box_container.innerHTML = "";
    airportDisplay.textContent = ""; // Clear previous airport display

    // Fetch country data
    const countriesData = await fetchCountriesData();
    const validCountries = countriesData.filter(
        (country) => country.timezones && country.timezones.length > 0 && country.flags && country.cca2
    );

    // Choose the correct country
    const correctCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
    const correctTimezones = correctCountry.timezones;
    const correctFlag = correctCountry.flags.png;
    const correctName = correctCountry.name.common;
    const isoCountryCode = correctCountry.cca2; // ISO Country Code (2-letter)

    // Display the title inside an <h1> tag
    titulo.innerHTML = `<h1>Guess the timezones of ${correctName}</h1>`;

    // Display the flag
    const img = document.createElement("img");
    img.src = correctFlag;
    img.alt = `${correctName} flag`;
    img.style.maxWidth = "100%"; // Ensure the flag is responsive
    results.appendChild(img);

    // Fetch a random airport for the selected country
    fetch("/submit_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: isoCountryCode }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.random_airport) {
                airportDisplay.textContent = `You landed at ${data.random_airport} in ${correctName}!`;
            } else {
                airportDisplay.textContent = "No airport found for the selected country.";
            }
        })
        .catch((error) => {
            console.error("Error fetching airport data:", error);
            airportDisplay.textContent = "Error fetching airport data.";
        });

    // Generate wrong options
    const wrongTimezones = [];
    while (wrongTimezones.length < 3) {
        const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
        const randomTimezone = randomCountry.timezones.join(", ");
        if (!wrongTimezones.includes(randomTimezone) && randomTimezone !== correctTimezones.join(", ")) {
            wrongTimezones.push(randomTimezone);
        }
    }

    // Combine correct and wrong answers, then shuffle
    const allOptions = shuffleOptions([...wrongTimezones, correctTimezones.join(", ")]);

    // Create radio buttons for all options
    allOptions.forEach((option, index) => {
        const label = document.createElement("label");
        label.textContent = option; // Display the timezone(s)

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.value = option;
        radio.name = "timezones"; // Group all options under the same name
        radio.id = `radio-${index}`;

        label.prepend(radio);
        check_box_container.appendChild(label);
        check_box_container.appendChild(document.createElement("br"));
    });

    // Add event listener for the answer button
    if (send_answer) {
        send_answer.onclick = () => {
            // Get the selected option
            const selectedOption = document.querySelector('input[name="timezones"]:checked');
            if (!selectedOption) {
                alert("Please select an answer.");
                return;
            }

            const selectedValue = selectedOption.value;

            // Check if the selected answer is correct
            if (selectedValue === correctTimezones.join(", ")) {
                alert("Correct answer!");
                if (current_player === 1) {
                    points_player1 += 75;
                    right_answers_player1++;
                } else {
                    points_player2 += 75;
                    right_answers_player2++;
                }
            } else {
                alert("Wrong answer!");
                if (current_player === 1) {
                    wrong_answers_player1++;
                } else {
                    wrong_answers_player2++;
                }
            }

            // Enable next question button
            next_question.disabled = false;
            // clear airport container
            airportDisplay.textContent = '';
            // Update the points table
            updatePointsTable();
        };
    }
}

