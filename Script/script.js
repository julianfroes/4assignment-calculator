
const main = {
    SYMBOLS: ['/', '*', '-', '+','%'],
    decimalPoint: '.',
    result: [],
    defaultValue: '0',
    numerate: '0',
    indexing:0,
    block: false,
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => {
        if (b === 0 && !main.block) {
            const errorMessageDiv = document.getElementById('output');
            errorMessageDiv.innerHTML = "Cannot divide by zero";
            errorMessageDiv.classList.add("error-message"); 
            main.block = true; 
            // throw new Error('Division by zero');
        }
        return a / b;
    },
    mod: (a,b)=>{
        return a % b;
    },
    operate(operator, a, b) {
        let result;
        switch (operator) {
            case '+':
                result = this.add(a, b);
                break;
            case '-':
                result = this.subtract(a, b);
                break;
            case '*':
                result = this.multiply(a, b);
                break;
            case '/':
                result = this.divide(a, b);
                break;
            case '%':
                result = this.mod(a, b);
                break;
            default:
                return NaN;
        }
        
        const roundedResult = this.roundResult(result, 3);         
        return roundedResult;
    },
    
    roundResult(result, decimalPlaces) {
        if (!isNaN(result) && isFinite(result)) {
            return Number(result.toFixed(decimalPlaces));
        } else {
            return NaN;
        }
    },
    validateInput(value) {
        // Validate and append value
        if (this.block) {
            console.log('Cleaning screen...')
            this.clearDisplay();
            return true;
        } else if (this.result.length > 0 && this.SYMBOLS.includes(this.result[this.result.length - 1]) &&
            this.SYMBOLS.includes(value)) {
            console.log("Cannot insert operator consecutively");
            return false;
        } else if (value === '.' && this.result.includes('.')) {
            console.log("Cannot insert more than one decimal point");
            return false;
        }
        return true;
    },   
    concatenateNumber(value) {
        if (this.SYMBOLS.includes(value)) return;

        if (value === '.') {
            const lastNumber = this.result[this.indexing].toString();

            if (lastNumber.includes('.')) {
                console.log("Cannot insert more than one decimal point");
                return;
            }
        } 
        this.numerate += value;

         // Remove leading zeros only if the number doesn't start with '0.'
        if (!this.numerate.startsWith('0.') && !this.numerate.startsWith('.') ) {
            //if 025 -> 25 | 00 -> 0 | 0 -> 0            
            if(this.numerate.length >1){
                let temp = this.numerate.split('');
                while (temp.length > 1 && temp[0] === '0') {
                    temp.shift();
                }
                this.numerate = temp.join('');
            }          
        }
        
         this.result[this.indexing] = this.numerate;         
    },
    operationsCheck(value){
        if (!this.SYMBOLS.includes(value)) return;       

        this.result.push(value);
        if(this.result.length > 3){
            this.reduceOperations();            
        }
         this.numerate='0';
         this.indexing+=2;
    },
    reasonOfTwo(){
        const num1 = parseFloat(this.result[this.indexing - 2]);
        const num2 = parseFloat(this.result[this.indexing]);
        const operator = this.result[this.indexing - 1];
        return this.operate(operator, num1, num2);
    },
    reduceOperations(){
        //proceed to operate 2 numbers
        const tempOperation = this.result.pop();
        try {

            let total = this.reasonOfTwo();
            this.result = [total, tempOperation];
            this.indexing = 0;
            this.numerate = total;
        } catch (error) {
            console.error('Error during reduce operation:', error.message);
        }
    },
    addValue(value) {
        if (!this.validateInput(value)) return;
        this.concatenateNumber(value);       
         this.operationsCheck(value);

         //display values
         this.displayResult();
    },
    displayResult(){
        document.getElementById('input').innerHTML = this.result.join('');
        document.getElementById('output').innerHTML = this.lastNumberType();
    },
    lastNumberType(){
        const lastIndex = this.result.findLastIndex((element) => !this.SYMBOLS.includes(element));

        // it doesn't suppose to pass here
        return lastIndex !== -1 ? this.result[lastIndex] : null;
    },
    clearDisplay() {
        const outputDiv = document.getElementById('output');
        outputDiv.classList.remove("error-message");
        this.result=[];
        this.numerate="0";
        this.indexing=0;
        this.sentinel();
        this.block=false;
    },
    backspace() {
        const lastElement = this.result[this.result.length - 1];
    
        if (!isNaN(parseFloat(lastElement))) {
            if (lastElement === '0') {
                return;
            }
    
            if (lastElement === '0.') {
                this.result[this.result.length - 1] = '0';
            } else {
                this.removeLastCharacterFromNumber(lastElement);
            }
        } else {
            this.removeLastElement();
        }
    
        this.displayResult();
    },
    
    removeLastCharacterFromNumber(lastElement) {
        const strConcat = String(lastElement);
        const digits = strConcat.split('');
        digits.pop();
        const temp = digits.join('');
    
        this.updateResultAndNumerate(temp);
    },
    
    removeLastElement() {
        this.result.pop();
        this.numerate = this.result[this.result.length - 1];
        this.indexing = 0;
    },
    
    updateResultAndNumerate(temp) {
        this.result[this.result.length - 1] = temp;
        this.numerate=temp;
        if (temp.length === 0) {
            this.result.pop();
            this.indexing = 0;
            this.numerate = '0';
            this.result = [this.defaultValue];
        }
    },
    toggleValue(){
        const lastNumber = parseFloat(this.result[this.result.length - 1]);
        if (!isNaN(lastNumber) && lastNumber !== 0) {
            this.result[this.result.length - 1] = (lastNumber * -1).toString();
          
            this.displayResult();
        }
    },
    calculate() {
        if(this.result.length === 3){
            let total = this.reasonOfTwo();
            this.result = [total];
            this.indexing = 0;
            this.numerate =total.toString();//?
            this.displayResult();
        }    
    },
    sentinel() {
        document.getElementById('input').innerHTML = '';
        document.getElementById('output').innerHTML = this.defaultValue;
        this.result = [this.defaultValue];
    }
};

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', event => {
        event.stopPropagation();
    });
});

//keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (!isNaN(key) || key === '.' || key === '+' || key === '-' || key === '*' || key === '/') {
        main.addValue(key);
    } else if (key === 'Enter') {
        main.calculate();
    } else if (key === 'Backspace') {
        main.backspace();
    } else if (key === 'Escape') {
        main.clearDisplay();
    }
});
main.sentinel();
