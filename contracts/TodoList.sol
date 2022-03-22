// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import 'hardhat/console.sol';

contract TodoList {

    uint taskCount;
    event NewTask(uint id, string content, bool isCompleted);

    struct Task {
        uint id;
        string content;
        bool isCompleted;
    }

    Task[] tasks;

    function getTaskCount() public view returns(uint) {
        return taskCount;
    }

    function addTask(string memory _content) public {
        taskCount++;
        tasks.push(Task(taskCount, _content, false));
        emit NewTask(taskCount, _content, false);
    }

    function getTasks() public view returns(Task[] memory) {
        return tasks;
    }

}

