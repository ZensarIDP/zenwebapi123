# Manual Artifact Registry Setup Commands

## Run these commands in Google Cloud Shell or your local gcloud CLI:

```bash
# 1. Set your project
gcloud config set project zenhotels-428004

# 2. Enable required APIs
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudrun.googleapis.com
gcloud services enable container.googleapis.com

# 3. Create the Artifact Registry repository
gcloud artifacts repositories create zenwebapivregh \
    --repository-format=docker \
    --location=asia-south1 \
    --description="Docker repository for zenwebapivregh"

# 4. Verify the repository was created
gcloud artifacts repositories describe zenwebapivregh \
    --location=asia-south1

# 5. Configure Docker authentication (if testing locally)
gcloud auth configure-docker asia-south1-docker.pkg.dev
```

## Verify Repository Creation
After running the above commands, you should see output similar to:
```
Created repository [zenwebapivregh] in location [asia-south1].
```

## Check Repository in Console
You can also verify in the Google Cloud Console:
1. Go to: https://console.cloud.google.com/artifacts
2. Select project: zenhotels-428004
3. Look for repository: zenwebapivregh in region: asia-south1

## Service Account Permissions
Make sure your GitHub Actions service account has these roles:
- roles/artifactregistry.admin
- roles/cloudbuild.builds.editor  
- roles/run.admin
- roles/container.admin (for GKE)

## Test Access (Optional)
```bash
# Test that you can push to the repository
docker tag hello-world:latest asia-south1-docker.pkg.dev/zenhotels-428004/zenwebapivregh/test:latest
docker push asia-south1-docker.pkg.dev/zenhotels-428004/zenwebapivregh/test:latest
```
