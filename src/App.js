import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../src/artifacts/contracts/TodoList.sol/TodoList.json";
import loading from "../src/img/loading.gif";
import "./App.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskCount, setTaskCount] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const completedItems = document.getElementsByClassName("checked").length;
  const contractAddress = "0xe812579A49E6d6B3eE8b27bB27D85b6625390501";

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

        let taskCount = await TodoListContract.getTaskCount();
        console.log(
          "There are %s tasks that need to be done!",
          taskCount.toString()
        );

        let inputVal = document.getElementById("inputVal");
        const taskTx = await TodoListContract.addTask(inputVal.value);
        inputVal.value = "";
        setIsLoading(true);
        console.log("Mining...", taskTx.hash);
        await taskTx.wait();
        setIsLoading(false);
        console.log("Mined:", taskTx.hash);

        taskCount = await TodoListContract.getTaskCount();
        setTaskCount(taskCount);
        console.log(
          "There are %s tasks that need to be done!",
          taskCount.toString()
        );

        getAllTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get All Tasks
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
            id: task.id.toNumber(),
            content: task.content,
            isCompleted: task.isCompleted,
          });
        });

        setIsLoading(false);
        console.log(tasksArr);
        setAllTasks(tasksArr);
        setTaskCount(tasksArr.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update Task
  const updateTask = async (id) => {
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
        let tx = await TodoListContract.updateTask(id);
        setIsLoading(true);
        console.log("Mining...", tx.hash);
        await tx.wait();
        setIsLoading(false);
        console.log("Mined", tx.hash);

        let allTasks = await TodoListContract.getTasks();
        console.log(allTasks);
        setTaskCount(taskCount - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
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
        let tx = await TodoListContract.deleteTask(id);
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

  const renderTaskList = () => {
    return (
      <div className="task-list">
        <ul>
          {allTasks.map((task, index) => {
            return (
              <li key={index} id={`task-${task.id}`}>
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
                    onClick={() => updateTask(task.id)}
                  />
                  <i
                    className="fa-solid fa-trash"
                    style={{ marginLeft: "30px" }}
                    onClick={() => deleteTask(task.id)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div className="App">
      <h1>To-do List</h1>
      <input
        className="inputVal"
        id="inputVal"
        type="text"
        placeholder="Enter task here..."
      />
      <button onClick={addTask}>+ Add Task</button>
      <p style={{ padding: "40px 10px", fontStyle: "italic" }}>
        {`There are ${taskCount - completedItems} tasks to finish!`}
      </p>
      {isLoading && (
        <img style={{ marginTop: "30px" }} src={loading} width="200px" />
      )}
      {!isLoading && renderTaskList()}
    </div>
  );
};

export default App;
