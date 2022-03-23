import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../src/artifacts/contracts/TodoList.sol/TodoList.json";
import "./App.css";

const App = () => {
  const [taskCount, setTaskCount] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const contractAddress = "0xCDd5D9f285af538bA157374C8d673a0B93496E96";

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
        console.log("Mining...", taskTx.hash);
        await taskTx.wait();
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

        const tasks = await TodoListContract.getTasks();

        let tasksArr = [];
        tasks.forEach((task) => {
          tasksArr.push({
            id: task.id,
            content: task.content,
            isCompleted: task.isCompleted,
          });
        });

        setAllTasks(tasksArr);
        setTaskCount(tasksArr.length);
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
                <p className="task-content" id={`taskContent-${task.id}`}>{task.content}</p>
                <div
                  className="controls"
                  style={{ marginLeft: "10px", padding: "10px" }}
                >
                  <i
                    className="fa-solid fa-pen-to-square"
                    style={{ marginLeft: "30px" }}
                  />
                  <i
                    className="fa-solid fa-trash"
                    style={{ marginLeft: "30px" }}
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
      <p
        style={{ padding: "40px 10px", fontStyle: "italic" }}
      >{`There are ${taskCount} tasks to finish!`}</p>
      {renderTaskList()}
    </div>
  );
};

export default App;
