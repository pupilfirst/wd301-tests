import fs from "fs";

let generateFeedback = (passed, results) => {
  const testResults = Object.keys(results)
    .map((key) => {
      let status = results[key];
      let statusSymbol = status == "passed" ? "✓" : "✗";
      return `${statusSymbol} ${key}`;
    })
    .join("\n\n");

  const prefix = passed
    ? "Good work! It looks like you've completed the assignment according to our specifications. These are the tests we ran:"
    : "Uh oh! It looks like you've missed some parts of the assignment. Here are the results of the tests that we ran. A tick (✓) indicates a successful test, and a cross (✗) indicates a failed test.";

  const suffix = passed
    ? "See you in the next level!"
    : "Please make sure that you go through the assignment instructions. If you're having trouble with this assignment, carefully review your code for errors and refer to the course materials and provided guidelines.";

  const feedback = prefix + "\n\n" + testResults + "\n\n" + suffix;

  return feedback;
};

const writeReport = (data) => {
  console.log(data);
  let reportFile = "./report.json";
  fs.writeFileSync(reportFile, JSON.stringify(data));
};

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.log("File not found | Grading Skipped");
  }
};

const resultValues = (results) => {
  let testFiles = Object.keys(results).filter((key) => key !== "totals");
  return testFiles.reduce((acc, key) => Object.assign(acc, results[key]), {});
};

readFile("results.json").then((data) => {
  if (data) {
    let results = JSON.parse(data);
    const passed = results["totals"]["failed"] == 0;
    let feedback = generateFeedback(passed, resultValues(results));
    writeReport({
      version: 0,
      grade: passed ? "accept" : "reject",
      status: passed ? "success" : "failure",
      feedback: feedback,
      report: feedback,
    });
  } else {
    writeReport({
      version: 0,
      grade: "reject",
      status: "failure",
      feedback:
        "We are unable to test your submission - something about it was too different from what we were expecting. Please check the instructions for this assignment and try again. If you have seen this message more than once, carefully review your code for errors and refer to the course materials and provided guidelines.",
      report: "Unable to generate report due to missing results.json.",
    });
  }
});
