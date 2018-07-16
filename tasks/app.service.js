const gulp = require('gulp');
const args = require('./lib/args');
const child = require('child_process');

gulp.task('app.service', (cb) =>{
  let env = process.env;

  if(args.production)
    env.PROD = true;

  let bg = child.spawn('node', ['index.js'], { cwd: 'app.service', shell: true, env:env });
  
  bg.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  bg.stderr.on('data', (data) => {
    console.log('\x1b[31m', data.toString());
  });
  
  bg.on('close', (code) => {
    cb();
  });
})
