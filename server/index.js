const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04d366c2d3751259bfa6942550e10c2a9520450ad4605857d580572b7c9a17536e4197f57b248f279483b6f4eb1ddaef44ca162ea02ace27fcfe6e2225dbf4ab66": 100,
  "04468fced2745c975da2cf801c451641b1cbad39139f23673eccc85a876bc9365f2a440fc528bbe7cec9ffbd44f750ceeebd02e88e7456683579b0972e563caefb": 50,
  "0427832eb6e7323a0b5d50bdfbd7fc9d2cb601c9ba469cc64bd73d27ab4b4aae05388d94cf887d88f6ae26766ba2884431ce9009c00a71047d2b264192aa1faa5c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
