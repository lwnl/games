import readline from 'readline';
import chalk from 'chalk';

export class RandomNumberGame {
  constructor() {
    this.numbers = [];
    this.gameOver = false;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  generateRandomNumbers() {
    this.numbers = [];
    for (let i = 0; i < 3; i++) {
      this.numbers.push(Math.floor(Math.random() * 3) + 1); 
    }
  }

  renderSlotMachine() {
    console.clear();
    console.log(chalk.yellow.bold("╔═════════════════════════════════╗"));
    console.log(chalk.yellow.bold("║  🎰 WELCOME 🎰                  ║"));
    console.log(chalk.yellow.bold("╠═════════════════════════════════╣"));
    console.log(chalk.yellow.bold("║    Pulling the Lever...         ║"));
    console.log(chalk.yellow.bold("║           🎲                    ║"));
    console.log(chalk.yellow.bold("╠═════════════════════════════════╣"));


    const numberEmojis = ["1️⃣", '2️⃣', '3️⃣'];
    
    console.log(
      chalk.cyan(
        `      ${numberEmojis[this.numbers[0] - 1]}   ║   ${numberEmojis[this.numbers[1] - 1]}   ║   ${numberEmojis[this.numbers[2] - 1]}  `
      )
    );
    console.log(chalk.yellow.bold("╚═════════════════════════════════╝"));
  }

  checkWin() {
    return (
      this.numbers[0] === this.numbers[1] && this.numbers[1] === this.numbers[2]
    );
  }

  play() {
    if (this.gameOver) return;

    let spins = 0;
    const maxSpins = 10;
    const spinInterval = setInterval(() => {
      this.generateRandomNumbers();
      this.renderSlotMachine();
      spins++;

      if (spins >= maxSpins) {
        clearInterval(spinInterval);

        if (this.checkWin()) {
          console.log(chalk.green.bold("\n🎉 JACKPOT! You won! 🎉\n"));
          this.gameOver = true;
          this.askRestart();
        } else {
          console.log(chalk.red.bold("\n😔 No match, try again! 😔\n"));
          this.askRestart(); 
        }
      }
    }, 100);
  }

  askRestart() {
    this.rl.question(
      chalk.magenta("🔄 Do you want to restart the game? (yes/no): "),
      (answer) => {
        if (answer.trim().toLowerCase() === 'yes' || answer.trim() === '') {
          this.restart(); // Restart game if 'yes' or Enter
        } else if (answer.trim().toLowerCase() === 'no') {
          console.log(chalk.green("👋 Thanks for playing! Goodbye!"));
          this.rl.close(); // Close readline only if 'no'
        } else {
          // Handle invalid input
          console.log(chalk.red("Invalid input. Please type 'no' to quit or 'yes' to restart."));
          this.askRestart(); // Prompt again
        }
      }
    );
  }

  restart() {
    this.gameOver = false;
    console.log(chalk.blue.bold("\n🔄 Game restarted. Let's play again!\n"));
    this.play(); 
  }

  start() {
    this.rl.question(
      chalk.magenta("🎰 Press Enter to spin the slots or type 'exit' to quit: "),
      (input) => {
        if (input.trim().toLowerCase() === 'exit') {
          this.rl.close();
        } else {
          this.play();
        }
      }
    );
  }
}



