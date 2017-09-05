var app = require('../server/webappService')();
let sinon = require('sinon');
let User = require('./../models/user.js');
var supertest=require('supertest');
var expect = require('chai').expect;
var should = require('should');
var mongoose = require('mongoose');
require('sinon-as-promised');
require('sinon-mongoose');

var url=supertest("http://localhost:3000");

//sinon test for user.js
describe('User test', () => {
    it('should add the user', (done) => {
      var user = mongoose.model('User');
      var myStub = sinon.stub(User, 'save');
      url
        .post('/users/signup')
        .send({"username": "xyzw", "password":"xyz", "number": "1234567890"})
        .expect(201)
        .end(function(err,res){
          should.not.exist(err);
          myStub.restore();
          done();
        });
        });
    });
