// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import 'hardhat/console.sol';

contract TodoList {

    uint taskCount;

    struct Task {
        uint id;
        string content;
        bool isCompleted;
    }

    Task[] tasks;

    constructor() {
        
    }

    function getTaskCount() public view returns(uint) {
        console.log("We have %d tasks to complete", taskCount);
        return taskCount;
    }

    function addTask(string memory _content) public {
        taskCount++;
        tasks.push(Task(taskCount, _content, false));
    }

}

