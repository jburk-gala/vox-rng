# VOX Wallet Picker Script

This script is used to select winning wallets out of a csv file, and add them to an output csv file.

Rates
Common - 51%
Uncommon - 22.5% -> 26.5%
Rare - 14%
Epic - 8%
Legendary - 4%
Ancient - 0.5%

20 % chance for every option

So Common Chance is .51 * .20 = 0.102


Wallets Removed From Airdrop List (Gala wallets):
- 0xaa94d963bd7b6c8ddde07a4b4cf13e26c2650899
- 0xaa1d6169247dc28ac8f09b8c692b865aa423b06a
- 0x5171dcfd09ac42f591f9bb90bc9a330cd0cc0d94
- 0xaa94d963bd7b6c8ddde07a4b4cf13e26c2650899

Transactions will be obtained from chainlink contract: https://etherscan.io/address/0xf908b478019201db8f3b7e1379ef14d4f64d0fcf

Snapshot 1 Seed
---------------------------------------------------------------------------------
52694531950886193989452151201864687472399892647089387333720639450868763087547
https://etherscan.io/tx/0x1aa7938009c058b3d76efd30d4db9ddc75239fcad0096e42c4fdf8c16e525e05

Snapshot 2 Seed
---------------------------------------------------------------------------------
108117904175788122750336416322539293449614988016422674797095535283761033173437
https://etherscan.io/tx/0xc4faaac4559a91898a28c8b0dca8670c6c2b786da3e482dc38424cdba042165a



To run Snapshot_1 (Commons) Taken 11/21/2022:
```bash
    npm start -- --folder ./Snapshot_1 --weight 0.102 --random 52694531950886193989452151201864687472399892647089387333720639450868763087547
```


To run Snapshot_2 (Uncommons) Taken 11/30/2022:
Old
```bash
    npm start -- --folder ./Snapshot_2 --weight 0.045 --random 108117904175788122750336416322539293449614988016422674797095535283761033173437
```

To run Snapshot_2 Increased Odds (Uncommons) Taken 11/30/2022:
```bash
    npm start -- --folder ./Snapshot_2 --weight 0.053 --random 108117904175788122750336416322539293449614988016422674797095535283761033173437
```