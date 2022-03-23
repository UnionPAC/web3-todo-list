const hre = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const TodoListContractFactory = await hre.ethers.getContractFactory(
    "TodoList"
  );
  const todoListContract = await TodoListContractFactory.deploy();
  await todoListContract.deployed();

  console.log("Contract deployed to:", todoListContract.address);

  // Print initial task count
  let taskCount;
  taskCount = await todoListContract.getTaskCount();
  console.log("We have %d tasks to complete!", taskCount.toNumber());

  // Create 2 tasks
  let addTask = await todoListContract.addTask("get groceries");
  await addTask.wait();

  addTask = await todoListContract.addTask("read a bit");
  await addTask.wait();

  // Show Array of Tasks
  let allTasks = await todoListContract.getTasks();
  console.log(allTasks);

  // Complete (isCompleted => true) task #1
  let updateTask = await todoListContract.updateTask(1);
  console.log("Mining...", updateTask.hash);
  await updateTask.wait();
  console.log("Mined:", updateTask.hash);

  // Show Array of Tasks (after update)
  allTasks = await todoListContract.getTasks();
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
