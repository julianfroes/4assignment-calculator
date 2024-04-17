let display = document.getElementById('display');
let currentOperand = '';
let previousOperand = '';
let operation = undefined;

function appendToDisplay(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    currentOperand += number;
    display.innerText = currentOperand;
}

function appendOperator(operator) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = operator;
    previousOperand = currentOperand;
    currentOperand = '';
}

function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        default:
            return;
    }
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    display.innerText = currentOperand;
}

function clear() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    display.innerText = '0';
}

function toggleSign() {
    currentOperand = (parseFloat(currentOperand) * -1).toString();
    display.innerText = currentOperand;
}

function percent() {
    currentOperand = (parseFloat(currentOperand) / 100).toString();
    display.innerText = currentOperand;
}

function appendDecimal() {
    if (currentOperand.includes('.')) return;
    currentOperand += '.';
    display.innerText = currentOperand;
}

document.querySelector('.clear').addEventListener('click', clear);
