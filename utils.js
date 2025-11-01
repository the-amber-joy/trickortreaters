// Utility functions extracted for testing

/**
 * Converts 24-hour time format to 12-hour format with AM/PM
 * @param {string} timeString - Time in HH:MM:SS format
 * @returns {string} Time in 12-hour format with AM/PM
 */
const formatTime12Hour = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  const date = new Date();
  date.setHours(
    parseInt(hours, 10),
    parseInt(minutes, 10),
    parseInt(seconds, 10),
  );
  return date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Generates date string in YYYY_MM_DD format
 * @param {Date} date - Date object (defaults to current date)
 * @returns {string} Date string in YYYY_MM_DD format
 */
const generateDateString = (date = new Date()) => {
  return `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}_${String(date.getDate()).padStart(2, "0")}`;
};

/**
 * Generates filename for groups log
 * @param {Date} date - Date object (defaults to current date)
 * @returns {string} Filename in format groups_log_YYYY_MM_DD.json
 */
const generateFilename = (date = new Date()) => {
  const dateString = generateDateString(date);
  return `groups_log_${dateString}.json`;
};

/**
 * Calculates total number of people from groups data
 * @param {Array} groupsData - Array of group objects
 * @returns {number} Total number of people
 */
const calculateTotalPeople = (groupsData) => {
  return groupsData.reduce((acc, group) => acc + group.people, 0);
};

/**
 * Extracts people counts from groups data
 * @param {Array} groupsData - Array of group objects
 * @returns {Array} Array of people counts
 */
const extractPeopleCounts = (groupsData) => {
  return groupsData.map((group) => group.people);
};

/**
 * Validates user input for number of people
 * @param {string} input - User input string
 * @returns {boolean} True if valid positive number
 */
const validateInput = (input) => {
  const numPeople = parseInt(input, 10);
  return !isNaN(numPeople) && numPeople > 0;
};

/**
 * Checks if input is an exit command
 * @param {string} input - User input string
 * @returns {boolean} True if input is exit command
 */
const isExitCommand = (input) => {
  return input.toLowerCase() === "exit" || input.toLowerCase() === "x";
};

/**
 * Creates a new group object
 * @param {number} id - Group ID
 * @param {number} people - Number of people in group
 * @param {string} timestamp - Timestamp in HH:MM:SS format
 * @returns {Object} Group object with id, people, and timestamp
 */
const createGroupObject = (id, people, timestamp) => {
  return {
    id: id,
    people: people,
    timestamp: timestamp,
  };
};

/**
 * Generates current timestamp in HH:MM:SS format
 * @returns {string} Current time in HH:MM:SS format
 */
const generateTimestamp = () => {
  return new Date().toTimeString().split(" ")[0];
};

/**
 * Formats groups data for console table display
 * @param {Array} groupsData - Array of group objects
 * @param {Function} timeFormatter - Function to format time
 * @returns {Object} Formatted data for console.table
 */
const formatTableData = (groupsData, timeFormatter = formatTime12Hour) => {
  return groupsData.reduce((acc, groupObj, index) => {
    acc[`Group ${index + 1}`] = {
      "# of People": groupObj.people,
      Time: timeFormatter(groupObj.timestamp),
    };
    return acc;
  }, {});
};

module.exports = {
  formatTime12Hour,
  generateDateString,
  generateFilename,
  calculateTotalPeople,
  extractPeopleCounts,
  validateInput,
  isExitCommand,
  createGroupObject,
  generateTimestamp,
  formatTableData,
};
