const SmartTextFormatter = {
    // Clean text: remove extra spaces, lowercase, strip HTML
    cleanText(input) {
        return input
            .replace(/<[^>]*>/g, '')  // Remove HTML tags
            .replace(/\s+/g, ' ')     // Collapse whitespace
            .trim()
            .toLowerCase();
    },

    // Format text: title case, add line breaks
    formatText(input) {
        return input
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .replace(/\. /g, '.  ')  // Space after periods
            .match(/.{1,80}/g)?.join('\n') || input;
    },

    // Generate comprehensive stats
    generateStats(input) {
        const clean = this.cleanText(input);
        const chars = clean.replace(/\s/g, '');  // No spaces
        const words = clean.split(/\s+/).filter(w => w);
        const sentences = clean.split(/[.!?]+/).filter(s => s.trim());
        
        const charCount = {};
        chars.split('').forEach(c => {
            charCount[c] = (charCount[c] || 0) + 1;
        });

        return {
            wordCount: words.length,
            charCount: chars.length,
            sentenceCount: sentences.length,
            avgWordLength: (chars.length / words.length).toFixed(2),
            mostCommonChar: Object.entries(charCount)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
            charFreq: charCount
        };
    }
};

// UI handlers
function cleanText() {
    const input = document.getElementById('inputText').value;
    document.getElementById('outputText').value = SmartTextFormatter.cleanText(input);
}

function formatText() {
    const input = document.getElementById('inputText').value;
    document.getElementById('outputText').value = SmartTextFormatter.formatText(input);
}

function generateStats() {
    const input = document.getElementById('inputText').value;
    const stats = SmartTextFormatter.generateStats(input);
    document.getElementById('outputText').value = JSON.stringify(stats.charFreq, null, 2);
    
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <strong>Words:</strong> ${stats.wordCount} | 
        <strong>Chars:</strong> ${stats.charCount} | 
        <strong>Sentences:</strong> ${stats.sentenceCount} | 
        <strong>Avg Word Len:</strong> ${stats.avgWordLength}<br>
        <strong>Most Common Char:</strong> ${stats.mostCommonChar}
    `;
}
