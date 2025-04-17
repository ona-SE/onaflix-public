# Gitpod Automations Best Practices

This guide covers best practices for configuring and using Gitpod Automations, which are defined in your `.gitpod/automations.yaml` file. Automations help you set up and maintain your development environment automatically.

## What are Gitpod Automations?

Gitpod Automations are defined in your `.gitpod/automations.yaml` file and come in two types:

1. **Services**: Long-running processes (like databases, message queues, etc.)
2. **Tasks**: One-time setup or initialization commands

## Automation Schema

```yaml
services:
  database:
    name: PostgreSQL
    description: The backend database
    triggeredBy:
      - postEnvironmentStart
    commands:
      start: "docker run --rm -t --name database postgres:latest"
      ready: docker exec database pg_isready

tasks:
  buildAll:
    name: Build All
    description: builds all code
    command: go build .
  runUnitTests:
    name: Runs unit tests
    command: go test -v ./...
  validate:
    name: Validate
    description: Builds and tests the code
    triggeredBy:
      - postEnvironmentStart
    dependsOn:
      - buildAll
      - runUnitTests
```

## Iterating on Automations

The Gitpod CLI provides several commands to help you iterate on and debug your automations:

### 1. Updating Automations

To reload the automations configuration:

```bash
gitpod automations update [optional-path-to-automations.yaml]
```

### 2. Starting Services and Tasks

To start a specific service:

```bash
gitpod automations service start <service-name>
```

To start a specific task:

```bash
gitpod automations task start <task-name>
```

### 3. Simulating Triggers

To simulate environment triggers:

```bash
gitpod automations trigger postEnvironmentStart
```

### 4. Viewing Logs

To view service logs:

```bash
gitpod automations service logs <service-name> | cat
```

Note: Always pipe to `cat` to prevent paging and ensure complete log output.

To view task logs:

```bash
gitpod automations task logs <task-name> | cat
```

### 5. Managing Services

To list all services and their status:

```bash
gitpod automations service list
```

This will show each service's:

- Reference name
- Display name
- Description
- Current phase (e.g., RUNNING, STOPPED, FAILED)

To stop a service:

```bash
gitpod automations service stop <service-name>
```

Note: Services must be stopped one at a time.

### 6. Updating Automations

When updating your automations configuration:

1. **Stop Running Services First**

   ```bash
   # Stop each service individually
   gitpod automations service stop <service-name>
   ```

2. **Update Automations**

   ```bash
   gitpod automations update
   ```

3. **Start Services Again**
   ```bash
   gitpod automations service start <service-name>
   ```

Important: You cannot update automations while services are running. The update will fail with a "failed_precondition" error.

### 7. Debugging Tips

- Use `gitpod automations service logs <service-name> | cat` to check service startup issues
- Use `gitpod automations task logs <task-name> | cat` to debug task failures
- Add `echo` statements in your commands for better debugging
- Use `triggeredBy` to control task execution order
- Check service status with `gitpod automations service list`
- When services fail to start, check their logs for dependency or configuration issues

## General Best Practices

### 1. Service Configuration

- **Always Include a `ready` Command**

  - This helps Gitpod know when your service is ready to use
  - Example for PostgreSQL:
    ```yaml
    commands:
      start: "docker run --rm -t --name database postgres:latest"
      ready: docker exec database pg_isready
    ```

- **Use Descriptive Names and Descriptions**
  - Make services and tasks self-documenting
  - Example:
    ```yaml
    name: PostgreSQL
    description: The backend database for the application
    ```

### 2. Task Configuration

- **Keep Tasks Focused**

  - Each task should have a single responsibility
  - Use descriptive names and descriptions
  - Example:
    ```yaml
    tasks:
      build:
        name: Build Code
        description: Builds the application code
        command: yarn && yarn build
    ```

- **Use Dependencies Properly**
  - Define task dependencies using `dependsOn`
  - Example:
    ```yaml
    validate:
      name: Validate
      dependsOn:
        - build
        - test
      command: echo "Validation complete"
    ```

## Specific Automation Best Practices

### 1. Database Setup

```yaml
services:
  postgresql:
    name: PostgreSQL
    description: A fully initialized development database
    triggeredBy:
      - postDevcontainerStart
    commands:
      start: docker run -d --name postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres:latest
      ready: docker exec postgres pg_isready -U postgres

tasks:
  seedDatabase:
    name: (Re)seed the development database
    triggeredBy:
      - manual
    command: dev/seed-development-db.sh
```

### 2. Development Environment Setup

```yaml
tasks:
  build:
    name: Build Code
    command: yarn && yarn build
  test:
    name: Run unit tests
    dependsOn:
      - build
    command: yarn test
  setup:
    name: Set up the environment
    dependsOn:
      - build
      - test
    command: echo "all set up and ready to go"
```

### 3. Cloud Authentication

```yaml
tasks:
  awsAuth:
    name: AWS Auth
    command: gitpod idp login aws
```

## Common Issues and Solutions

### 1. Service Not Starting

- **Problem**: Service fails to start or becomes unresponsive
- **Solution**:
  - Add proper `ready` command
  - Check service logs
  - Ensure correct environment variables

### 2. Task Dependencies

- **Problem**: Tasks running in wrong order
- **Solution**:
  - Use `dependsOn` to define dependencies
  - Use `triggeredBy` to control when tasks run
  - Structure tasks logically

### 3. Service Dependencies

- **Problem**: Tasks trying to use services before they're ready
- **Solution**:
  - Use `ready` commands to ensure services are available
  - Add appropriate delays or checks in tasks
  - Use `triggeredBy` to control task timing

## Best Practices Summary

1. **Service Configuration**

   - Always include `ready` command
   - Use descriptive names and descriptions
   - Implement proper error handling

2. **Task Organization**

   - Keep tasks focused and single-purpose
   - Use descriptive names and descriptions
   - Define proper dependencies

3. **Error Handling**

   - Add proper checks in commands
   - Use logging for debugging
   - Handle dependencies correctly

4. **Performance**
   - Minimize startup time
   - Use caching when possible
   - Optimize service configuration
