import fs from 'fs';
import { confirm } from '@inquirer/prompts';
import path from 'path';
import chalk from 'chalk';

/**
 * Removes all existing solution files and tests,
 * effectively letting the user start from scratch.
 */
function removeAllSolutions() {
  // Adjust paths as necessary
  const solutionPaths = [
    path.join('src', 'easy'),
    path.join('src', 'medium'),
    path.join('src', 'hard'),
    path.join('tests', 'easy'),
    path.join('tests', 'medium'),
    path.join('tests', 'hard'),
  ];

  for (const dirPath of solutionPaths) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}

/**
 * Main function which orchestrates the flow.
 */
async function main() {
  console.log(chalk.blue('Initializing the LeetCode TypeScript Solutions Repository...\n'));

  // Ask the user whether they want to remove existing solutions
  const removeSolutions = await confirm({
    message: 'Do you want to remove all existing solutions and start fresh?\n',
    default: false,
  });

  if (removeSolutions) {
    removeAllSolutions();
    console.log(chalk.green('All existing solutions have been removed. You can now start fresh!'));
    // Optionally, update the README to reset summary counts
    // or remove solution references if needed.
  } else {
    console.log(chalk.yellow('Keeping the existing solutions. Enjoy exploring!'));
  }
}

main().catch((error) => {
  console.error(chalk.red('Error during initialization:'), error);
  process.exit(1);
});