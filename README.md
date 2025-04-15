# GitpodFlix Demo: Streaming Platform Development Environment

This repository showcases how Gitpod can transform your development workflow by providing a fully-configured, development environment. This repository uses the example of a streaming platform (think of a Netflix-like service).

<!-- Include list of services included in this repo -->

### What is Gitpod?

Gitpod is an enterprise-grade development environment platform that transforms how development teams work by:

- **Eliminating environment inconsistencies**: No more "works on my machine" problems that slow down teams
- **Accelerating onboarding**: New team members can be productive in seconds instead of days
- **Enhancing security**: Providing isolated, secure environments that protect your intellectual property
- **Supporting compliance requirements**: Keeping sensitive code within your security boundaries
- **Improving resource utilization**: Dynamically allocating computing resources where and when they're needed
- **Enabling seamless collaboration**: Teams can share consistent environments with a single URL
- **Reducing hardware costs**: Eliminating the need for powerful local machines for every developer

For enterprises, Gitpod delivers these benefits while respecting your infrastructure requirements, allowing you to run development environments in your own cloud infrastructure whilst minimizing operational overhead.

## The GitpodFlix tech stack

This demo showcases a streaming platform with multiple microservices running inside a single development environment, demonstrating how Gitpod can handle complex and powerful development environments.

What's included?

1. A modern streaming platform UI
2. Multiple backend microservices
3. Database integration with seeding
4. Automated testing integrations

> **Note:** To help you visualize the development environment, we've included a development environment visualization dashboard.

### 1. Start the Environment

Start the environment using your preferred method (UI, CLI, pull request, or IDP like Backstage)

Watch as Gitpod automatically:

1. Provisions your development environment
2. Installs all dependencies
3. Sets up your entire development stack

Saving you or your developers hours of setup time.

### 2. Explore the Environment Setup Process

When you start a Gitpod environment, it automatically performs these steps for you:

<!-- TODO: Add environment details page -->

1. **Started Remote Virtual Machine** - Gitpod provisions a powerful development environment with the appropriate resources based on your performance profile. e.g. AWS EU (Frankfurt) • Regular • 4 vCPU / 16 GiB / 100 GiB disk • m6i.xlarge. Also supports local development environments.

2. **Cloned Repository** - Your source code is securely cloned into the environment, happening within your own infrastructure boundaries when configured for remote infrastructure.

3. **Loaded Secrets** - Gitpod securely injects secrets into your environment from project, user, or organization environment variables, or external services like HashiCorp Vault or AWS Secrets Manager.

4. **Loaded Automations from `.gitpod/automations.yaml`** - Gitpod loads any custom automations you've defined, extending DevContainer capabilities with Gitpod-specific features like services, tasks, and triggers.

5. **Started Dev Container from `devcontainer.json`** - Gitpod installs all packages and dependencies as defined in your DevContainer configuration, ensuring consistent development environments across your team.

<!-- TODO: Add image of where source code is secured -->

### 3. Editing code in an environment

<!-- TODO -->

### 4. Adjusting and updating automations

<!-- TODO   -->

### 5. Interacting with an environment

Gitpod's automation capabilities are designed to be flexible and pluggable, allowing you to integrate them with your existing systems and workflows. This means you can automate tasks both within and around your Gitpod environments, creating powerful development workflows.

For example, you could:

- Trigger a Gitpod environment from your CI pipeline
- Run automated tests inside the environment
- Hand over the environment to a developer for debugging
- Integrate with your existing automation tools

The Gitpod CLI provides powerful ways to interact with your environments, whether you're inside or outside of them. Here's how you can leverage these capabilities:

From outside the environment:

```bash
# List available environments
gitpod environments list

# SSH into the environment
gitpod ssh <workspace-id>

# Run tests using automation
gitpod automations task start runTests
```

From inside the environment:

```bash
# Run tests using automation
gitpod automations task start runTests
```

These automations can be used to run unit tests, integration tests, or any other development tasks you need to automate. The ability to run these tasks both inside and outside the environment gives you flexibility in how you integrate Gitpod with your existing development workflows.

<!-- ---

2. **View the Development Dashboard**
   - Navigate to the development environment visualization
   - Observe the real-time service graph showing all microservices
   - Notice how services communicate and interact

### 2. Modify and Observe Changes

1. **Adjust Automation Configuration**

   - Open `.gitpod.yml`
   - Modify service configurations
   - Watch how changes affect the running environment

2. **Interact with the Streaming Platform**
   - Browse the Gitpodflix interface
   - Search for content
   - Create a user profile
   - Add items to your watchlist

### 3. Development Workflow Demonstration

1. **Make Code Changes**

   - Modify a service's functionality
   - See changes reflected in real-time
   - Test the modified service

2. **Run Tests**

   - Execute unit tests
   - Run integration tests
   - View test coverage reports

### 4. Advanced Features

1. **Database Operations**

   - View database schemas
   - Run migrations
   - Seed sample data

2. **Service Monitoring**
   - Monitor service health
   - View communication patterns
   - Analyze performance metrics

## 🛠️ Technical Stack

- **Frontend**: React, D3.js
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Testing**: Jest
- **Visualization**: D3.js

## 📚 Additional Resources

- [Gitpod Documentation](https://www.gitpod.io/docs)
- [Gitpod Flex Features](https://www.gitpod.io/flex)
- [Getting Started Guide](https://www.gitpod.io/docs/getting-started)

## 🤝 Contributing

This demo is designed to showcase Gitpod Flex capabilities. Feel free to fork and modify it for your own demonstrations!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->
