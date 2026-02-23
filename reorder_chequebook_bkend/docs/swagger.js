const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Reorder Cheque Book API",
      version: "1.0.0",
      description: `
Backend service for cheque book reordering and maker-checker approval workflows.

### Features
- JWT Authentication
- Maker–Checker approvals
- Audit tracking
- Email notifications

### Authentication
Click **Authorize** and enter your token:

\`Bearer <JWT_TOKEN>\`
      `,
      contact: {
        name: "Backend Engineering Team",
        email: "chijioke.ihedioha@fasylng.com",
      },
      license: {
        name: "FASYL",
        url: "https://fasylgroup.com",
      },
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
      {
        url: "https://api.bank.com",
        description: "Production server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Login and token management",
      },
      // {
      //   name: "Users",
      //   description: "User management operations",
      // },
      {
        name: "Customers",
        description: "Customer account operations",
      },
      {
        name: "Subscriptions",
        description: "Cheque book reorder subscription management",
      }
      // {
      //   name: "Cheque Requests",
      //   description: "Cheque book request and authorization operations",
      // }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        // ChequeRequest: {
        //   type: "object",
        //   required: ["accountNumber", "chequeLeaves"],
        //   properties: {
        //     accountNumber: {
        //       type: "string",
        //       example: "0123456789",
        //     },
        //     chequeLeaves: {
        //       type: "integer",
        //       example: 50,
        //     },
        //     deliveryMode: {
        //       type: "string",
        //       example: "BRANCH_PICKUP",
        //     },
        //   },
        // },

        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              example: "JOHN.DOE",
            },
            password: {
              type: "string",
              example: "password123",
            },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                USERNAME: {
                  type: "string",
                  example: "JOHN.DOE",
                },
                GROUP_CODE: {
                  type: "string",
                  example: "brn_user",
                },
                USER_STATUS: {
                  type: "string",
                  example: "A",
                },
                FULLNAME: {
                  type: "string",
                  example: "John Doe",
                },
                BRANCH_CODE: {
                  type: "string",
                  example: "001",
                },
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  description: "JWT authentication token",
                },
              },
            },
          },
        },

        ApprovalRequest: {
          type: "object",
          properties: {
            reason: {
              type: "string",
              example: "Verified and approved",
            },
            additional_notes: {
              type: "string",
              example: "Customer identity confirmed",
            },
          },
        },

        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
              nullable: true,
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "string",
              nullable: true,
            },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ["./src/routes/*.js", "./server.js"],
};

module.exports = swaggerJSDoc(options);
