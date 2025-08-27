# CI/CD Organization

This template uses a well-organized structure for CI/CD workflows with platform-specific conditional deployment.

## File Structure

```
├── ci-cd/
│   ├── github/             # GitHub Actions workflows
│   │   ├── workflows/      # GitHub workflow files
│   │   │   ├── ci.yml     # Main CI/CD pipeline
│   │   │   ├── ci.yml.hbs # Template version
│   │   │   └── setup-branches.yml # Branch setup
│   │   └── README.md      # GitHub-specific documentation
│   └── bitbucket/          # Bitbucket Pipelines
│       ├── bitbucket-pipelines.yml # Bitbucket CI/CD configuration
│       └── README.md      # Bitbucket-specific documentation
└── CI-CD-GUIDE.md         # This file
```

## Platform-Specific Deployment

The template intelligently deploys only the relevant CI/CD configuration based on your chosen repository host:

### GitHub Repository
- **Active**: GitHub Actions workflows copied to `.github/workflows/`
- **Inactive**: Bitbucket Pipelines configuration not deployed
- **Location**: `.github/workflows/ci.yml`, `.github/workflows/setup-branches.yml`

### Bitbucket Repository  
- **Active**: Bitbucket Pipelines configuration copied to root
- **Inactive**: GitHub Actions workflows not deployed
- **Location**: `bitbucket-pipelines.yml`

## Why This Organization?

1. **Clean Separation**: Each platform has its own dedicated folder
2. **No Clutter**: Only relevant CI/CD files are deployed to your repository
3. **Easy Maintenance**: Platform-specific configurations are isolated
4. **Clear Documentation**: Each platform has its own README with specific instructions
5. **Template Reusability**: Source CI/CD files remain organized for future updates

## Development Process

### Template Development
- Modify GitHub workflows in `ci-cd/github/workflows/`
- Modify Bitbucket pipelines in `ci-cd/bitbucket/bitbucket-pipelines.yml`
- Update platform-specific READMEs as needed

### Generated Repository
- Only the relevant platform's CI/CD files will be present
- Clean, focused repository without unused configurations
- Platform-appropriate documentation included

## Environment Setup

Each platform has specific setup requirements documented in their respective README files:

- **GitHub**: See `ci-cd/github/README.md` for GitHub Secrets configuration
- **Bitbucket**: See `ci-cd/bitbucket/README.md` for Repository Variables setup

## Migration Between Platforms

If you need to switch platforms later:

1. Copy the appropriate CI/CD configuration from this template
2. Set up the required secrets/variables for the new platform  
3. Remove the old platform's CI/CD files if desired

This organization makes platform migration straightforward and clean.
