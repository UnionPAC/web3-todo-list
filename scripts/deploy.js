const hre = require("hardhat");

const main = async () => {
  const TodoListContractFactory = await hre.ethers.getContractFactory(
    "TodoList"
  );
  const todoListContract = await TodoListContractFactory.deploy();
  await todoListContract.deployed();

  console.log("Contract deployed to:", todoListContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();