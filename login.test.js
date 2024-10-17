const assert = require("assert");
const request = require("supertest");

const baseUrl = "https://api-practice-r4qr.onrender.com";

describe("Login Flow", () => {
  it("should login successfully and retrieve access token", async () => {
    const credentials = {
      username: "user",
      password: "P!ssw0rd",
    };

    const response = await request(baseUrl)
      .post("/api/auth/login")
      .send(credentials);

    // Assert successful response and access token presence
    assert.strictEqual(response.statusCode, 200, "Login request failed");
    assert.ok(response.body.token, "Access token not found in response");

    const accessToken = response.body.token;

    // Test successful access to protected endpoint
    const accountResponse = await request(baseUrl)
      .get("/api/account")
      .set("Authorization", `Bearer ${accessToken}`);

    assert.strictEqual(
      accountResponse.statusCode,
      200,
      "Protected endpoint access failed"
    );
    assert.ok(accountResponse.body.username, "Username not found in response");
    assert.strictEqual(
      accountResponse.body.username,
      credentials.username,
      "Incorrect username retrieved"
    );
  });

  it("should fail login with incorrect credentials", async () => {
    const wrongCredentials = {
      username: "user",
      password: "wrongPassword",
    };

    const response = await request(baseUrl)
      .post("/api/auth/login")
      .send(wrongCredentials);

    assert.strictEqual(
      response.statusCode,
      400,
      "Login request failed (expected 400)"
    );
    assert.ok(response.body.error, "Error object not found in response");
    assert.strictEqual(
      response.body.error.message,
      "password is incorrect",
      "Incorrect error message"
    );
    assert.strictEqual(response.body.error.code, 400, "Incorrect error code");
  });
});
