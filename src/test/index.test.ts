import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import resolver from "../customer/resolver";
import { Client } from "pg";

describe("Brighte Eats", () => {
  jest.mock("pg", () => {
    const mClient = {
      connect: jest.fn(),
      query: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
  });

  let client: any;

  const createUserData = {
    name: "test",
    email: "test@brighte.com",
    mobile: "982345246",
    post_code: "23456",
    service_interest: Array<string>(),
  };

  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Create customer with correct payload, return 200", async () => {
    createUserData.service_interest = ["delivery", "payment"];

    const serviceInterest = [
      {
        id: 1,
        name: "delivery",
      },
      {
        id: 3,
        name: "payment",
      },
    ];

    jest
      .spyOn(client, "query")
      .mockResolvedValueOnce({ rowCount: 0, rows: [] });

    jest
      .spyOn(client, "query")
      .mockResolvedValueOnce({ rows: serviceInterest, rowCount: 2 });

    jest.spyOn(client, "query").mockResolvedValueOnce({ rows: [{ id: 1 }] });

    jest.spyOn(client, "query").mockResolvedValueOnce({ rows: [1] });

    await resolver.Mutation.customer(null, createUserData, { db: client });

    expect(client.query).toHaveBeenCalledTimes(4);
    expect(client.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM customers WHERE email=($1)",
      [createUserData.email]
    );
    expect(client.query).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM service_interest WHERE name IN ($1,$2)",
      createUserData.service_interest
    );
    expect(client.query).toHaveBeenNthCalledWith(
      3,
      "INSERT INTO customers (name, email, mobile, post_code) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        createUserData.name,
        createUserData.email,
        createUserData.mobile,
        createUserData.post_code,
      ]
    );
    expect(client.query).toHaveBeenNthCalledWith(
      4,
      "INSERT INTO customer_service_interest (customer_id, service_interest_id) VALUES (1, 1),(1, 3)"
    );
  });

  it("Create customer with existing email, return error", async () => {
    createUserData.service_interest = ["delivery", "payment"]

    jest.spyOn(client, "query").mockResolvedValueOnce({ rowCount: 1 });

    await expect(
      resolver.Mutation.customer(null, createUserData, {
        db: client,
      })
    ).rejects.toThrow("Email already exists");
  });

  it("Create customer with incorrect service_interest payload, return error", async () => {
    createUserData.service_interest = ["delivery", "online"];

    const serviceInterest = [
      {
        id: 1,
        name: "delivery",
      },
    ];

    jest
      .spyOn(client, "query")
      .mockResolvedValueOnce({ rowCount: 0, rows: [] });

    jest
      .spyOn(client, "query")
      .mockResolvedValueOnce({ rows: serviceInterest, rowCount: 1 });

    await expect(
      resolver.Mutation.customer(null, createUserData, {
        db: client,
      })
    ).rejects.toThrow("Invalid service interest value");
  });

  it("Create customer with incorrect service_interest payload, return error", async () => {
    createUserData.email = "invalidemail";
    createUserData.service_interest = ["delivery", "payment"];

    await expect(
      resolver.Mutation.customer(null, createUserData, {
        db: client,
      })
    ).rejects.toThrow("Invalid email");
  });

  // it("Passing invalid leads query, return 'errors' propery", async () => {
  //   const result = await request.post("/graphql").send({
  //     query: `query Leads {
  //       leads {
  //           id
  //           name
  //           total
  //           addedfield
  //       }
  //   }
  //   `,
  //   });
  //   expect(result.body).toHaveProperty("errors");
  // });

  // it("Get valid lead query, return id, name, total", async () => {
  //   const result = await request.post("/graphql").send({
  //     query: `query Lead {
  //         lead(id: 1) {
  //             id
  //             name
  //             total
  //         }
  //     }
  //   `,
  //   });
  //   expect(result.body.data.lead).toHaveProperty("id");
  //   expect(result.body.data.lead).toHaveProperty("name");
  //   expect(result.body.data.lead).toHaveProperty("total");
  // });

  // it("Get invalid lead query, return null", async () => {
  //   const result = await request.post("/graphql").send({
  //     query: `query Lead {
  //         lead(id: 7) {
  //             id
  //             name
  //             total
  //         }
  //     }
  //   `,
  //   });
  //   expect(result.body.data.lead).toBeNull();
  // });

  // it("Create customer mutation with missing required field, return error", async () => {
  //   const result = await request.post("/graphql").send({
  //     query: `mutation Customer {
  //       customer(
  //           email: "test@r"
  //           mobile: "982345246"
  //           post_code: "23456"
  //           service_interest: ["delivery", "payment"]
  //       ) {
  //           id
  //           name
  //           email
  //           mobile
  //           post_code
  //           service_interest
  //       }
  //   }
  //   `,
  //   });
  //   expect(result.body).toHaveProperty("errors");
  //   expect(result.body.data.customer).toBeNull();
  // });
});
