import { program } from "commander";
import csvParser from "csv-parser";
import { createReadStream, createWriteStream } from "fs";

program.option("-f, --file <type>", "path to csv file");
program.option("-o, --output <type>", "output file path", "winners.csv");
program.option("-w, --weight <decimal>", "weight of the prize", "0.1");
program.parse(process.argv);
const opts = program.opts();

if (!opts.file) {
  console.error("Please specify csv a file.");
  process.exit(1);
}

const results: string[] = [];

createReadStream(opts.file)
  .pipe(csvParser(["wallet"]))
  .on("data", (data) => results.push(data.wallet))
  .on("end", () => {
    // Figure out our list of winners! (ES6 is awesome!)
    const winners = results
      // Yeet the title row
      .filter((val) => val != "wallet")
      .map((result) => Math.random() < parseFloat(opts.weight) && result)
      .filter(Boolean);

    // Add address label to the beginning
    winners.unshift("addresses");
    createWriteStream(opts.output).write(winners.join("\n"));
    console.log("Winners written to file: ", opts.output);
  });
