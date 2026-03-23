/**
 * Custom Notification System
 * Exposes showNotification(message, type)
 */

(function() {
    // Create container if it doesn't exist
    function getContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a notification
     * @param {string} message - The message to display
     * @param {string} type - 'success', 'error', or 'info'
     */
    window.showNotification = function(message, type = 'info') {
        console.log(`[Notification] Showing ${type} message: ${message}`);
        const container = getContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Define icons based on type
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#34A853"/></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#EA4335"/></svg>`;
        } else {
            iconSvg = `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#00B7FF"/></svg>`;
        }

        notification.innerHTML = `
            <div class="notification-content">
                ${iconSvg}
                <div class="notification-message">${message}</div>
                <div class="notification-close">&times;</div>
            </div>
            <button class="notification-ok">OK</button>
        `;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Manual dismiss (OK button)
        const okBtn = notification.querySelector('.notification-ok');
        okBtn.onclick = () => {
            dismiss();
        };

        // Manual dismiss (Close X)
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.onclick = () => {
            dismiss();
        };

        function dismiss() {
            console.log('[Notification] Dismissing notification');
            notification.classList.add('hide');
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }
    };

    // Global Error Handler
    window.addEventListener('error', function(event) {
        // Ignore cross-origin script errors or minor issues
        if (event.message.includes('Script error')) return;
        
        window.showNotification(`Error: ${event.message}`, 'error');
    });

    window.addEventListener('unhandledrejection', function(event) {
        window.showNotification(`Error: ${event.reason || 'Unhandled Promise Rejection'}`, 'error');
    });
})();
