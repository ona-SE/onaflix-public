# Automations Best Practices

Gitpod Automations provide a powerful way to define, automate, and share common workflows within your development environment. This guide covers best practices, schema details, and practical examples to help you create effective automations.

## What are Automations?

Automations in Gitpod are defined configurations that allow you to automate recurring tasks and services in your development environment. They go beyond Dev Container configurations to provide a framework for:

- **Setup automation** - Seed databases, provision infrastructure, authenticate with cloud services
- **Operation workflows** - Transform runbooks into one-click self-service actions
- **Editor interfaces** - Start specialized servers like Jupyter notebooks
- **Policy enforcement** - Run security scanning or linting tools
- **AI workflows** - Configure AI assistants or code analysis tools

## Types of Automations

Gitpod supports two primary types of automations:

### 1. Services

Services are designed for long-running processes that need to be continuously available throughout your development session.

**Examples include:**

- Database servers (PostgreSQL, MySQL)
- Message queues (RabbitMQ, Kafka)
- Web servers (frontend/backend applications)
- Development servers (webpack, Next.js)

### 2. Tasks

Tasks are individual commands designed to perform specific, often one-off actions within your environment.

**Examples include:**

- Compiling code
- Running test suites
- Seeding databases
- Authenticating with cloud providers
- Setting up environment variables

## Automation Schema

Automations are defined in YAML format, typically stored in `.gitpod/automations.yaml`. Here's the basic schema:

```yaml
services:
  serviceReference:
    name: "Human-readable name"
    description: "Optional description"
    triggeredBy:
      - [trigger type]
    commands:
      start: "command to start the service"
      ready: "command to check if service is ready"
      stop: "command to stop the service"

tasks:
  taskReference:
    name: "Human-readable name"
    description: "Optional description"
    triggeredBy:
      - [trigger type]
    dependsOn:
      - [other task reference]
    command: "command to execute"
```

### Key Properties

#### For Services:

- **start (required)**: The command that runs the service. This process should continue running.
- **ready (optional)**: A health check command to determine when the service is fully operational.
- **stop (optional)**: A command to gracefully shutdown the service.

#### For Tasks:

- **command (required)**: The action to be executed.
- **dependsOn (optional)**: References to other tasks that should run before this one.

#### Triggers:

- **postEnvironmentStart**: Runs every time the environment starts or restarts.
- **postDevcontainerStart**: Runs when the devcontainer starts (initial start or after rebuild).
- **manual**: Creates a UI element allowing users to run the automation on demand.

## Best Practices

### General Best Practices

1. **Use Descriptive Names**

   - Choose clear, descriptive names for your tasks and services
   - Include purpose in the description field

2. **Keep Commands Focused**

   - Each task should have a single responsibility
   - Break complex workflows into multiple dependent tasks

3. **Handle Errors Gracefully**

   - Include error handling in your scripts
   - Use conditional execution (`command || fallback`)

4. **Include Ready Checks for Services**

   - Always define a `ready` command for services
   - This ensures dependent tasks only run when services are truly ready

5. **Add Documentation**
   - Use the `description` field to explain what each automation does
   - Include any prerequisites or expected outcomes

### Service-Specific Best Practices

1. **Use Docker for Isolated Services**

   - Containerize databases and other infrastructure services
   - Include volume mounts for persistence when needed

2. **Implement Proper Shutdown Procedures**

   - Define `stop` commands that gracefully terminate services
   - This prevents data corruption and resource leaks

3. **Use Network Configurations Properly**
   - Bind to `0.0.0.0` instead of `localhost` to make services accessible
   - Expose ports using `--network=host` for single containers or `network_mode: host` in Docker Compose

### Task-Specific Best Practices

1. **Leverage Dependencies**

   - Use `dependsOn` to create task chains
   - Re-use common tasks rather than duplicating code

2. **Choose Appropriate Triggers**

   - Use `postDevcontainerStart` for setup tasks
   - Use `manual` for occasional or optional tasks
   - Use `postEnvironmentStart` for tasks that must run on every restart

3. **Use Multi-line Commands**
   - For complex scripts, use the YAML multi-line syntax
   - This improves readability for longer commands

## Examples

### Database Setup Example

```yaml
services:
  database:
    name: "PostgreSQL Database"
    description: "Primary application database"
    triggeredBy:
      - postDevcontainerStart
    commands:
      start: "docker run --rm -d --name pg-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14"
      ready: "pg_isready -h localhost -p 5432"

tasks:
  databaseSetup:
    name: "Initialize Database"
    description: "Creates schema and loads sample data"
    triggeredBy:
      - postDevcontainerStart
    command: |
      echo "Waiting for database to be ready..."
      until pg_isready -h localhost -p 5432; do
        sleep 1
      done
      echo "Creating schema..."
      psql -h localhost -U postgres -f ./scripts/schema.sql
      echo "Loading sample data..."
      psql -h localhost -U postgres -f ./scripts/sample-data.sql
```

