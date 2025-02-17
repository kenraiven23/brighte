# Project Title

Backend service for accepting expressions of interest for a new product. This consists of 1 mutation registration of user for getting expression of product interest and 2 query for getting leads.

## Installation

Instructions on how to install and set up the project.

```bash
# Clone the repository
git clone https://github.com/kenraiven23/brighte.git

# Navigate to the project directory
cd your-repo

# Install dependencies
npm install
```


## Running the Project

Instructions on how to run the project with TypeScript and GraphQL.

```bash
# Compile TypeScript
npx tsc 
or
npm run build

# Start the project
npm start

#You can use postman application to actual service
// getting all leads
query Leads {
    leads {
        id
        name
        total
    }
}

// get specific lead
query Lead {
    lead(id: 1) {
        id
        name
        total
    }
}

// (mutation) create customer
mutation Customer {
    customer(
        name: "your_name"
        email: "your_email"
        mobile: "your_mobile"
        post_code: "your_post_code"
        service_interest: ["delivery", "payment", "pick-up"]
    ) {
        id
        name
        email
        mobile
        post_code
        service_interest
    }
}

```

## Running Unit testing

Instructions on how to run the project with TypeScript and GraphQL.

```bash
# Compile TypeScript
npx tsc 
or
npm run build

# Start the project
npm start

#Run Unit test
npm run test
```