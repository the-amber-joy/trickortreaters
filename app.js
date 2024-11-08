const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let groups = [];
let totalPeople = 0;

const promptUser = () => {
  if (fs.existsSync(`groups_log_${new Date().getFullYear()}.txt`)) {
    const data = fs.readFileSync(
      `groups_log_${new Date().getFullYear()}.txt`,
      "utf8",
    );
    const lines = data.split("\n").filter((line) => line.startsWith("Group"));
    groups = lines.map((line) => {
      return parseInt(line.split(": ")[1].split(" ")[0], 10);
    });

    totalPeople = groups.reduce((acc, num) => acc + num, 0);

    console.clear();
    console.table(
      groups.reduce((acc, numPeople, index) => {
        acc[`Group ${index + 1}`] = { "# of People": numPeople };
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
        const logData = `${groups
          .map((numPeople, index) => `Group ${index + 1}: ${numPeople} people`)
          .join("\n")}\n\nCurrent count of groups: ${
          groups.length
        }\nTotal people: ${totalPeople}\n`;
        fs.writeFileSync(`groups_log_${new Date().getFullYear()}.txt`, logData);
      }

      promptUser();
    },
  );
};

promptUser();
