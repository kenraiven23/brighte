import { describe, expect, it } from "@jest/globals";
import supertest from "supertest";

const url = `http://localhost:4000`;
const request = supertest(url);

describe("GraphQL", () => {
  it("Validate leads query, return 200", async () => {
    const result = await request.post("/graphql").send({
      query: `query Leads {
        leads {
            id
            name
            total
        }
    }
    `,
    });
    expect(result.statusCode).toEqual(200);
  });

  it("Passing invalid leads query, return 'errors' propery", async () => {
    const result = await request.post("/graphql").send({
      query: `query Leads {
        leads {
            id
            name
            total
            addedfield
        }
    }
    `,
    });
    expect(result.body).toHaveProperty("errors");
  });

  it("Get valid lead query, return id, name, total", async () => {
    const result = await request.post("/graphql").send({
      query: `query Lead {
          lead(id: 1) {
              id
              name
              total
          }
      }
    `,
    });
    expect(result.body.data.lead).toHaveProperty('id');
    expect(result.body.data.lead).toHaveProperty('name');
    expect(result.body.data.lead).toHaveProperty('total');
  });

  it("Get invalid lead query, return null", async () => {
    const result = await request.post("/graphql").send({
      query: `query Lead {
          lead(id: 7) {
              id
              name
              total
          }
      }
    `,
    });
    expect(result.body.data.lead).toBeNull();
  });


  it("Create customer mutation with missing required field, return error", async () => {
    const result = await request.post("/graphql").send({
      query: `mutation Customer {
        customer(
            email: "test@r"
            mobile: "982345246"
            post_code: "23456"
            service_interest: ["delivery", "payment"]
        ) {
            id
            name
            email
            mobile
            post_code
            service_interest
        }
    }
    `,
    });
    expect(result.body).toHaveProperty("errors");
    expect(result.body.data.customer).toBeNull();
  });
});
