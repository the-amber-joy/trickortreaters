const readline = require("readline");
const fs = require("fs");
const {
  generateFilename,
  calculateTotalPeople,
  extractPeopleCounts,
  validateInput,
  isExitCommand,
  createGroupObject,
  generateTimestamp,
  formatTableData,
} = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let groups = [];
let groupsData = []; // Store full group objects with timestamps
let totalPeople = 0;

const promptUser = () => {
  const filename = generateFilename();

  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename, "utf8");
    const jsonData = JSON.parse(data);
    groupsData = jsonData; // Store full group objects
    groups = extractPeopleCounts(jsonData);

    totalPeople = calculateTotalPeople(jsonData);

    console.clear();
    console.table(formatTableData(groupsData));
    console.log(`Total people: ${totalPeople}`);
  }

  rl.question(
    'Enter number of people in the next group (or type "exit" or "x" to stop): ',
    (input) => {
      if (isExitCommand(input)) {
        console.log("Exiting...");
        rl.close();
        return;
      }

      const numPeople = parseInt(input, 10);

      if (!validateInput(input)) {
        console.log("Please enter a valid number.");
      } else {
        groups.push(numPeople);
        totalPeople += numPeople;

        // Create new group object with current timestamp
        const newGroup = createGroupObject(
          groupsData.length + 1,
          numPeople,
          generateTimestamp(),
        );

        // Add to groupsData array
        groupsData.push(newGroup);

        // Save to JSON file
        fs.writeFileSync(filename, JSON.stringify(groupsData, null, 2));
      }

      promptUser();
    },
  );
};

promptUser();
