## How to use?

```
// container image build
$ gcloud builds submit ../backend/ \
--tag REGION-docker.pkg.dev/PROJECT_ID/backend/backend-api:lastest

// cloud run deploy
$ gcloud run deploy cloudrun-service \
--image REGION-docker.pkg.dev/PROJECT_ID/backend/backend-api:lastest \
--region REGION
```
