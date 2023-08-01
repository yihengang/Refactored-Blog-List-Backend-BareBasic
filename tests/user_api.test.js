const supertest = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");
const User = require("../models/user");
const helper = require("./test_helper.js");
const bcrypt = require("bcrypt");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash1 = await bcrypt.hash("password1", 10);
  const passwordHash2 = await bcrypt.hash("password2", 10);
  const passwordHash3 = await bcrypt.hash("password3", 10);
  //   let newUser = new User({
  //     username: "Username 1",
  //     passwordHash: passwordHash1,
  //   });
  //   await newUser.save();
  //   newUser = new User({
  //     username: "Username 2",
  //     passwordHash: passwordHash2,
  //   });
  //   await newUser.save();
  //   newUser = new User({
  //     username: "Username 3",
  //     passwordHash: passwordHash3,
  //   });
  //   await newUser.save();

  let newUser = new User({
    ...helper.initialUsers[0],
    passwordHash: passwordHash1,
  });
  await newUser.save();
  newUser = new User({
    ...helper.initialUsers[1],
    passwordHash: passwordHash2,
  });
  await newUser.save();
  newUser = new User({
    ...helper.initialUsers[2],
    passwordHash: passwordHash3,
  });
  await newUser.save();
});

//test that a user is indeed in
//give one without username - should fail
//give one without password - should fail
//give one with username.length < 3 - should fail
//give one with password.length < 3 - should fail

describe("Default test database", () => {
  test("initialUsers array are initialized into test database and new user successfully added", async () => {
    const newUser = {
      username: "Username 4",
      name: "Name 4",
      password: "password4",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/users")
      .expect("Content-Type", /application\/json/);

    const usernameList = response.body.map((user) => user.username);

    expect(response.body).toHaveLength(helper.initialUsers.length + 1);
    expect(usernameList).toContain("Username 4");
  });
});

describe("Invalid users should not be added", () => {
  test("400 Bad request response if username property is missing", async () => {
    const newUser = {
      username: "",
      name: "Name 4",
      password: "password4",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const response = await api
      .get("/api/users")
      .expect("Content-Type", /application\/json/);

    const nameList = response.body.map((user) => user.name);

    expect(response.body).toHaveLength(helper.initialUsers.length);
    expect(nameList).not.toContain("Name 4");
  });

  test("400 Bad request response if password property is missing", async () => {
    const newUser = {
      username: "Username 4",
      name: "Name 4",
      password: "",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const response = await api
      .get("/api/users")
      .expect("Content-Type", /application\/json/);

    const usernameList = response.body.map((user) => user.username);

    expect(response.body).toHaveLength(helper.initialUsers.length);
    expect(usernameList).not.toContain("Username 4");
  });

  test("400 Bad request response if username is less than three characters", async () => {
    const newUser = {
      username: "Us",
      name: "Name 4",
      password: "password4",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const response = await api
      .get("/api/users")
      .expect("Content-Type", /application\/json/);

    const nameList = response.body.map((user) => user.username);

    expect(response.body).toHaveLength(helper.initialUsers.length);
    expect(nameList).not.toContain("name 4");
  });

  test("400 Bad request response if password is less than three characters", async () => {
    const newUser = {
      username: "Username 4",
      name: "Name 4",
      password: "pa",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const response = await api
      .get("/api/users")
      .expect("Content-Type", /application\/json/);

    const usernameList = response.body.map((user) => user.username);

    expect(response.body).toHaveLength(helper.initialUsers.length);
    expect(usernameList).not.toContain("Username 4");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
