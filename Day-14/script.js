
class LabConsole {
    constructor() {
        this.execCount = 0;
        this.successCount = 0;
        this.display = document.getElementById('display');
        this.userInput = document.getElementById('userInput');
        this.lastOp = '-';
        this.init();
    }

    init() {
        this.updateDisplay('Lab Console Initialized! Ready for Day 14 practice.');
        this.bindEvents();
        this.updateStats();
    }

    updateDisplay(message) {
        const now = new Date().toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        this.display.innerHTML = `
            <div><strong>[${now}]</strong> ${message}</div>
            <hr style="margin: 10px 0; border-color: #333;">
            ${this.display.innerHTML}
        `;
        this.display.scrollTop = 0;
        this.display.classList.add('active');
        setTimeout(() => this.display.classList.remove('active'), 1000);
    }

    bindEvents() {
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processInput(e.target.value);
                e.target.value = '';
            }
        });
    }

    processInput(input) {
        this.execCount++;
        const trimmed = input.trim();
        
        if (!trimmed) {
            this.updateDisplay('Empty input. Try: "1,2,3" for arrays or "radar" for palindrome.');
            this.updateStats();
            return;
        }

        try {
            if (trimmed.includes(',')) {
                const nums = trimmed
                    .split(',')
                    .map(n => parseFloat(n.trim()))
                    .filter(n => !isNaN(n));
                if (nums.length) {
                    const evens = nums.filter(n => n % 2 === 0);
                    const sum = nums.reduce((a, b) => a + b, 0);
                    this.updateDisplay(`Array [${nums}] → Evens: [${evens}], Sum: ${sum}`);
                    this.successCount++;
                } else {
                    this.updateDisplay('No valid numbers found.');
                }
            } else {
                const clean = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
                const isPalindrome = clean === clean.split('').reverse().join('');
                this.updateDisplay(`"${trimmed}" → ${isPalindrome ? 'PALINDROME' : 'Not Palindrome'}`);
                this.successCount++;
            }
        } catch (error) {
            this.updateDisplay(`Error: ${error.message}`);
        }
        
        this.lastOp = trimmed;
        this.updateStats();
    }

    testCalculator() {
        this.execCount++;
        const result = this.calculator(15, 3, '/');
        this.updateDisplay(`Calculator: 15 ÷ 3 = ${result}`);
        this.successCount++;
        this.lastOp = 'calculator';
        this.updateStats();
    }

    testArrayOps() {
        this.execCount++;
        const arr = [1, 2, 3, 4, 5, 6];
        const evens = arr.filter(n => n % 2 === 0);
        this.updateDisplay(`Array [${arr}] → Even numbers: [${evens}]`);
        this.successCount++;
        this.lastOp = 'arrayOps';
        this.updateStats();
    }

    testPalindrome() {
        this.execCount++;
        const result = this.isPalindrome('A man a plan a canal Panama');
        this.updateDisplay(`"A man a plan a canal Panama" → ${result ? 'PALINDROME' : 'Not Palindrome'}`);
        this.successCount++;
        this.lastOp = 'palindrome';
        this.updateStats();
    }

    calculator(a, b, op) {
        switch(op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error: Division by zero';
            default: return 'Invalid operation';
        }
    }

    isPalindrome(str) {
        const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === clean.split('').reverse().join('');
    }

    updateStats() {
        document.getElementById('execCount').textContent = this.execCount;
        const rate = this.execCount ? Math.round((this.successCount / this.execCount) * 100) : 100;
        document.getElementById('successRate').textContent = `${rate}%`;
        document.getElementById('lastOp').textContent = this.lastOp || '-';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.labConsole = new LabConsole();
    console.log('Day 14 Practice Lab loaded.');
});
