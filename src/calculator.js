#!/usr/bin/env node
// src/calculator.js
// Simple calculator with four operations: add, subtract, multiply, divide

function toNumber(value) {
  const n = Number(value);
  if (Number.isNaN(n)) throw new Error(`Invalid number: ${value}`);
  return n;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

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

function printUsage() {
  console.log('Usage: node src/calculator.js <operation> <a> <b>');
  console.log('Operations: add, subtract (sub), multiply (mul), divide (div)');
}

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
