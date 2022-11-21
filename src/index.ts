import { program } from "commander";
import csvParser from "csv-parser";
import { createReadStream, createWriteStream } from "fs";
import seedrandom from "seedrandom";

let totalBalance = 0;

program.option("-r, --random <number>", "random number from chainlink");
program.option("-f, --folder <type>", "path to snapshots");
program.option("-w, --weight <decimal>", "weight of the prize");
program.parse(process.argv);
const opts = program.opts();

if (!opts.folder || !opts.random || !opts.weight) {
  console.error("Please provide all inputs.");
  process.exit(1);
}

const RNG = seedrandom(opts.random);

const snapshotTrolls: { wallet: string; balance: number }[] = [];
const snapshotBoxes: { wallet: string; balance: number }[] = [];
const winners: { [wallet: string]: number } = {};
let winnerCount = 0;

createReadStream(`${opts.folder}/trolls_vox_balance.csv`)
  .pipe(csvParser())
  .on("data", (data) => {
    totalBalance += Number(data.balance);
    snapshotTrolls.push({ wallet: data.wallet, balance: data.balance });
  })
  .on("end", () => {
    snapshotTrolls.forEach((row) => {
      updateWinner(row.wallet, row.balance);
    });

    createReadStream(`${opts.folder}/trolls_vox_box.csv`)
      .pipe(csvParser())
      .on("data", (data) => {
        totalBalance += Number(data.balance);
        snapshotBoxes.push({ wallet: data.wallet, balance: data.balance });
      })
      .on("end", () => {
        snapshotBoxes.forEach((row) => {
          updateWinner(row.wallet, row.balance);
        });

        const output = Object.entries(winners).map(
          (winner) => `${winner[0]},${winner[1]}`
        );
        //Add headers
        output.unshift("address,quantity");

        const winnerFile = `${opts.folder}/winners.csv`;
        createWriteStream(winnerFile).write(output.join("\n"));
        console.log("Winners written to file: ", winnerFile);
        console.log("Total Entries: ", totalBalance);
        console.log("Total Winners: ", winnerCount);
      });
  });

const updateWinner = (address: string, balance: number) => {
  let wins = winners[address] || 0;
  for (let index = 0; index < balance; index++) {
    if (RNG() <= opts.weight) {
      wins++;
      winnerCount++;
    }
    if (wins) winners[address] = wins;
  }
};
