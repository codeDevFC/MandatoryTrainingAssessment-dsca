export const showColdStartMessage = () => {
const existing = document.getElementById('cold-start-message');
if (existing) return;
const div = document.createElement('div');
div.id = 'cold-start-message';
div.innerHTML = '<div style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; background: #1e293b; color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-family: monospace;">' +
'🔄 Server waking up - first request may take 15-30s</div>';
document.body.appendChild(div);
};
export const hideColdStartMessage = () => {
const el = document.getElementById('cold-start-message');
if (el) el.remove();
};
