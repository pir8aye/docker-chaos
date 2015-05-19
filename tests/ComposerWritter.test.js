var sinon = require('sinon');
var assert = require('chai').assert;
var ComposerSplitter = require('../lib/ComposerSplitter');
var ComposerWritter = require('../lib/ComposerWritter');

suite('ComposerWritter', function(){
    var sut, splitter, fs, fd;

    var component = 'component_1';
    var line = 'some debug line';

    var lineInfo = {component: component, line: line};

    setup(function(){
        fd = 1;
        fs = {open: sinon.stub(), write: sinon.stub(), close: sinon.stub()};
        splitter = sinon.stub(new ComposerSplitter());
        splitter.split.returns(lineInfo);

        sut = new ComposerWritter(splitter, fs);
    });

    suite('#write', function(){
        test('Should call this.splitter.split forwarding the line', function(){
            sut.write(line);
            sinon.assert.calledWith(splitter.split, line);
        });
        test('Should call this.splitter.split forwarding the line', function(){
            sut.write(line);
            sinon.assert.calledWith(splitter.split, line);
        });
        test('Should create a fileStream for the component log is for', function(){
            sut.write(line);
            sinon.assert.calledWith(fs.open, '/tmp/' + lineInfo.component + '.txt', 'a');
        });
        test('Should write to fd returned by fs.open', function(){
            fs.open.yields(null, fd);
            sut.write(line);
            sinon.assert.calledWith(fs.write, fd, line);
        });
        test('Should not call open if we have a fd for that component', function(){
            sut.fd[component] = {fd: 1};
            sut.write(line);
            sinon.assert.notCalled(fs.open);
        });
    });

    suite('#close', function(){
        test('Should call fs.close passing all fd in this.fd', function(){
            sut.fd['first'] = 1;
            sut.fd['second'] = 2;
            sut.close();

            sinon.assert.calledWith(fs.close, 1);
            sinon.assert.calledWith(fs.close, 2);
        });
    });
});




