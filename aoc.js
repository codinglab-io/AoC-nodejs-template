/*
 *  ----- 🎅 Advent of Code 🎄 automation template inspired by @MathisHammel -----
 *  This template provides functions to download inputs and submit answers on AoC.
 *  You need to paste your adventofcode.com session cookie below.
 *  If you don't know how to get this cookie, here's a quick tutorial:
 *  - Open your browser and go to adventofcode.com, make sure you are logged in
 *  - Open the developer console (Ctrl+Shift+I on Firefox/Chrome)
 *  - Get the value of your session cookie:
 *        - Chrome : 'Application' tab > Cookies
 *        - Firefox : 'Storage' tab > Cookies
 *  - The cookie is a string of 96 hexadecimal characters, paste it in the AOC_COOKIE below.
 *  Your cookie is similar to a password, >>> DO NOT SHARE/PUBLISH IT <<<
 *  If you intend to share your solutions, store it in an env variable or a file.
 *  ⭐️ Have fun and catch them all ! ⭐️
 */

const https = require("https");
const readline = require("readline");

const AOC_COOKIE = "YOUR_AOC_COOKIE_HERE";
const YEAR = 2021;
const DAY = 1;
const PART = 1;

const yourCleverSolution = (input) => {
  // TODO: write your clever solution here and return the answer
};

const options = {
  headers: {
    cookie: `session=${AOC_COOKIE}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const getInput = async () => {
  console.log("Getting input...");
  return new Promise((resolve) =>
    https.get(
      `https://adventofcode.com/${YEAR}/day/${DAY}/input`,
      options,
      (res) => {
        let resBody = "";
        res.on("data", (chunk) => {
          resBody += chunk;
        });
        res.on("end", () => {
          resolve(resBody);
        });
      }
    )
  ).then((data) => data.toString());
};

const askSubmit = (answer) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `Do you want to submit "${answer}" as answer for part ${PART} ? y/N `,
    (yesOrNo) => {
      if (yesOrNo.toLowerCase()[0] === "y") {
        submit(PART, answer);
      }
      rl.close();
    }
  );
};

const submit = async (level, answer) => {
  console.log("Submitting...");

  const xFormEncoded = `${encodeURI("level")}=${encodeURI(
    level.toString()
  )}&${encodeURI("answer")}=${encodeURI(answer.toString())}`;

  const req = https.request(
    `https://adventofcode.com/${YEAR}/day/${DAY}/answer`,
    { ...options, method: "POST" },
    (res) => {
      if (res.statusCode === 200) {
        res.on("data", (data) => handleSubmitResponse(data.toString()));
      } else {
        console.log("Error while submitting");
        console.log(`HTTP StatusCode: ${res.statusCode}`);
      }
    }
  );
  req.write(xFormEncoded);
  req.end();
};

const handleSubmitResponse = (data) => {
  if (data.includes("You gave an answer too recently")) {
    console.log("You gave an answer too recently");
  } else if (data.includes("not the right answer")) {
    if (data.includes("too high")) {
      console.log("Too high !");
    } else if (data.includes("too low")) {
      console.log("Too low !");
    } else {
      console.log("Not the right answer...");
    }
  } else if (data.includes("seem to be solving the right level.")) {
    console.log("Already solved this level");
  } else {
    console.log("⭐️ Success, congrats ! ⭐️");
  }
};

const help = () => {
  console.log(`
    Usage: node <filename> [--submit|-s]
    
    --help|-h : print this help
    --submit|-s : submit automatically the answer to AoC
    `);
};

const main = async () => {
  if (process.argv.find((arg) => arg === "--help" || arg === "-h")) {
    return help();
  }
  console.log(`Trying to solve : ${YEAR}-${DAY}-part_${PART}`);
  const input = await getInput();
  const answer = yourCleverSolution(input);
  if (!answer) return;
  if (process.argv.find((arg) => arg === "--submit" || arg === "-s")) {
    return submit(PART, answer);
  }
  askSubmit(answer);
};

main();

/*
 *    (\(\
 *    ( -.-)       "Until next time!"
 *    o_(")(")                     - LazyRabbit
 */
