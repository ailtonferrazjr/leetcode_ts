// Utils created to update the counter of solutions in my README.md

import fs from "fs";

interface Counter {
    easy: number;
    medium: number;
    hard: number;
}
export class SolutionsCounter {
    counter: Counter;
    easyFolder: string = "src/easy";
    mediumFolder: string = "src/medium";
    hardFolder: string = "src/hard";


    constructor() {
        this.counter = this.countAllSolutions();
        this.updateMarkdownFile(this.counter);
    }
    countFolderSolutions(folderPath: string): number {
        const files = fs.readdirSync(folderPath);
        return files.length;
    }
    countAllSolutions(): Counter {
        const easy = this.countFolderSolutions(this.easyFolder);
        const medium = this.countFolderSolutions(this.mediumFolder);
        const hard = this.countFolderSolutions(this.hardFolder);
        return { easy, medium, hard };
    }
    updateMarkdownFile(counter: Counter) {
        let markdown = fs.readFileSync("README.md", "utf-8")
        .replace(/^(\- Easy:\s*)\d+/m, `$1${counter.easy}`)
        .replace(/^(\- Medium:\s*)\d+/m, `$1${counter.medium}`)
        .replace(/^(\- Hard:\s*)\d+/m, `$1${counter.hard}`)
        fs.writeFileSync("README.md", markdown)
    }

}

const counter: SolutionsCounter = new SolutionsCounter();
