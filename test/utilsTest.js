import { ascending, camelCase, descending } from "../src/shared/util.js";

import { expect } from "chai";

describe("ascending", () => {
  it("sorts an array in ascending order when used as a sort predicate", () => {
    const arr = [4, 8, 1, 2];
    arr.sort(ascending);
    expect(arr).to.deep.equal([1, 2, 4, 8]);
  });
});

describe("descending", () => {
  it("sorts an array in descending order when used as a sort predicate", () => {
    const arr = [4, 8, 1, 2];
    arr.sort(descending);
    expect(arr).to.deep.equal([8, 4, 2, 1]);
  });
});

// describe("getDateRange", () => {
//   it("returns the an array of all dates between the given dates, inclusive", () => {
//     const res = getDateRange(
//       new Date("08/01/2023"),
//       new Date("08/05/2023"),
//       "day"
//     );
//     expect(res).to.deep.equal([
//       new Date("8/5/2023"),
//       new Date("8/4/2023"),
//       new Date("8/3/2023"),
//       new Date("8/2/2023"),
//       new Date("8/1/2023"),
//     ]);
//   });

//   it("works when dates are backwards", () => {
//     const res = getDateRange(
//       new Date("08/05/2023"),
//       new Date("08/01/2023"),
//       "day"
//     );
//     expect(res).to.deep.equal([
//       new Date("8/5/2023"),
//       new Date("8/4/2023"),
//       new Date("8/3/2023"),
//       new Date("8/2/2023"),
//       new Date("8/1/2023"),
//     ]);
//   });
// });

describe("camelCase function", function () {
  it("should convert string to camelCase", function () {
    const str = "hello world";
    const result = camelCase(str);
    expect(result).to.equal("helloWorld");
  });

  it("should handle single word strings", function () {
    const str = "Hello";
    const result = camelCase(str);
    expect(result).to.equal("hello");
  });

  it("should handle empty strings", function () {
    const str = "";
    const result = camelCase(str);
    expect(result).to.equal("");
  });

  it("should handle strings with multiple spaces", function () {
    const str = "hello   world";
    const result = camelCase(str);
    expect(result).to.equal("helloWorld");
  });

  it("should handle strings with leading and trailing spaces", function () {
    const str = " hello world ";
    const result = camelCase(str);
    expect(result).to.equal("helloWorld");
  });

  it("should handle strings with spaces and all caps", function () {
    const str = " HELLO WORLD ";
    const result = camelCase(str);
    expect(result).to.equal("helloWorld");
  });

  it("should replace # with Number", function () {
    const str = "ACCOUNT#";
    const result = camelCase(str);
    expect(result).to.equal("accountNumber");
  });
});
