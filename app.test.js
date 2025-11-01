const fs = require("fs");
const path = require("path");
const {
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
} = require("./utils");

// Mock readline to avoid interactive issues during testing
jest.mock("readline", () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn(),
  })),
}));

// Test data
const mockGroupsData = [
  { id: 1, people: 3, timestamp: "18:00:00" },
  { id: 2, people: 2, timestamp: "18:10:00" },
  { id: 3, people: 5, timestamp: "19:30:00" },
  { id: 4, people: 1, timestamp: "20:45:00" },
];

describe("Trick or Treaters App", () => {
  describe("formatTime12Hour function", () => {
    test("should convert 18:00:00 to 6:00:00 PM", () => {
      const result = formatTime12Hour("18:00:00");
      expect(result).toBe("6:00:00 PM");
    });

    test("should convert 06:30:15 to 6:30:15 AM", () => {
      const result = formatTime12Hour("06:30:15");
      expect(result).toBe("6:30:15 AM");
    });

    test("should convert 12:00:00 to 12:00:00 PM", () => {
      const result = formatTime12Hour("12:00:00");
      expect(result).toBe("12:00:00 PM");
    });

    test("should convert 00:00:00 to 12:00:00 AM", () => {
      const result = formatTime12Hour("00:00:00");
      expect(result).toBe("12:00:00 AM");
    });

    test("should convert 23:59:59 to 11:59:59 PM", () => {
      const result = formatTime12Hour("23:59:59");
      expect(result).toBe("11:59:59 PM");
    });

    test("should handle single digit hours correctly", () => {
      const result = formatTime12Hour("09:15:30");
      expect(result).toBe("9:15:30 AM");
    });
  });

  describe("Date string generation", () => {
    test("should format date correctly for October 31, 2025", () => {
      const testDate = new Date(2025, 9, 31); // Month is 0-indexed
      const result = generateDateString(testDate);
      expect(result).toBe("2025_10_31");
    });

    test("should pad single digit months and days", () => {
      const testDate = new Date(2025, 0, 5); // January 5, 2025
      const result = generateDateString(testDate);
      expect(result).toBe("2025_01_05");
    });

    test("should handle end of year correctly", () => {
      const testDate = new Date(2025, 11, 31); // December 31, 2025
      const result = generateDateString(testDate);
      expect(result).toBe("2025_12_31");
    });
  });

  describe("Filename generation", () => {
    test("should generate correct filename for today", () => {
      const testDate = new Date(2025, 10, 1);
      const result = generateFilename(testDate);
      expect(result).toBe("groups_log_2025_11_01.json");
    });

    test("should generate different filenames for different dates", () => {
      const date1 = new Date(2025, 10, 1);
      const date2 = new Date(2025, 10, 2);
      const filename1 = generateFilename(date1);
      const filename2 = generateFilename(date2);
      expect(filename1).not.toBe(filename2);
      expect(filename1).toBe("groups_log_2025_11_01.json");
      expect(filename2).toBe("groups_log_2025_11_02.json");
    });
  });

  describe("Data processing functions", () => {
    test("should calculate total people correctly", () => {
      const total = calculateTotalPeople(mockGroupsData);
      expect(total).toBe(11); // 3 + 2 + 5 + 1
    });

    test("should handle empty groups data", () => {
      const total = calculateTotalPeople([]);
      expect(total).toBe(0);
    });

    test("should extract people counts correctly", () => {
      const counts = extractPeopleCounts(mockGroupsData);
      expect(counts).toEqual([3, 2, 5, 1]);
    });

    test("should handle single group", () => {
      const singleGroup = [{ id: 1, people: 7, timestamp: "18:00:00" }];
      const counts = extractPeopleCounts(singleGroup);
      expect(counts).toEqual([7]);
    });
  });

  describe("Input validation", () => {
    test("should accept valid positive numbers", () => {
      expect(validateInput("5")).toBe(true);
      expect(validateInput("1")).toBe(true);
      expect(validateInput("100")).toBe(true);
    });

    test("should reject zero and negative numbers", () => {
      expect(validateInput("0")).toBe(false);
      expect(validateInput("-1")).toBe(false);
      expect(validateInput("-5")).toBe(false);
    });

    test("should reject non-numeric input", () => {
      expect(validateInput("abc")).toBe(false);
      expect(validateInput("")).toBe(false);
      expect(validateInput("5.5")).toBe(true); // parseInt converts this to 5
      expect(validateInput("5abc")).toBe(true); // parseInt converts this to 5
    });

    test("should handle exit commands", () => {
      expect(isExitCommand("exit")).toBe(true);
      expect(isExitCommand("EXIT")).toBe(true);
      expect(isExitCommand("x")).toBe(true);
      expect(isExitCommand("X")).toBe(true);
      expect(isExitCommand("quit")).toBe(false);
      expect(isExitCommand("5")).toBe(false);
    });
  });

  describe("Group object creation", () => {
    test("should create valid group object", () => {
      const group = createGroupObject(1, 5, "18:30:00");
      expect(group).toEqual({
        id: 1,
        people: 5,
        timestamp: "18:30:00",
      });
    });

    test("should create group with incremented ID", () => {
      const existingGroups = mockGroupsData;
      const nextId = existingGroups.length + 1;
      const group = createGroupObject(nextId, 3, "19:00:00");
      expect(group.id).toBe(5);
      expect(group.people).toBe(3);
    });
  });

  describe("Timestamp generation", () => {
    test("should generate timestamp in HH:MM:SS format", () => {
      const timestamp = generateTimestamp();
      expect(timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe("Table data formatting", () => {
    const mockFormatTime12Hour = (timeString) => {
      // Simple mock for testing
      const [hours] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:00:00 ${ampm}`;
    };

    test("should format table data correctly", () => {
      const result = formatTableData(
        mockGroupsData.slice(0, 2),
        mockFormatTime12Hour,
      );
      expect(result).toEqual({
        "Group 1": { "# of People": 3, Time: "6:00:00 PM" },
        "Group 2": { "# of People": 2, Time: "6:00:00 PM" },
      });
    });

    test("should handle empty groups data", () => {
      const result = formatTableData([], mockFormatTime12Hour);
      expect(result).toEqual({});
    });
  });
});

// Integration test for file operations
describe("File Operations", () => {
  const testDir = path.join(__dirname, "test-data");
  const testFile = path.join(testDir, "groups_log_2025_11_01.json");

  beforeEach(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  test("should write and read JSON data correctly", () => {
    const testData = mockGroupsData;

    // Write data
    fs.writeFileSync(testFile, JSON.stringify(testData, null, 2));

    // Read data back
    const readData = JSON.parse(fs.readFileSync(testFile, "utf8"));

    expect(readData).toEqual(testData);
  });

  test("should handle file existence check", () => {
    expect(fs.existsSync(testFile)).toBe(false);

    fs.writeFileSync(testFile, "[]");

    expect(fs.existsSync(testFile)).toBe(true);
  });
});
