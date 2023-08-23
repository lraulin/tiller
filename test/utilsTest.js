import { expect } from "chai";
import { ascending, descending, getDateRange } from "../src/utils.js";

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

describe("getDateRange", () => {
  it("returns the an array of all dates between the given dates, inclusive", () => {
    const res = getDateRange(
      new Date("08/01/2023"),
      new Date("08/05/2023"),
      "day"
    );
    expect(res).to.deep.equal([
      new Date("8/5/2023"),
      new Date("8/4/2023"),
      new Date("8/3/2023"),
      new Date("8/2/2023"),
      new Date("8/1/2023"),
    ]);
  });

  it("works when dates are backwards", () => {
    const res = getDateRange(
      new Date("08/05/2023"),
      new Date("08/01/2023"),
      "day"
    );
    expect(res).to.deep.equal([
      new Date("8/5/2023"),
      new Date("8/4/2023"),
      new Date("8/3/2023"),
      new Date("8/2/2023"),
      new Date("8/1/2023"),
    ]);
  });
});
