import pytest
import uuid
from backend.app.agents.change_agent import change_agent

@pytest.mark.asyncio
async def test_notifications_and_changes_flow(client):
    email = f"notif_tester_{uuid.uuid4().hex[:8]}@example.com"
    reg_resp = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Notification Tester"
    })
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get user default workspace
    ws_resp = await client.get("/api/v1/workspaces", headers=headers)
    ws_id = ws_resp.json()[0]["id"]

    # 1. Load Demo Dataset (which triggers intelligence discoveries and notifications)
    demo_resp = await client.post(f"/api/v1/workspaces/{ws_id}/load-demo", headers=headers)
    assert demo_resp.status_code == 200

    # 2. Verify GET /api/v1/notifications
    notif_resp = await client.get("/api/v1/notifications", headers=headers)
    assert notif_resp.status_code == 200
    notifs = notif_resp.json()
    assert len(notifs) >= 1

    first_notif = notifs[0]
    assert "title" in first_notif
    assert first_notif["read"] is False
    assert first_notif["type"] in ["alert", "warning", "info"]

    # 3. Verify PATCH /api/v1/notifications/{id}/read
    patch_resp = await client.patch(f"/api/v1/notifications/{first_notif['id']}/read", headers=headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["read"] is True

    # 4. Verify POST /api/v1/notifications/mark-all-read
    mark_all_resp = await client.post("/api/v1/notifications/mark-all-read", headers=headers)
    assert mark_all_resp.status_code == 200

    # 5. Verify unread query returns empty
    unread_resp = await client.get("/api/v1/notifications?unread_only=true", headers=headers)
    assert unread_resp.status_code == 200
    assert len(unread_resp.json()) == 0

    # 6. Verify Change Detection Agent Logic
    existing_discs = [{"title": "Old Discovery", "type": "inferred", "severity": "low"}]
    new_discs = [{
        "title": "Severe Flood Warning",
        "description": "Flooding on campus access routes",
        "severity": "high",
        "type": "contradiction",
        "impact_score": 90.0,
        "affected_entities": ["Main Gate"]
    }]
    changes = change_agent.detect_changes([], [], new_discs, existing_discs)
    assert len(changes) >= 1
    assert changes[0]["change_type"] == "emerged_conflict"
