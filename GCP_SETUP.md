# GCP Setup and Permissions Guide

## Required GCP APIs
Before deploying, enable these APIs in your Google Cloud Project:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudrun.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

## Service Account Setup

1. Create a service account for GitHub Actions:
```bash
gcloud iam service-accounts create github-actions \
    --description="Service account for GitHub Actions CI/CD" \
    --display-name="GitHub Actions"
```

2. Grant required permissions (ESSENTIAL for automated workflow):
```bash
# Service Usage permissions (required for enabling APIs)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/serviceusage.serviceUsageAdmin"

# Artifact Registry permissions (required for creating and managing repositories)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

# Basic project permissions (required for resource management)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/editor"

# Cloud Run permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

# GKE permissions (if using GKE)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/container.admin"

# Cloud SQL permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.admin"
```

3. Create and download the service account key:
```bash
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com
```

## Artifact Registry Setup

1. Create an Artifact Registry repository:
```bash
gcloud artifacts repositories create  \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for "
```

2. Configure Docker authentication:
```bash
gcloud auth configure-docker $REGION-docker.pkg.dev
```

## GitHub Secrets Setup

Add these secrets to your GitHub repository:

- `GCP_SA_KEY`: Content of the service account key JSON file
- `PROJECT_ID`: Your Google Cloud Project ID
- `REGION`: Your preferred GCP region (e.g., us-central1)

## Required Environment Variables

The workflow expects these environment variables to be set in your repository:

### For all deployments:
- `PROJECT_ID`: Google Cloud Project ID
- `REGION`: GCP region
- `IMAGE_NAME`: Docker image name (usually same as service name)
- `SERVICE_NAME`: Name of the service
- `DEPLOYMENT_TYPE`: Either 'cloudrun' or 'gke'

### For database setup:
- `DB_TYPE`: Either 'mysql' or 'postgresql'
- `DB_NAME`: Database name

### For GKE deployments only:
- `GKE_CLUSTER`: Name of the GKE cluster
- `GKE_ZONE`: Zone where the GKE cluster is located
- `GKE_NAMESPACE`: Kubernetes namespace

## Troubleshooting

### Permission Denied Errors
If you get permission denied errors:
1. Verify all APIs are enabled
2. Check service account has the correct IAM roles
3. Ensure the service account key is properly added to GitHub Secrets

### Artifact Registry Issues
- Make sure you're using the new Artifact Registry (not deprecated Container Registry)
- Verify the repository exists in the specified region
- Check the image URL format: `REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME/IMAGE_NAME:TAG`

### Cloud SQL Issues
- Ensure Cloud SQL Admin API is enabled
- Check that the region supports Cloud SQL
- Verify instance names are unique within the project
