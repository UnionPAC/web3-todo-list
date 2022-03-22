const hre = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const TodoListContractFactory = await hre.ethers.getContractFactory(
    "TodoList"
  );
  const todoListContract = await TodoListContractFactory.deploy();
  await todoListContract.deployed();

  console.log("Contract deployed to:", todoListContract.address);
  console.log("Contract deployed by:", owner.address);

  let taskCount;
  taskCount = await todoListContract.getTaskCount();
  console.log("We have %d tasks to complete!", taskCount.toNumber());

  let taskTx = await todoListContract.addTask("Clean my room");
  await taskTx.wait();

  taskCount = await todoListContract.getTaskCount();
  console.log("We have %d tasks to complete!", taskCount.toNumber());

  let allTasks = await todoListContract.getTasks();
  console.log(allTasks);
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
