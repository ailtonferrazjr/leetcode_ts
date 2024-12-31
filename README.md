# LeetCode Solutions in TypeScript 🚀

This repository contains my solutions to various LeetCode problems implemented in TypeScript.
Each solution includes detailed explanations, time and space complexity analysis, and test cases.

## Summary of Solutions
- Easy: 18
- Medium: 9
- Hard: 0

## 🚀 Features

- Automatically fetches problem details from LeetCode
- Generates structured solution and test files
- Organizes files by difficulty level

## 🎯 Purpose

- Improve problem-solving skills through code
- Improve my TypeScript knowledge
- Prove to myself that I can do it

## 🔧 Technologies Used

- TypeScript / Node.js
- Vitest for testing
- Husky for Git Hook
- Biome.js for Lint/Formatter

## 📦 Getting Started

1. **Clone the Repository**  

   ```bash
   git clone https://github.com/ailtonferrazjr/leetcode_ts.git
    ```

2. **Install Dependencies**


    ```bash
    cd leetcode_ts
    npm install
    ```

3. **(Optional) Start Fresh**

    If you would like to remove all existing solutions and begin from an empty repository:


    ```bash
    npm run init
    ```

    - You will be prompted whether you want to remove all existing solutions.
    - If you confirm, the script removes all solution/test files and resets counters to 0 in the README.

4. **Add a New LeetCode Problem**

    You can add new solutions any time using:

    ```bash
    npm run new
    ```

    - You will be prompted to enter the URL of a LeetCode problem (e.g., https://leetcode.com/problems/two-sum/).
    - The script automatically:
        - Fetches the problem details from LeetCode
        - Generates solution and test files
        - Places them into src/<difficulty> and tests/<difficulty> respectively


5. **Run Tests**

    ```bash
    npm run test
    ```

    - Uses Vitest to run unit tests for each solution.
    - Great way to verify your solutions are correct and robust.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐️ If you find this repository helpful, please consider giving it a star!

*Do or do not, there is no try!* 💻
