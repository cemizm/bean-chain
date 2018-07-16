const gulp = require('gulp');
const child = require('child_process');

gulp.task('hyperledger.start', (cb) =>{
  let bg = child.spawn('./start.sh', [], { cwd: 'hyperledger', shell: true });
  
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
