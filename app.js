const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let groups = [];
let groupsData = []; // Store full group objects with timestamps
let totalPeople = 0;

// Function to convert 24-hour time to 12-hour format with AM/PM
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

const promptUser = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}_${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}_${String(today.getDate()).padStart(2, "0")}`;
  const filename = `groups_log_${dateString}.json`;

  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename, "utf8");
    const jsonData = JSON.parse(data);
    groupsData = jsonData; // Store full group objects
    groups = jsonData.map((group) => group.people);

    totalPeople = groups.reduce((acc, num) => acc + num, 0);

    console.clear();
    console.table(
      groupsData.reduce((acc, groupObj, index) => {
        acc[`Group ${index + 1}`] = {
          "# of People": groupObj.people,
          Time: formatTime12Hour(groupObj.timestamp),
        };
        return acc;
      }, {}),
    );
    console.log(`Total people: ${totalPeople}`);
  }

  rl.question(
    'Enter number of people in the next group (or type "exit" or "x" to stop): ',
    (input) => {
      if (input.toLowerCase() === "exit" || input.toLowerCase() === "x") {
        console.log("Exiting...");
        rl.close();
        return;
      }

      const numPeople = parseInt(input, 10);

      if (isNaN(numPeople) || numPeople <= 0) {
        console.log("Please enter a valid number.");
      } else {
        groups.push(numPeople);
        totalPeople += numPeople;

        // Create new group object with current timestamp
        const now = new Date();
        const timestamp = now.toTimeString().split(" ")[0]; // Gets HH:MM:SS format
        const newGroup = {
          id: groupsData.length + 1,
          people: numPeople,
          timestamp: timestamp,
        };

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
