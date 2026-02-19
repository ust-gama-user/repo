#!/usr/bin/env node
// src/calculator.js
// Small utility module providing basic arithmetic operations and a
// command-line interface. Functions here are pure and exported for use by
// other modules (for example, the interactive REPL in src/index.js).


/**
 * Convert a value to a number or throw a clear error.
 * @param {any} value - The input to coerce to Number.
 * @returns {number}
 * @throws {Error} if the value cannot be converted to a valid number.
 */
function toNumber(value) {
  const n = Number(value);
  if (Number.isNaN(n)) throw new Error(`Invalid number: ${value}`);
  return n;
}

/** Add two numbers. */
function add(a, b) {
  return a + b;
}

/** Subtract b from a. */
function subtract(a, b) {
  return a - b;
}

/** Multiply two numbers. */
function multiply(a, b) {
  return a * b;
}

/** Divide a by b. Throws if b is zero. */
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

/**
 * Perform an operation by name on two numeric operands.
 * Supported names: add, subtract (sub), multiply (mul), divide (div).
 * @param {string} op - Operation name.
 * @param {number} a - First operand.
 * @param {number} b - Second operand.
 * @returns {number}
 * @throws {Error} for unknown operations or invalid inputs (see helpers).
 */
function calc(op, a, b) {
  switch (op.toLowerCase()) {
    case 'add':
      return add(a, b);
    case 'subtract':
    case 'sub':
      return subtract(a, b);
    case 'multiply':
    case 'mul':
      return multiply(a, b);
    case 'divide':
    case 'div':
      return divide(a, b);
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}

/** Print CLI usage text for one-shot mode. */
function printUsage() {
  console.log('Usage: node src/calculator.js <operation> <a> <b>');
  console.log('Operations: add, subtract (sub), multiply (mul), divide (div)');
}

/**
 * Command-line entrypoint for one-shot usage.
 * Expects: node src/calculator.js <operation> <a> <b>
 */
function main() {
  const [, , op, aRaw, bRaw] = process.argv;
  if (!op || aRaw === undefined || bRaw === undefined) {
    printUsage();
    process.exit(1);
  }

  try {
    const a = toNumber(aRaw);
    const b = toNumber(bRaw);
    const result = calc(op, a, b);
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { add, subtract, multiply, divide, calc };
