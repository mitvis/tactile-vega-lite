import { render } from 'solid-js/web';
import { setWorkerUrl } from 'tactile-vega-lite';
import { App } from './components/App';
import './style.css';

// Set the worker URL for braille translation
// Use base path for production deployment
const basePath = process.env.NODE_ENV === 'production' ? '/tactile-vega-lite/' : '/';
setWorkerUrl(`${basePath}worker.js`);

// Render the app
const root = document.getElementById('root');
if (root) {
  render(() => <App />, root);
} else {
  console.error('Root element not found');
}
