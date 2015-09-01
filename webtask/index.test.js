import webtask from './bundle.ignored';
import {expect} from 'chai';

describe('webtask', () => {
  it('should work in a basic case', function(done) {
    this.timeout(5000);
    webtask({
      data: {
        baseRepo: 'https://github.com/formly-js/angular-formly-example.git',
        baseBranch: 'master',
        prRepo: 'https://github.com/kentcdodds/angular-formly-example.git',
        prBranch: 'master',
        dryRun: true,
        token: 'WHATEVER_YOU_HAVE'
      }
    }, (err, response) => {
      expect(err).to.be.null;
      expect(response).to.equal('Success');
      done();
    });
  });
});
