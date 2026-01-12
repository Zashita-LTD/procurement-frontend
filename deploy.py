#!/usr/bin/env python3
"""Deploy procurement-frontend to GCP VM via SSH through IAP"""

import subprocess
import os
import sys

# Configuration
PROJECT_ID = "viktor-integration"
ZONE = "europe-west1-b"
INSTANCE = "instance-20260108-145330"
REMOTE_USER = "vik9541"
REMOTE_PATH = "/var/www/97v.ru"
LOCAL_DIST = "./dist"

def run(cmd, check=True):
    print(f"$ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    if check and result.returncode != 0:
        raise Exception(f"Command failed: {cmd}")
    return result

def main():
    print("🚀 Deploying procurement-frontend to 97v.ru")
    print("=" * 50)
    
    # Create tarball of dist
    print("\n📦 Creating deployment package...")
    run("tar -czf dist.tar.gz -C dist .")
    
    # Upload via SCP through IAP
    print("\n📤 Uploading to server...")
    scp_cmd = f"""gcloud compute scp dist.tar.gz {REMOTE_USER}@{INSTANCE}:/tmp/dist.tar.gz \
        --zone={ZONE} --project={PROJECT_ID} --tunnel-through-iap"""
    
    # Deploy commands
    deploy_script = f'''
sudo mkdir -p {REMOTE_PATH}
sudo tar -xzf /tmp/dist.tar.gz -C {REMOTE_PATH}
sudo chown -R www-data:www-data {REMOTE_PATH}
rm /tmp/dist.tar.gz
echo "✅ Files deployed to {REMOTE_PATH}"
'''
    
    print("\n🔧 Running deployment on server...")
    ssh_cmd = f"""gcloud compute ssh {REMOTE_USER}@{INSTANCE} \
        --zone={ZONE} --project={PROJECT_ID} --tunnel-through-iap \
        --command='{deploy_script}'"""
    
    print(f"\nRun these commands manually:")
    print("-" * 50)
    print(scp_cmd)
    print("-" * 50)
    print(ssh_cmd)
    
if __name__ == "__main__":
    main()
