document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const codeEditor = document.getElementById('codeEditor');
    const runBtn = document.getElementById('runBtn');
    const consoleOutput = document.getElementById('consoleOutput');
    const selectedDay = document.getElementById('selectedDay');

    // Update day dynamically (could be passed as parameter)
    selectedDay.textContent = '15';

    // Custom console.log override
    const originalLog = console.log;
    console.log = function(...args) {
        originalLog.apply(console, args);
        const output = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
        consoleOutput.textContent += `> ${output}\n`;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    // Custom console.error
    const originalError = console.error;
    console.error = function(...args) {
        originalError.apply(console, args);
        const output = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
        consoleOutput.textContent += `ERROR: ${output}\n`;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    runBtn.addEventListener('click', function() {
        const code = codeEditor.value;
        consoleOutput.textContent = '> Running code...\n';
        
        try {
            // Create a safe execution context
            const func = new Function('display', 'console', code);
            func(display, console);
            display.style.background = 'linear-gradient(145deg, #d4edda, #c3e6cb)';
            display.style.color = '#155724';
        } catch (error) {
            console.error('Execution Error:', error.message);
            display.innerHTML = `Error: ${error.message}`;
            display.style.background = 'linear-gradient(145deg, #f8d7da, #f5c6cb)';
            display.style.color = '#721c24';
        }
        
        setTimeout(() => {
            display.style.background = '';
            display.style.color = '';
        }, 2000);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            runBtn.click();
        }
    });

    // Auto-resize textarea
    codeEditor.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Welcome message
    console.log('Day 15 Practice Lab loaded successfully!');
    console.log('Tip: Use Ctrl+Enter to run your code');
});
