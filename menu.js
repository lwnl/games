import inquirer from 'inquirer';
import chess from './chess.js'; 
import {RandomNumberGame} from "./randomNumbergame.js";

// Define the menu options
const menuOptions = [
  {
    type: 'list',  // Use list type to display options
    name: 'menu',
    message: 'Game List',  // Custom message without asking question
    choices: [
      '1 - Chess',
      '2 - Othello',
      '3 - Greedy snake',
      '4 - Random Number Game',
      'Exit'
    ]
  }
];

// Display the menu and handle user selection
inquirer.prompt(menuOptions).then(answers => {
  switch (answers.menu) {
    case '1 - Chess':
      chess();
      break;
    case '2 - Othello':
      console.log('You chose Othello.');
      // Add code here to run Othello
      break;
    case '3 - Greedy snake':
      console.log('You chose Greedy snake.');
      // Add code here to run Greedy snake
      break;
    case 'Exit':
      console.log('Exiting...');
      break;
      case '4 - Random Number Game':
      const randomNumberGame = new RandomNumberGame();
      randomNumberGame.start();  // Start the game
      break;
    case 'Exit':
      console.log('Exiting...');
      break;
    default:
      console.log('Invalid choice');
  }
});

