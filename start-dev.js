const { spawn } = require('child_process');
const path = require('path');

// Function to start a process with the given command and working directory
function startProcess(command, args, cwd, name) {
  console.log(`Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe'
  });
  
  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`[${name} ERROR] ${data.toString().trim()}`);
  });
  
  process.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });
  
  return process;
}

// Start the backend server
const backendPath = path.join(__dirname, 'backend');
const backendProcess = startProcess('npm', ['run', 'dev'], backendPath, 'Backend');

// Start the frontend development server
const frontendPath = path.join(__dirname, 'frontend');
const frontendProcess = startProcess('npm', ['start'], frontendPath, 'Frontend');

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping all processes...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
});

console.log('\nDevelopment servers started!');
console.log('- Backend running on: http://localhost:4000');
console.log('- Frontend running on: http://localhost:3000');
console.log('\nPress Ctrl+C to stop both servers.\n');
