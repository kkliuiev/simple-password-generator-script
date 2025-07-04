const readline = require('readline');
const crypto = require('crypto');

// Character sets
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*()-_=+[]{}|;:,.<>?/`~';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to generate a secure password
function generatePassword(length, useUpper, useNumbers, useSpecial) {
  let symbols = LOWERCASE;
  if (useUpper) symbols += UPPERCASE;
  if (useNumbers) symbols += NUMBERS;
  if (useSpecial) symbols += SPECIAL;

  if (symbols.length === 0) {
    throw new Error('No character sets selected.');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, symbols.length);
    password += symbols[randomIndex];
  }

  return password;
}

// Helper to ask yes/no questions
function askYesNo(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

// Main prompt flow
(async function main() {
  rl.question('Enter desired password length: ', async (lengthInput) => {
    const length = parseInt(lengthInput, 10);

    if (isNaN(length) || length <= 0) {
      console.error('Invalid length. Please enter a positive number.');
      rl.close();
      return;
    }

    const useUpper = await askYesNo('Include uppercase letters?');
    const useNumbers = await askYesNo('Include numbers?');
    const useSpecial = await askYesNo('Include special characters?');

    try {
      const password = generatePassword(length, useUpper, useNumbers, useSpecial);
      console.log(`\nGenerated Password: ${password}`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    } finally {
      rl.close();
    }
  });
})();

