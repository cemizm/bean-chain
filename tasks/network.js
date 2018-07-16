const gulp = require('gulp');
const gulpSequence = require('gulp-sequence')

gulp.task('network', gulpSequence(
  'hyperledger.start',
  'chaincode.install'
))
