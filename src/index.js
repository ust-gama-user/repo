#!/usr/bin/env node
// src/index.js
// Interactive entrypoint that provides a small REPL-style calculator using
// the operations implemented in src/calculator.js. This file exposes a
// small one-shot CLI mode (when called with 3 args) and an interactive
// REPL mode when run without args.

const readline = require('readline');
const path = require('path');

const { calc } = require('./calculator');

/** Simple add helper kept for backward compatibility with earlier exports. */
function add(a, b) {
  return a + b;
}

/**
 * Parse a string token to a number, throwing an Error with a clear message
 * when the token is not a valid numeric value.
 * @param {string} token
 * @returns {number}
 */
function parseNumber(token) {
  const n = Number(token);
  if (Number.isNaN(n)) throw new Error(`Invalid number: ${token}`);
  return n;
}

function clearScreen() {
  // Prefer the ANSI sequence which works in most terminals. Fall back to
  // console.clear() if stdout isn't a TTY.
  if (process && process.stdout && process.stdout.isTTY) {
    process.stdout.write('\x1Bc');
  } else {
    try {
      console.clear();
    } catch (e) {
      // no-op
    }
  }
}

/** Print short interactive help text describing supported commands. */
function printHelp() {
  console.log('Enter commands like: <operation> <a> <b>');
  console.log('Examples: add 2 3   |   subtract 5 1   |   multiply 4 6   |   divide 10 2');
  console.log("Type 'help' to show this message, or 'exit' / 'quit' to leave.");
}

/**
 * Start the interactive REPL. Reads lines from stdin, parses commands, and
 * prints results. Supports 'help' and 'exit'/'quit'.
 */
function startRepl() {
  clearScreen();
  console.log('Simple calculator REPL — operations: add, subtract (sub), multiply (mul), divide (div)');
  console.log();
  printHelp();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    const parts = input.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    if (cmd === 'exit' || cmd === 'quit') {
      rl.close();
      return;
    }

    if (cmd === 'help') {
      printHelp();
      rl.prompt();
      return;
    }

    if (parts.length < 3) {
      console.log('Error: expected 2 numeric arguments. Example: add 2 3');
      rl.prompt();
      return;
    }

    try {
      const a = parseNumber(parts[1]);
      const b = parseNumber(parts[2]);
      const result = calc(cmd, a, b);
      console.log(result);
    } catch (err) {
      console.error('Error:', err.message);
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye');
    process.exit(0);
  });
}

function main() {
  // Clear the screen on startup for a clean interface, then either run
  // a one-shot calculation (if args provided) or start the REPL.
  clearScreen();

  // If arguments were provided, delegate to calculator's CLI behaviour (optional)
  // but prefer REPL mode by default.
  if (process.argv.length > 2) {
    // forward to calculator.js main behaviour by requiring it as a module path
    // use spawn-like invocation: call the calc function directly if possible
    const [, , op, aRaw, bRaw] = process.argv;
    if (!op || aRaw === undefined || bRaw === undefined) {
      console.log('Insufficient arguments for one-shot mode — starting REPL instead.');
      startRepl();
      return;
    }

    try {
      const a = parseNumber(aRaw);
      const b = parseNumber(bRaw);
      const result = calc(op, a, b);
      console.log(result);
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  } else {
    startRepl();
  }
}

if (require.main === module) {
  main();
}

module.exports = { add };
