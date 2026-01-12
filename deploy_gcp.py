#!/usr/bin/env python3
"""
Professional deployment script for 97v.ru
Uses Google Cloud API to deploy frontend
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path

# Configuration
CONFIG = {
    "project_id": "viktor-integration",
    "zone": "europe-west1-b", 
    "instance": "instance-20260108-145330",
    "remote_ip": "34.140.4.125",
    "domain": "97v.ru",
    "web_root": "/var/www/97v.ru",
    "dist_dir": "./dist",
}

def get_access_token():
    """Get access token from gcloud credentials"""
    creds_path = Path.home() / ".config/gcloud/application_default_credentials.json"
    
    if not creds_path.exists():
        print("❌ No credentials found")
        return None
    
    with open(creds_path) as f:
        creds = json.load(f)
    
    # Refresh token to get access token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"],
        "grant_type": "refresh_token",
    }
    
    response = requests.post(token_url, data=data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"❌ Failed to get token: {response.text}")
        return None

def add_ssh_key_to_project(access_token, ssh_key):
    """Add SSH key to project metadata via API"""
    
    project_id = CONFIG["project_id"]
    
    # Get current metadata
    url = f"https://compute.googleapis.com/compute/v1/projects/{project_id}"
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"❌ Failed to get project metadata: {response.text}")
        return False
    
    project = response.json()
    
    # Find existing SSH keys
    common_metadata = project.get("commonInstanceMetadata", {})
    items = common_metadata.get("items", [])
    
    ssh_keys_item = None
    for item in items:
        if item["key"] == "ssh-keys":
            ssh_keys_item = item
            break
    
    # Add new key
    if ssh_keys_item:
        existing_keys = ssh_keys_item["value"]
        if ssh_key not in existing_keys:
            ssh_keys_item["value"] = existing_keys + "\n" + ssh_key
            print("✅ Adding SSH key to existing keys")
        else:
            print("ℹ️ SSH key already exists")
            return True
    else:
        items.append({"key": "ssh-keys", "value": ssh_key})
        print("✅ Creating new ssh-keys metadata")
    
    # Update metadata
    fingerprint = common_metadata.get("fingerprint", "")
    update_url = f"https://compute.googleapis.com/compute/v1/projects/{project_id}/setCommonInstanceMetadata"
    
    body = {
        "fingerprint": fingerprint,
        "items": items
    }
    
    response = requests.post(update_url, headers=headers, json=body)
    if response.status_code == 200:
        print("✅ SSH key added to project")
        return True
    else:
        print(f"❌ Failed to update metadata: {response.text}")
        return False

def deploy():
    """Main deployment function"""
    print("🚀 Professional Deployment to 97v.ru")
    print("=" * 50)
    print(f"📍 Target: {CONFIG['remote_ip']} ({CONFIG['instance']})")
    print(f"🌐 Domain: {CONFIG['domain']}")
    print()
    
    # Step 1: Get access token
    print("1️⃣ Authenticating with Google Cloud...")
    access_token = get_access_token()
    if not access_token:
        print("   ❌ Authentication failed")
        return False
    print("   ✅ Authenticated")
    
    # Step 2: Add SSH key
    print("\n2️⃣ Adding SSH key to project...")
    ssh_key_path = Path.home() / ".ssh/id_ed25519.pub"
    with open(ssh_key_path) as f:
        pub_key = f.read().strip()
    
    ssh_key = f"procurement-frontend:{pub_key}"
    add_ssh_key_to_project(access_token, ssh_key)
    
    # Step 3: Wait for propagation
    print("\n3️⃣ Waiting for SSH key propagation (30 sec)...")
    import time
    for i in range(30, 0, -5):
        print(f"   {i} seconds remaining...")
        time.sleep(5)
    
    # Step 4: Connect and deploy
    print("\n4️⃣ Connecting to server...")
    result = subprocess.run(
        ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10",
         f"procurement-frontend@{CONFIG['remote_ip']}", "echo 'Connected!'"],
        capture_output=True, text=True
    )
    
    if result.returncode == 0:
        print("   ✅ SSH connection successful!")
        
        # Step 5: Deploy files
        print("\n5️⃣ Deploying files...")
        
        # Create tarball
        subprocess.run(["tar", "-czf", "dist.tar.gz", "-C", "dist", "."])
        
        # Copy files
        subprocess.run([
            "scp", "-o", "StrictHostKeyChecking=no",
            "dist.tar.gz", "nginx/97v.ru.conf", "nginx/setup-server.sh",
            f"procurement-frontend@{CONFIG['remote_ip']}:/tmp/"
        ])
        
        # Run setup on server
        subprocess.run([
            "ssh", "-o", "StrictHostKeyChecking=no",
            f"procurement-frontend@{CONFIG['remote_ip']}",
            f"""
            sudo mkdir -p {CONFIG['web_root']}
            sudo tar -xzf /tmp/dist.tar.gz -C {CONFIG['web_root']}
            sudo cp /tmp/97v.ru.conf /etc/nginx/sites-available/
            sudo ln -sf /etc/nginx/sites-available/97v.ru.conf /etc/nginx/sites-enabled/
            sudo nginx -t && sudo systemctl reload nginx
            echo '✅ Deployment complete!'
            """
        ])
        
        print("\n✅ Deployment successful!")
        print(f"🌐 Visit: https://{CONFIG['domain']}")
        return True
    else:
        print(f"   ❌ SSH failed: {result.stderr}")
        print("\n📝 Manual steps required:")
        print(f"   1. Add SSH key in GCP Console → Compute Engine → Metadata → SSH Keys")
        print(f"   2. Key: {ssh_key}")
        return False

if __name__ == "__main__":
    deploy()
