
const statusEl = document.querySelector('#status');
const outputEl = document.querySelector('#output');

const buttons = document.querySelectorAll('button[data-url]');
function formatBody(text) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
async function callApi(method, url) {
  statusEl.textContent = 'Loading';
  statusEl.className = '';
  outputEl.textContent = `${method} ${url}`;

  try {
    const response = await fetch(url, { method });
    const text = await response.text();

    statusEl.textContent = `${response.status} ${response.statusText}`;
    statusEl.className = response.ok ? 'ok' : 'error';
    outputEl.textContent = formatBody(text);
  } catch (error) {
    statusEl.textContent = 'Network error';
    statusEl.className = 'error';
    outputEl.textContent = `Could not reach the server: ${error.message}`;
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    callApi(button.dataset.method, button.dataset.url);
  });
});