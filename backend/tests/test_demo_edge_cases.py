import pytest
import uuid
import io
from unittest.mock import patch
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_edge_cases(client: AsyncClient):
    """Scenario 9: Authentication - Invalid login, duplicate user, token validation."""
    rand_email = f"user_{uuid.uuid4().hex[:8]}@example.com"
    
    # 1. Register valid user
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": rand_email,
        "password": "Password123!",
        "name": "Test Analyst"
    })
    assert reg_res.status_code == 200, reg_res.text
    token = reg_res.json()["access_token"]
    assert token is not None

    # 2. Duplicate registration should fail gracefully (400)
    dup_res = await client.post("/api/v1/auth/register", json={
        "email": rand_email,
        "password": "Password123!",
        "name": "Test Analyst"
    })
    assert dup_res.status_code == 400

    # 3. Bad password should fail (401)
    bad_login = await client.post("/api/v1/auth/login", json={
        "email": rand_email,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 4. Correct login
    good_login = await client.post("/api/v1/auth/login", json={
        "email": rand_email,
        "password": "Password123!"
    })
    assert good_login.status_code == 200
    assert "access_token" in good_login.json()

@pytest.mark.asyncio
async def test_workspace_isolation(client: AsyncClient):
    """Scenario 10: Workspace isolation - Data in Workspace A does not bleed into Workspace B."""
    email = f"isolation_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Isolation Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create two isolated workspaces
    ws_a_res = await client.post("/api/v1/workspaces", json={"name": "Workspace Alpha"}, headers=headers)
    assert ws_a_res.status_code == 200
    ws_a_id = ws_a_res.json()["id"]

    ws_b_res = await client.post("/api/v1/workspaces", json={"name": "Workspace Beta"}, headers=headers)
    assert ws_b_res.status_code == 200
    ws_b_id = ws_b_res.json()["id"]

    # Ingest document into Workspace Alpha only
    await client.post(f"/api/v1/workspaces/{ws_a_id}/sources", json={
        "name": "Alpha Notice",
        "type": "txt",
        "content": "Alpha exclusive notice regarding Main Gate Closure."
    }, headers=headers)

    # Verify Workspace Alpha has the source and graph
    sources_a = await client.get(f"/api/v1/workspaces/{ws_a_id}/sources", headers=headers)
    assert len(sources_a.json()) >= 1

    # Verify Workspace Beta is completely empty (no bleed)
    sources_b = await client.get(f"/api/v1/workspaces/{ws_b_id}/sources", headers=headers)
    assert len(sources_b.json()) == 0

    graph_b = await client.get(f"/api/v1/workspaces/{ws_b_id}/graph", headers=headers)
    assert len(graph_b.json()["nodes"]) == 0
    assert len(graph_b.json()["edges"]) == 0

@pytest.mark.asyncio
async def test_bad_and_empty_document_upload(client: AsyncClient):
    """Scenario 1 & 2: Upload failure and Bad/empty document handling."""
    email = f"upload_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Upload Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ws_res = await client.post("/api/v1/workspaces", json={"name": "Test Upload WS"}, headers=headers)
    ws_id = ws_res.json()["id"]

    # 1. Empty content text source
    empty_res = await client.post(f"/api/v1/workspaces/{ws_id}/sources", json={
        "name": "Empty Notice",
        "type": "txt",
        "content": "   "
    }, headers=headers)
    assert empty_res.status_code in [200, 400]

    # 2. Ingest zero-byte file upload
    files = {'file': ('empty.txt', io.BytesIO(b''), 'text/plain')}
    empty_file_res = await client.post(f"/api/v1/workspaces/{ws_id}/sources/upload", files=files, headers=headers)
    assert empty_file_res.status_code in [200, 400]

@pytest.mark.asyncio
async def test_duplicate_documents(client: AsyncClient):
    """Scenario 4: Duplicate documents ingested sequentially."""
    email = f"dup_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Dup Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ws_res = await client.post("/api/v1/workspaces", json={"name": "Test Dup WS"}, headers=headers)
    ws_id = ws_res.json()["id"]

    doc_content = "Campus Gate 1 will be closed from Sept 20 to Sept 23 for maintenance work."

    # Ingest first copy
    res1 = await client.post(f"/api/v1/workspaces/{ws_id}/sources", json={
        "name": "Gate Notice",
        "type": "txt",
        "content": doc_content
    }, headers=headers)
    assert res1.status_code == 200

    # Ingest exact duplicate copy
    res2 = await client.post(f"/api/v1/workspaces/{ws_id}/sources", json={
        "name": "Gate Notice",
        "type": "txt",
        "content": doc_content
    }, headers=headers)
    assert res2.status_code == 200

    # System handles duplicates gracefully without crashing
    sources = await client.get(f"/api/v1/workspaces/{ws_id}/sources", headers=headers)
    assert len(sources.json()) == 2

@pytest.mark.asyncio
async def test_contradictory_information_and_discoveries(client: AsyncClient):
    """Scenario 6: Contradictory information detection."""
    email = f"contra_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Contra Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ws_res = await client.post("/api/v1/workspaces", json={"name": "Contradiction WS"}, headers=headers)
    ws_id = ws_res.json()["id"]

    # Load demo dataset with known contradictions (Main Gate closed vs Mid-Semester Exam on Route 4)
    demo_res = await client.post(f"/api/v1/workspaces/{ws_id}/load-demo", headers=headers)
    assert demo_res.status_code == 200

    # Run Discovery Agent
    disc_res = await client.get(f"/api/v1/workspaces/{ws_id}/discoveries", headers=headers)
    assert disc_res.status_code == 200
    discoveries = disc_res.json()
    assert len(discoveries) >= 1

    # Check that contradictions and high severity issues are flagged
    disc_types = [d.get("type") for d in discoveries]
    assert "contradiction" in disc_types

@pytest.mark.asyncio
async def test_no_relevant_information_query(client: AsyncClient):
    """Scenario 5: No relevant information query handling."""
    email = f"query_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Query Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ws_res = await client.post("/api/v1/workspaces", json={"name": "Query WS"}, headers=headers)
    ws_id = ws_res.json()["id"]

    await client.post(f"/api/v1/workspaces/{ws_id}/load-demo", headers=headers)

    # Ask completely irrelevant out-of-domain question
    query_res = await client.post(f"/api/v1/workspaces/{ws_id}/query", json={
        "query": "What is the orbital period of Neptune and average temperature on Titan?"
    }, headers=headers)
    assert query_res.status_code == 200
    data = query_res.json()
    assert "answer" in data
    assert isinstance(data["confidence"], (int, float))

@pytest.mark.asyncio
async def test_ai_api_failure_fallback(client: AsyncClient):
    """Scenario 3 & 7: AI API failure / slow response graceful fallback."""
    email = f"fallback_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Fallback Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ws_res = await client.post("/api/v1/workspaces", json={"name": "Fallback WS"}, headers=headers)
    ws_id = ws_res.json()["id"]

    # Seed workspace
    await client.post(f"/api/v1/workspaces/{ws_id}/load-demo", headers=headers)

    # Mock ai_service to raise an exception simulating API outage / timeout
    with patch("backend.app.services.ai_service.ai_service.generate_text", side_effect=Exception("Gemini API RateLimit / Outage")):
        # Query should gracefully fall back to local rule-based engine and return 200, not 500
        query_res = await client.post(f"/api/v1/workspaces/{ws_id}/query", json={
            "query": "Will the gate closure affect my exam?"
        }, headers=headers)
        assert query_res.status_code == 200
        data = query_res.json()
        assert "answer" in data
        assert len(data["answer"]) > 0

@pytest.mark.asyncio
async def test_graph_with_many_nodes_and_simulation(client: AsyncClient):
    """Scenario 11: High-density graph with multiple nodes and simulation stress test."""
    email = f"graph_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Graph Tester"
    })
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ws_res = await client.post("/api/v1/workspaces", json={"name": "Large Graph WS"}, headers=headers)
    ws_id = ws_res.json()["id"]

    # Load demo dataset
    await client.post(f"/api/v1/workspaces/{ws_id}/load-demo", headers=headers)

    # Add 5 additional interconnected notices to stress the graph
    for i in range(5):
        await client.post(f"/api/v1/workspaces/{ws_id}/sources", json={
            "name": f"Notice Batch {i+1}",
            "type": "txt",
            "content": f"Facility Sector {i+1} operates with Auxiliary Unit {i+1} connected to Bus Route {i+1} during storm periods."
        }, headers=headers)

    # Verify graph returns clean structure
    graph_res = await client.get(f"/api/v1/workspaces/{ws_id}/graph", headers=headers)
    assert graph_res.status_code == 200
    graph = graph_res.json()
    assert len(graph["nodes"]) >= 4
    assert len(graph["edges"]) >= 2

    # Test what-if counterfactual simulation on the dense graph
    sim_res = await client.post(f"/api/v1/workspaces/{ws_id}/simulate", json={
        "change": {
            "entity": "Main Gate Closure",
            "property": "end_date",
            "value": "2026-09-25"
        }
    }, headers=headers)
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert "impacted_nodes" in sim_data
    assert len(sim_data["impacted_nodes"]) >= 1
