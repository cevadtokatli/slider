const { spawn } = require('child_process')

const script = spawn('yarn', ['run', 'script:dev'])
script.stdout.on('data', data => console.log(String(data)))
script.stderr.on('data', data => console.error(String(data)))
script.on('close', code => console.log(`script exited with code ${code}`))

const style = spawn('yarn', ['run', 'style:dev'])
style.stdout.on('data', data => console.log(String(data)))
style.stderr.on('data', data => console.error(String(data)))
style.on('close', code => console.log(`style exited with code ${code}`))
