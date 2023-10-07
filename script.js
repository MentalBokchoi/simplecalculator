const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
//variables
let currentExpression = "";
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("data-value");
        const operator = button.getAttribute("data-operator");
        if (value !== null) {
            // Number input
            currentExpression += value;
            updateDisplay();
        } else if (operator !== null) {
            // Operator input
            if (currentExpression !== "") {
                currentExpression += operator;
                updateDisplay();
            }
        }
    })
})
// = button
document.getElementById("equal").addEventListener("click", () => {
    if (currentExpression !== "") {
        calculate();
    }
});
// C button
document.getElementById("clear").addEventListener("click", () => {
    currentExpression = "";
    updateDisplay();
});
//calculation
function calculate() {
    try {
        const result = evaluateExpression(currentExpression);
        currentExpression = result.toString();
        updateDisplay();
    } catch (error) {
        currentExpression = "Error";
        updateDisplay();
    }
}
function evaluateExpression(expression) {
    const operators = ['+', '-', 'x', '/'];
    const numStack = [];
    const opStack = [];
    let num = '';
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (!isNaN(char) || char === '.') {
            num += char;
        } else if (operators.includes(char)) {
            if (num !== '') {
                numStack.push(parseFloat(num));
                num = '';
            }
            while (
                opStack.length > 0 &&
                operators.indexOf(opStack[opStack.length - 1]) >= operators.indexOf(char)
            ) {
                const op = opStack.pop();
                const num2 = numStack.pop();
                const num1 = numStack.pop();
                numStack.push(applyOperator(op, num1, num2));
            }
            opStack.push(char);
        }
    }
    if (num !== '') {
        numStack.push(parseFloat(num));
    }
    while (opStack.length > 0) {
        const op = opStack.pop();
        const num2 = numStack.pop();
        const num1 = numStack.pop();
        numStack.push(applyOperator(op, num1, num2));
    }
    if (numStack.length === 1) {
        return numStack[0];
    } else {
        throw new Error('Invalid expression');
    }
}
function applyOperator(operator, num1, num2) {
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case 'x':
            return num1 * num2;
        case '/':
            if (num2 !== 0) {
                return num1 / num2;
            } else {
                throw new Error('Division by zero');
            }
        default:
            throw new Error('Invalid operator');
    }
}
function updateDisplay() {
    display.textContent = currentExpression;
}