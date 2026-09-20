import pytest
import uuid

@pytest.mark.asyncio
async def test_register_login_and_workspace(client):
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    
    # 1. Register
    reg_resp = await client.post("/api/v1/auth/register", json={
        "email": unique_email,
        "password": "Password123!",
        "name": "Alex Morgan"
    })
    assert reg_resp.status_code == 200, reg_resp.text
    reg_data = reg_resp.json()
    token = reg_data["access_token"]
    assert token is not None
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Login
    login_resp = await client.post("/api/v1/auth/login", json={
        "email": unique_email,
        "password": "Password123!"
    })
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

    # 3. Check Workspaces
    ws_resp = await client.get("/api/v1/workspaces", headers=headers)
    assert ws_resp.status_code == 200
    workspaces = ws_resp.json()
    assert len(workspaces) >= 1
    default_ws_id = workspaces[0]["id"]

    # 4. Create new Workspace
    create_ws = await client.post("/api/v1/workspaces", json={
        "name": "Autonomous Robotics Lab",
        "description": "Robotics research intelligence"
    }, headers=headers)
    assert create_ws.status_code == 200
    new_ws = create_ws.json()
    assert new_ws["name"] == "Autonomous Robotics Lab"
