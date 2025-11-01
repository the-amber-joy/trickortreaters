const readline = require("readline");
const {
  generateFilename,
  validateInput,
  isExitCommand,
  loadGroupsData,
  saveGroupsData,
  displayGroupsTable,
  addNewGroup,
} = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Application state
let groupsData = [];
const filename = generateFilename();

/**
 * Handles user input for adding groups
 * @param {string} input - User input string
 */
const handleUserInput = (input) => {
  if (isExitCommand(input)) {
    console.log("Exiting...");
    rl.close();
    return;
  }

  if (!validateInput(input)) {
    console.log("Please enter a valid number.");
    promptUser();
    return;
  }

  const numPeople = parseInt(input, 10);

  // Add new group
  groupsData = addNewGroup(groupsData, numPeople);

  // Save to file
  if (saveGroupsData(filename, groupsData)) {
    displayGroupsTable(groupsData);
  } else {
    console.log("Error saving data. Please try again.");
  }

  promptUser();
};

/**
 * Prompts user for input
 */
const promptUser = () => {
  rl.question(
    'Enter number of people in the next group (or type "exit" or "x" to stop): ',
    handleUserInput,
  );
};

/**
 * Initializes the application
 */
const initializeApp = () => {
  // Load existing data
  groupsData = loadGroupsData(filename);

  // Display current state
  displayGroupsTable(groupsData);

  // Start prompting for input
  promptUser();
};

// Start the application
initializeApp();
