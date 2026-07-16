const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if .env exists, if not warn
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Warning: .env file not found at project root.');
  console.log('\x1b[33m%s\x1b[0m', 'Please create a .env file with GEMINI_API_KEY=your_api_key\n');
}

console.log('🚀 Starting AI Study Assistant (Backend & Frontend)...');

// Helper to run commands
function runCommand(command, args, cwd, prefix, colorCode) {
  const processName = spawn(command, args, { 
    cwd, 
    shell: true,
    env: { ...process.env }
  });

  processName.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
    });
  });

  processName.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.error(`\x1b[${colorCode}m[${prefix} ERROR]\x1b[0m ${line}`);
    });
  });

  processName.on('close', (code) => {
    console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m exited with code ${code}`);
  });

  return processName;
}

// Start backend (Express on port 3001)
const backendDir = path.join(__dirname, 'backend');
const backend = runCommand('node', ['server.js'], backendDir, 'Backend', '36'); // Cyan

// Start frontend (Vite dev server)
const frontendDir = path.join(__dirname, 'frontend');
const frontend = runCommand('npm', ['run', 'dev'], frontendDir, 'Frontend', '35'); // Magenta

// Handle termination signals
const cleanup = () => {
  console.log('\n🛑 Stopping processes...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
