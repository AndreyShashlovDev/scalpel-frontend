const {execSync} = require('child_process')
const http = require('http')

console.log('Building application...')
execSync('yarn build', {stdio: 'inherit'})

console.log('Starting preview server...')
const serverProcess = require('child_process').spawn('yarn', ['preview'], {
  stdio: ['ignore', 'pipe', 'inherit'], shell: true,
})

serverProcess.stdout.on('data', (data) => {
  console.log(data.toString())
  if (data.toString().includes('Local:')) {
    console.log('Server is ready to handle requests')
  }
})

function checkServerReady() {
  http.get('http://localhost:4173', (res) => {
    if (res.statusCode === 200) {
      console.log('Server is ready to handle requests')
    }
  }).on('error', (err) => {
    setTimeout(checkServerReady, 1000)
  })
}

setTimeout(checkServerReady, 2000)

process.on('SIGINT', () => {
  serverProcess.kill()
  process.exit(0)
})
