import readline from 'readline';
import chalk from 'chalk';

export class RandomNumberGame {
  constructor() {
    this.bankroll = 100;
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
      if (Math.random() < 0.2) {
        this.numbers.push(0);
      } else if (Math.random() < 0.5) {
        this.numbers.push(1);
      } else {
        this.numbers.push(2);
      }
    }
  }

  renderSlotMachine() {
    console.clear();
    console.log(chalk.yellow.bold("╔═════════════════════════════════╗"));
    console.log(chalk.yellow.bold("║          🎰 WELCOME 🎰          ║"));
    console.log(chalk.yellow.bold("╠═════════════════════════════════╣"));
    console.log(chalk.yellow.bold("║       Pulling the Lever...      ║"));
    console.log(chalk.yellow.bold("║             🎲🎲🎲              ║"));
    console.log(chalk.yellow.bold("╠═════════════════════════════════╣"));


    const emojis = ["🥇", '🥈', '🥉'];

    console.log(
      chalk.cyan(
        `         ${emojis[this.numbers[0]]}   ║   ${emojis[this.numbers[1]]}   ║   ${emojis[this.numbers[2]]}  `
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
    let bet = 5
    if (this.gameOver) return;

    let spins = 0;
    const maxSpins = 10;
    const spinInterval = setInterval(() => {
      this.generateRandomNumbers();
      this.renderSlotMachine();
      spins++;

      if (spins >= maxSpins) {
        clearInterval(spinInterval);

        let bonus
        if (this.checkWin()) {
          if (this.numbers[0] === 0) {
            bonus = bet * 25;
            this.bankroll += bonus;
          } else if (this.numbers[0] === 1) {
            bonus = bet * 15;
            this.bankroll += bonus;
          } else {
            bonus = bet * 8;
            this.bankroll += bonus
          }
          console.log(chalk.green.bold(`
🎉 JACKPOT! You won! bankroll + ${bonus} 🎉
Your bankroll is ${this.bankroll}, bet : ${bet}`));
          this.gameOver = true;
          this.askRestart(bet);
        } else {
          this.bankroll -= bet;
          console.log(chalk.red.bold(`
😔 No match, try again! 😔
Your bankroll is ${this.bankroll}, bet : ${bet}
`
          ));
          this.askRestart(bet);
        }
      }
    }, 100);
  }

  askRestart(bet) {
    if (bet <= 0) {
      console.log(chalk.red("You don't have enough money to play. Goodbye!"));
      this.rl.close();
      return;
    } else {
      this.rl.question(
        chalk.magenta("🔄 Do you want to restart the game? (Yes/no): "),
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
