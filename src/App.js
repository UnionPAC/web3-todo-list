import React, { useEffect, useState, Fragment } from "react";
import { ethers } from "ethers";
import loading from "./img/loading.gif";
import util from "./util/TodoList.json";
import "./App.css";

const App = () => {
  const [taskCount, setTaskCount] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const contractAddress = "0x3abE2BC7f622946E1827b2448575b31CdCf465D3";

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
      setCurrentAccount(accounts[0]);
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
          util.abi,
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
        
        // Get Task Count
        const taskCount = await TodoListContract.getTaskCount();
        const completedTasks = document.getElementsByClassName("checked").length;
        console.log(taskCount.toNumber());
        setTaskCount(taskCount.toNumber() - completedTasks);
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
          util.abi,
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
          util.abi,
          signer
        );
        let tx = await TodoListContract.updateTask(index);
        setIsLoading(true);
        console.log("Mining...", tx.hash);
        await tx.wait();
        setIsLoading(false);
        console.log("Mined", tx.hash);

        getAllTasks();
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
          util.abi,
          signer
        );
        let deleteTask = await TodoListContract.deleteTask(index);
        setIsLoading(true);
        console.log("Mining...", deleteTask.hash);
        await deleteTask.wait();
        setIsLoading(false);
        console.log("Mined --", deleteTask.hash);

        getAllTasks();
      }
    } catch (error) {
      console.log(error);
    }
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

  const loggedInUI = () => (
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
      >{`There are ${taskCount} tasks to complete!`}</p>
      {isLoading && (
        <img style={{ marginTop: "30px" }} src={loading} width="200px" />
      )}
      {!isLoading && (
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
      )}
    </Fragment>
  );

  useEffect(() => {
    checkIfWalletConnected();
    getAllTasks();
  }, []);

  return (
    <div className="App">
      <h1>To-do List</h1>
      {currentAccount ? loggedInUI() : loggedOutUI()}
    </div>
  );
};

export default App;
