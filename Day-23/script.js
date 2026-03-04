document.addEventListener('DOMContentLoaded', function() {
    const status = document.getElementById('status');
    const sections = document.querySelectorAll('.step-section');
    
    // Add click interactions for steps
    sections.forEach((section, index) => {
        const h2 = section.querySelector('h2');
        h2.addEventListener('click', () => {
            section.style.transform = 'scale(1.02)';
            section.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                section.style.transform = 'scale(1)';
            }, 200);
            
            // Update status
            status.textContent = `Focus on Step ${index + 1}: ${h2.textContent}`;
            status.style.background = index === 0 ? '#dbeafe' : 
                                     index === 1 ? '#fef3c7' : '#ecfdf5';
        });
    });
    
    // Checklist functionality
    const steps = document.querySelectorAll('.steps li');
    steps.forEach(step => {
        step.addEventListener('click', () => {
            step.classList.toggle('completed');
        });
    });
    
    // Add CSS for completion state
    const style = document.createElement('style');
    style.textContent = `
        .steps li.completed {
            opacity: 0.7;
            text-decoration: line-through;
            background: #d1fae5;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .steps li.completed::before {
            background: #10b981;
        }
    `;
    document.head.appendChild(style);
    
    // Success message after all steps
    setTimeout(() => {
        status.innerHTML = '✅ Great job! Your local MongoDB environment is ready. Check Compass for your visual database.';
        status.style.background = '#d1fae5';
        status.style.borderTopColor = '#10b981';
    }, 3000);
});
