const hre = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const TodoListContractFactory = await hre.ethers.getContractFactory(
    "TodoList"
  );
  const todoListContract = await TodoListContractFactory.deploy();
  await todoListContract.deployed();

  console.log("Contract deployed to:", todoListContract.address);

  // Print Task Count = 0
  let taskCount = await todoListContract.getTaskCount();
  console.log(taskCount.toString());

  // Add 3 Tasks
  let addTask = await todoListContract.addTask('Get groceries');
  await addTask.wait();

  addTask = await todoListContract.addTask('Walk the dog');
  await addTask.wait();

  addTask = await todoListContract.addTask('Go climbing @ 4pm');
  await addTask.wait();

  // Delete Task 'Walk the dog'
  let deleteTask = await todoListContract.deleteTask(2);
  await deleteTask.wait();

  // Print Final Array
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
