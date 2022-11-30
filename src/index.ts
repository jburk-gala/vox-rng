import { program } from "commander";
import csvParser from "csv-parser";
import { createReadStream, createWriteStream } from "fs";
import seedrandom from "seedrandom";

let totalBalance = 0;
let totalBalanceMinusGala = 0;

const galaWallets = [
  "0x5c5f2d6b503ff195cb989cbcfe73d92858c491a9",
  "0xaa1d6169247dc28ac8f09b8c692b865aa423b06a",
  "0x5171dcfd09ac42f591f9bb90bc9a330cd0cc0d94",
  "0xaa94d963bd7b6c8ddde07a4b4cf13e26c2650899",
];

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
let winnerCountMinusGala = 0;

createReadStream(`${opts.folder}/trolls_vox_balance.csv`)
  .pipe(csvParser())
  .on("data", (data) => {
    totalBalance += Number(data.balance);
    if (!isGalaWallet(data.wallet)) {
      totalBalanceMinusGala += Number(data.balance);
    }
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
        if (!isGalaWallet(data.wallet)) {
          totalBalanceMinusGala += Number(data.balance);
        }
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
        console.log("Average Expected: ", totalBalance * opts.weight);

        createReadStream(`${opts.folder}/winners.csv`)
        .pipe(csvParser())
        .on("data", (data) => {
          totalBalance += Number(data.balance);
          if (isGalaWallet(data.wallet)) {
            totalBalanceMinusGala += Number(data.balance);
          }
          snapshotBoxes.push({ wallet: data.wallet, balance: data.balance });
        })
        .on("end", () => {
          const output = Object.entries(winners).filter(winner => !isGalaWallet(winner[0])).map(
            (winner) => `${winner[0]},${winner[1]}`
          );
          //Add headers
          output.unshift("address,quantity");
          const airDropFile = `${opts.folder}/airdrop-list.csv`;
          createWriteStream(airDropFile).write(output.join("\n"));
          console.log("Airdrop written to file: ", winnerFile);
          console.log("Net Entries: ", totalBalanceMinusGala);
          console.log("Net Winners: ", winnerCountMinusGala);
          console.log("Net Expected: ", totalBalanceMinusGala * opts.weight);
        })

      });
  });

const updateWinner = (address: string, balance: number) => {
  const isGala = isGalaWallet(address);
  let wins = winners[address] || 0;
  for (let index = 0; index < balance; index++) {
    if (RNG() <= opts.weight) {
      wins++;
      winnerCount++;
      if (!isGala){
        winnerCountMinusGala++;
      }
    }
    if (wins) winners[address] = wins;
  }
};

const isGalaWallet = (wallet: string) => {
  return !!galaWallets.find(
    (gwallet) => gwallet.toLowerCase() == wallet.toLowerCase()
  );
};
