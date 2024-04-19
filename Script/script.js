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
        if (b === 0) {
            document.getElementById('result').value = "Cannot divide by zero";
            throw new Error('Division by zero');
        }
        return a / b;
    },
    mod: (a,b)=>{
        return a % b;
    },
    operate(operator, a, b) {
        switch (operator) {
            case '+':
                return this.add(a, b);
            case '-':
                return this.subtract(a, b);
            case '*':
                return this.multiply(a, b);
            case '/':
                return this.divide(a, b);
            case '%':
                return this.mod(a,b);
            default:
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
            // Check if the existing number already contains a decimal point
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
                 // Remove leading zeros except for a single zero
                while (temp.length > 1 && temp[0] === '0') {
                    temp.shift();
                }

                // Join the filtered array back into a string
                this.numerate = temp.join('');
            }          
        }
        
         // Update the last element of the result array with the modified number
         this.result[this.indexing] = this.numerate;
         
    },
    operationsCheck(value){
        if (!this.SYMBOLS.includes(value)) return;       

        this.result.push(value);
        if(this.result.length > 3){
            this.reduceOperations();            
        }
         //reset numerate to start a new number composition
         this.numerate='0';
         this.indexing+=2;

    },
    reasonOfTwo(){
        const num1 = parseFloat(this.result[this.indexing - 2]);
        console.log('num1', num1)
        const num2 = parseFloat(this.result[this.indexing]);
        console.log('num2', num2)
        const operator = this.result[this.indexing - 1];
        console.log('operator', operator)
        return this.operate(operator, num1, num2);
    },
    reduceOperations(){;
        //proceed to operate 2 numbers
        const tempOperation = this.result.pop();
        try {

            let total = this.reasonOfTwo();
            this.result = [total, tempOperation];
            this.indexing = 0;
            // this.numerate = '0';//?
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
        // console.log('DISPLAY INDEXING', this.indexing)
        document.getElementById('input').innerHTML = this.result.join('');
        document.getElementById('output').innerHTML = this.lastNumberType();
    },
    lastNumberType(){
        const lastIndex = this.result.findLastIndex((element) => !this.SYMBOLS.includes(element));

        // If a number is found, return it, otherwise return null, it doesn't suppose to pass here
        return lastIndex !== -1 ? this.result[lastIndex] : null;
    },
    clearDisplay() {
        this.result=[];
        this.numerate="0";
        this.indexing=0;
        this.sentinel();
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
    
        if (temp.length === 0) {
            this.result.pop();
            this.indexing = 0;
            this.numerate = '0';
        }
    },
    toggleValue(){
        // Check if the last element in the result is a number
        const lastNumber = parseFloat(this.result[this.result.length - 1]);
        if (!isNaN(lastNumber) && lastNumber !== 0) {
            this.result[this.result.length - 1] = (lastNumber * -1).toString();
            // Update the display
            this.displayResult();
        }
    },
    makeSpecialCalculation() {
        // In case
    },

    calculate() {
        if(this.result.length === 3){
            let total = this.reasonOfTwo();
             //reset indexing
            // Update the result array with the result of the previous operation and the new operator
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
main.sentinel();