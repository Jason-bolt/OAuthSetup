import sinon from "sinon";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../../config/express";
import "mocha";
import { StatusCodes } from "http-status-codes";
import oauthService from "../service";
import db from "../../../config/database";

chai.use(chaiHttp);

const prefix = "/api/v1/auth";

const userValue = {
  id: 1,
  email: "test@test.com",
  first_name: "test",
  last_name: "test",
  image_url: "test.com",
  email_verified: true,
};

const getNull = async () => null;
const getUser = async () => userValue;

describe("OAUTH INTEGRATION TESTS", () => {
  let fetchStub: sinon.SinonStub;
  afterEach(function () {
    sinon.restore();
    fetchStub.restore();
  });

  beforeEach(() => {
    fetchStub = sinon.stub(global, "fetch");
  });

  describe("GOOGLE", () => {
    it("should initiate google oauth successfully", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      const res = await chai.request(app).get(`${prefix}/google?state=123`);
      expect(res.status).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property("data");
      expect(res.body?.data).to.be.a("string");
    });

    it("should fail to initiate google oauth - server error", async () => {
      sinon.replace(db, "none", sinon.fake.rejects([]));
      const res = await chai.request(app).get(`${prefix}/google?state=123`);
      expect(res.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("should complete google oauth successfully", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      sinon.replace(db, "oneOrNone", sinon.fake.returns(getNull()));
      const mockResponse = {
        json: () =>
          Promise.resolve({
            id_token: "mock-token",
            userData: {
              email: "test@test.com",
              first_name: "test",
              last_name: "test",
              image_url: "test.com",
              email_verified: true,
            },
          }),
      };
      fetchStub.resolves(mockResponse as Response);
      const res = await chai
        .request(app)
        .get(`${prefix}/google/callback?code=123?state=123`);
      expect(res.status).to.equal(StatusCodes.OK);
    });

    it("should complete google oauth successfully - user already exists", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      sinon.replace(db, "oneOrNone", sinon.fake.resolves(getUser()));
      const mockResponse = {
        json: () =>
          Promise.resolve({
            id_token: "mock-token",
            userData: {
              email: "test@test.com",
              first_name: "test",
              last_name: "test",
              image_url: "test.com",
              email_verified: true,
            },
          }),
      };
      fetchStub.resolves(mockResponse as Response);
      const res = await chai
        .request(app)
        .get(`${prefix}/google/callback?code=123?state=123`);
      expect(res.status).to.equal(StatusCodes.OK);
    });

    it("should fail to complete google oauth successfully - server error", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      sinon.replace(db, "oneOrNone", sinon.fake.rejects([]));
      const mockResponse = {
        json: () =>
          Promise.resolve({
            id_token: "mock-token",
            userData: {
              email: "test@test.com",
              first_name: "test",
              last_name: "test",
              image_url: "test.com",
              email_verified: true,
            },
          }),
      };
      fetchStub.resolves(mockResponse as Response);
      const res = await chai
        .request(app)
        .get(`${prefix}/google/callback?code=123?state=123`);
      expect(res.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("FACEBOOK", () => {
    it("should initiate facebook oauth successfully", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      const res = await chai.request(app).get(`${prefix}/facebook?state=123`);
      expect(res.status).to.equal(StatusCodes.OK);
      expect(res.body).to.have.property("data");
      expect(res.body?.data).to.be.a("string");
    });

    it("should fail to initiate facebook oauth - server error", async () => {
      sinon.replace(db, "none", sinon.fake.rejects([]));
      const res = await chai.request(app).get(`${prefix}/facebook?state=123`);
      expect(res.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("should complete facebook oauth successfully", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      sinon.replace(db, "oneOrNone", sinon.fake.returns(getNull()));
      const mockResponse = {
        json: () =>
          Promise.resolve({
            access_token: "mock-token",
            email: "test@test.com",
            name: "test test",
            picture: {
              data: {
                url: "test.com",
              },
            },
            email_verified: true,
          }),
      };
      fetchStub.resolves(mockResponse as Response);
      const res = await chai
        .request(app)
        .get(`${prefix}/facebook/callback?code=123?state=123`);
      expect(res.status).to.equal(StatusCodes.OK);
    });

    it("should complete facebook oauth successfully - user already exists", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      sinon.replace(db, "oneOrNone", sinon.fake.resolves(getUser()));
      const mockResponse = {
        json: () =>
          Promise.resolve({
            access_token: "mock-token",
            email: "test@test.com",
            name: "test test",
            picture: {
              data: {
                url: "test.com",
              },
            },
            email_verified: true,
          }),
      };
      fetchStub.resolves(mockResponse as Response);
      const res = await chai
        .request(app)
        .get(`${prefix}/facebook/callback?code=123?state=123`);
      expect(res.status).to.equal(StatusCodes.OK);
    });

    it("should fail to complete facebook oauth successfully - server error", async () => {
      sinon.replace(db, "none", sinon.fake.returns(getNull()));
      sinon.replace(db, "oneOrNone", sinon.fake.rejects([]));
      const mockResponse = {
        json: () =>
          Promise.resolve({
            access_token: "mock-token",
            email: "test@test.com",
            name: "test test",
            picture: {
              data: {
                url: "test.com",
              },
            },
            email_verified: true,
          }),
      };
      fetchStub.resolves(mockResponse as Response);
      const res = await chai
        .request(app)
        .get(`${prefix}/facebook/callback?code=123?state=123`);
      expect(res.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