### Development Server Example

```yaml
services:
  backend:
    name: "API Server"
    description: "Backend API running on Node.js"
    triggeredBy:
      - postEnvironmentStart
    commands:
      start: "cd backend && npm start"
      ready: "curl -s http://localhost:3000/health | grep -q 'ok'"

  frontend:
    name: "Web UI"
    description: "React frontend application"
    triggeredBy:
      - postEnvironmentStart
    commands:
      start: "cd frontend && npm start"
      ready: 'curl -s http://localhost:8080 | grep -q ''<div id="root"'''
```

### Cloud Authentication Example

```yaml
tasks:
  awsAuth:
    name: "AWS Authentication"
    description: "Authenticate with AWS"
    triggeredBy:
      - manual
      - postDevcontainerStart
    command: |
      echo "Authenticating with AWS..."
      gitpod idp login aws

  deployStaging:
    name: "Deploy to Staging"
    description: "Deploy the application to staging environment"
    triggeredBy:
      - manual
    dependsOn:
      - awsAuth
    command: |
      echo "Running deployment to staging..."
      cd terraform && terraform apply -auto-approve -var-file=staging.tfvars
```

### Testing Workflow Example

```yaml
tasks:
  lint:
    name: "Run Linters"
    description: "Check code quality with linters"
    triggeredBy:
      - manual
    command: "npm run lint"

  unitTests:
    name: "Unit Tests"
    description: "Run all unit tests"
    triggeredBy:
      - manual
    command: "npm run test:unit"

  integrationTests:
    name: "Integration Tests"
    description: "Run integration test suite"
    triggeredBy:
      - manual
    command: "npm run test:integration"

  fullTestSuite:
    name: "Complete Test Suite"
    description: "Run all tests and quality checks"
    triggeredBy:
      - manual
    dependsOn:
      - lint
      - unitTests
      - integrationTests
    command: "echo 'All tests completed successfully!'"
```

### Machine Learning Environment Example

```yaml
services:
  jupyter:
    name: "Jupyter Notebook"
    description: "Jupyter notebook server for data analysis"
    triggeredBy:
      - postDevcontainerStart
    commands:
      start: "jupyter notebook --no-browser --ip=0.0.0.0 --port=8888 --NotebookApp.token='gitpod'"
      ready: "curl -s http://localhost:8888/api/status | grep -q 'running'"

tasks:
  downloadDatasets:
    name: "Download Datasets"
    description: "Fetch training datasets from S3"
    triggeredBy:
      - postDevcontainerStart
    command: |
      echo "Downloading datasets..."
      mkdir -p ./data
      aws s3 cp s3://my-datasets/training-data.csv ./data/
      aws s3 cp s3://my-datasets/test-data.csv ./data/
      echo "Datasets downloaded successfully"
```

## Advanced Usage

### Dynamic Automation Generation

You can generate automations programmatically using the Gitpod CLI:

```bash
# Generate and apply automations from a script or template
./generate-automations.sh | gitpod automations update -
```

### Conditional Execution

You can implement conditional logic in your task commands:

```yaml
tasks:
  conditionalBuild:
    name: "Conditional Build"
    triggeredBy:
      - postEnvironmentStart
    command: |
      if [ -f "package-lock.json" ]; then
        echo "Using npm..."
        npm ci && npm run build
      elif [ -f "yarn.lock" ]; then
        echo "Using yarn..."
        yarn install --frozen-lockfile && yarn build
      else
        echo "No lock file found, using npm..."
        npm install && npm run build
      fi
```

### Complex Dependencies

For complex workflows, you can chain multiple dependent tasks:

```yaml
tasks:
  step1:
    name: "Step 1"
    command: "echo 'Running step 1'"

  step2:
    name: "Step 2"
    dependsOn: ["step1"]
    command: "echo 'Running step 2'"

  step3:
    name: "Step 3"
    dependsOn: ["step2"]
    command: "echo 'Running step 3'"

  parallelA:
    name: "Parallel A"
    dependsOn: ["step3"]
    command: "echo 'Running parallel task A'"

  parallelB:
    name: "Parallel B"
    dependsOn: ["step3"]
    command: "echo 'Running parallel task B'"

  final:
    name: "Final Step"
    dependsOn: ["parallelA", "parallelB"]
    command: "echo 'All steps completed!'"
```

By following these best practices and examples, you can create powerful and maintainable automations that enhance your development workflow in Gitpod.
