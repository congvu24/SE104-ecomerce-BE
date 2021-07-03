//During the test the env variable is set to test
process.env.NODE_ENV = "TESTING";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

let models = require("../model/index.js");

let token = "";
chai.use(chaiHttp);
describe("User api", () => {
  beforeEach(async (done) => {
    done();
  });
  /*
   * Test the /user/register route
   */
  describe("/POST create user", () => {
    before(async () => {
      //This is sequelize syntax for postgres. You could just take your mongoose syntax here to delete all users
      await models.User.destroy({
        where: {},
        truncate: { cascade: true },
      });
    });
    it("it should return a response with token", (done) => {
      let user = {
        password: "admin",
        birthYear: "2001",
        identify_number: "272818812",
        address: "address user 0",
        email: "admin@shop.com",
        fullname: "Testing account",
        sex: "1",
        phone: "0213123123",
      };

      chai
        .request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.data.should.have.property("token");
          done();
        });
    });
  });

  /*
   * Test the /user/login route
   */
  describe("/POST login user", () => {
    it("it should return a response with token", (done) => {
      let user = {
        password: "admin",
        email: "admin@shop.com",
      };

      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.data.should.have.property("token");
          token = res.body.data.token;
          done();
        });
    });
  });

  /*
   * Test the /user/add-address route
   */
  describe("/POST user address but not login", () => {
    it("it should return 401", (done) => {
      let address = {
        name: "Cong vu",
        phone: "01231230",
        address: "Test address",
      };

      chai
        .request(server)
        .post("/user/add-address")
        .send(address)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("/POST user address but login", () => {
    it("it should return 200", (done) => {
      let address = {
        name: "Cong vu",
        phone: "01231230",
        address: "Test address",
      };

      chai
        .request(server)
        .post("/user/add-address")
        .set({ Authorization: `Bearer ${token}` })
        .send(address)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          done();
        });
    });
  });
});
