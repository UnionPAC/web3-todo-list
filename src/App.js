import React, { useEffect, useState, Fragment } from "react";
import { ethers } from "ethers";
import abi from "../src/util/TodoList.json";
import loading from "../src/img/loading.gif";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskCount, setTaskCount] = useState();
  const [allTasks, setAllTasks] = useState([]);
  const completedItems = document.getElementsByClassName("checked").length;
  const contractAddress = "0x3f00Adf7aE7A96a43004f0047bCF84d0247a83f8";

  // Check if user is connected
  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Please install MetaMask!");
        return;
      } else {
        console.log("Got the Ethereum Object ✅", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account ✅", account);
        setCurrentAccount(account);
      } else {
        console.log("No Authorized Account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Connect Wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Task Count
  const getTaskCount = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoListContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );

        let taskCount = await TodoListContract.getTaskCount();
        setTaskCount(taskCount.toNumber());
        console.log(taskCount.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add Task
  const addTask = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoListContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );

        let inputVal = document.getElementById("inputVal");
        const taskTx = await TodoListContract.addTask(inputVal.value);
        inputVal.value = "";
        setIsLoading(true);
        console.log("Mining...", taskTx.hash);
        await taskTx.wait();
        setIsLoading(false);
        console.log("Mined:", taskTx.hash);

        getAllTasks();
        getTaskCount();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get Task List
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoListContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );

        setIsLoading(true);
        const tasks = await TodoListContract.getTasks();

        let tasksArr = [];
        tasks.forEach((task) => {
          tasksArr.push({
            content: task.content,
            isCompleted: task.isCompleted,
          });
        });

        setIsLoading(false);
        console.log(tasksArr);
        setAllTasks(tasksArr);
        getTaskCount();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update Task
  const updateTask = async (index) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoListContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );
        let tx = await TodoListContract.updateTask(index);
        setIsLoading(true);
        console.log("Mining...", tx.hash);
        await tx.wait();
        setIsLoading(false);
        console.log("Mined", tx.hash);

        let allTasks = await TodoListContract.getTasks();
        console.log(allTasks);
        setAllTasks(allTasks);
        getTaskCount();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Task
  const deleteTask = async (index) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TodoListContract = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        );
        let deleteTask = await TodoListContract.deleteTask(index);
        setIsLoading(true);
        console.log("Mining...", deleteTask.hash);
        await deleteTask.wait();
        setIsLoading(false);
        console.log("Mined --", deleteTask.hash);

        let allTasks = await TodoListContract.getTasks();
        console.log(allTasks);
        setAllTasks(allTasks);
        getTaskCount();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderTaskList = () => {
    return (
      <div className="task-list">
        <ul>
          {allTasks.map((task, index) => {
            return (
              <li key={index} id={`task-${index + 1}`}>
                <p className={task.isCompleted === true ? "checked" : null}>
                  {task.content}
                </p>
                <div
                  className="controls"
                  style={{ marginLeft: "10px", padding: "10px" }}
                >
                  <i
                    className="fa-solid fa-check"
                    style={{ marginLeft: "30px" }}
                    onClick={() => {
                      updateTask(index);
                    }}
                  />
                  <i
                    className="fa-solid fa-trash"
                    style={{ marginLeft: "30px" }}
                    onClick={() => {
                      deleteTask(index);
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const loggedOutUI = () => (
    <button
      style={{ marginTop: "30px" }}
      className="connect-btn"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const loggedInUser = () => (
    <Fragment>
      <input
        className="inputVal"
        id="inputVal"
        type="text"
        placeholder="Enter task here..."
      />
      <button onClick={addTask}>+ Add Task</button>
      <p
        style={{ padding: "40px 10px 20px", fontStyle: "italic" }}
      >{`There are ${taskCount - completedItems} tasks to complete!`}</p>
      {isLoading && (
        <img style={{ marginTop: "30px" }} src={loading} width="200px" />
      )}
      {renderTaskList()}
    </Fragment>
  );

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <div className="App">
      <h1>To-do List</h1>
    </div>
  );
};

export default App;
