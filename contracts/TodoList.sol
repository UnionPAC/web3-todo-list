// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import 'hardhat/console.sol';

contract TodoList {

    event NewTask(string content, bool isCompleted);

    struct Task {
        string content;
        bool isCompleted;
    }

    Task[] tasks;

    function addTask(string memory _content) public {
        require((keccak256(abi.encodePacked(_content)) != keccak256(abi.encodePacked(""))), "Task cannot be empty");
        tasks.push(Task(_content, false));
        emit NewTask(_content, false);
    }

    function updateTask(uint index) public {
        tasks[index].isCompleted = true;
    }

    function deleteTask(uint index) public {
        tasks[index] = tasks[tasks.length - 1];
        tasks.pop();
    }

    function getTasks() public view returns(Task[] memory) {
        return tasks;
    }

}

