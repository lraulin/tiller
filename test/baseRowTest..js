import { baseRowCreator } from "../src/models/base-row.js";
import { expect } from "chai";

describe("BaseRowCreator function", function () {
  const data = [
    ["First Name", "Last Name", "Email", "Phone", "Address", "Mocha"],
    [
      "John",
      "Smith",
      "johnsmith@email.com",
      "422-555-1234",
      "5337 Deer Lane",
      "true",
    ],
  ];
  const expected = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "johnsmith@email.com",
      phone: "422-555-1234",
      address: "5337 Deer Lane",
      mocha: "true",
    },
  ];
  const resultArray = baseRowCreator(data);
  const resultObject = resultArray[0];

  it("should return an object for each row", function () {
    expect(resultArray.length).to.equal(data.length - 1);
  });
  it("should have an asArray property", function () {
    expect(resultObject.asArray).to.deep.equal(data[1]);
  });

  it("should have a headers property", function () {
    expect(resultObject.headers).to.deep.equal(data[0]);
  });

  it("should have a keys property", function () {
    expect(resultObject.keys).to.deep.equal([
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "mocha",
    ]);
  });

  it("should have a firstName property", function () {
    expect(resultObject.firstName).to.equal(data[1][0]);
  });
  it("should have a lastName property", function () {
    expect(resultObject.lastName).to.equal(data[1][1]);
  });
  it("should have a email property", function () {
    expect(resultObject.email).to.equal(data[1][2]);
  });
  it("should have a phone property", function () {
    expect(resultObject.phone).to.equal(data[1][3]);
  });
  it("should have a address property", function () {
    expect(resultObject.address).to.equal(data[1][4]);
  });
  it("should have a mocha property", function () {
    expect(resultObject.mocha).to.equal(data[1][5]);
  });
});
