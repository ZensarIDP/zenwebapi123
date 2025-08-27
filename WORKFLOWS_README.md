# GitHub Actions Workflows

This repository includes **only the essential workflows** for deploying to Google Cloud Platform.

## Workflows Included

### 1. **Simple CI/CD Pipeline** (`ci.yml`) 
- **Purpose**: Main deployment workflow
- **When it runs**: Automatically on push to `main` branch  
- **What it does**:
  - ✅ Runs tests and linting
  - 🔌 Enables required GCP APIs (conditionally)
  - 📦 Creates Artifact Registry repository (if needed)
  - 🔨 Builds and pushes Docker image
  - 🚀 Deploys to Cloud Run or GKE (based on your selection)

### 2. **Database Setup** (`infrastructure.yml`) 
- **When included**: Always (but content depends on your database selection)
- **If you selected database**: Contains full Cloud SQL setup workflow
- **If you didn't select database**: Contains placeholder with helpful instructions
- **When to run**: Manually when you need database operations

## Quick Start

### ✅ **No Setup Required!**
The main workflow automatically handles everything:
- API enablement
- Repository creation  
- Docker build and push
- Deployment

### 🚀 **Just Push Code**
1. Make your code changes
2. Push to `main` branch
3. Workflow runs automatically
4. Your app is deployed!

## Configuration

All settings are automatically configured from your template choices:
- **Project ID**: `dev-zephyr-352206`
- **Region**: `asia-south1` 
- **Deployment**: `gke` (or Cloud Run if you selected that)

## Required Secrets

Add this secret to your GitHub repository (Settings → Secrets → Actions):
- `GCP_SA_KEY`: Service account JSON key content

## Troubleshooting

### ❌ API Permission Errors
If you get "PERMISSION_DENIED" for enabling APIs:
- The workflow will continue anyway (APIs may already be enabled)
- You can manually enable APIs in Google Cloud Console

### ❌ Artifact Registry Permission Errors  
- Ensure your service account has `roles/artifactregistry.admin`
- The workflow will attempt to create the repository automatically

### ❌ Deployment Failures
- Check that your Dockerfile is correct
- Verify all environment variables are set correctly
- For GKE: Ensure your cluster exists and is accessible

## Manual Fallback

If automatic setup fails, you can manually enable APIs and create the repository:
```bash
# Enable APIs
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudrun.googleapis.com  # or container.googleapis.com for GKE

# Create repository
gcloud artifacts repositories create counter-appvxf \
    --repository-format=docker \
    --location=asia-south1 \
    --project=dev-zephyr-352206
```
