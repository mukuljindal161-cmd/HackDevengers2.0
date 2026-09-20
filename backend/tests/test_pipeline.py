import pytest
import uuid

@pytest.mark.asyncio
async def test_full_pipeline_and_discoveries(client):
    email = f"pipeline_{uuid.uuid4().hex[:8]}@example.com"
    reg_resp = await client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Pipeline Tester"
    })
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get user default workspace
    ws_resp = await client.get("/api/v1/workspaces", headers=headers)
    ws_id = ws_resp.json()[0]["id"]

    # 1. Load Demo Dataset
    demo_resp = await client.post(f"/api/v1/workspaces/{ws_id}/load-demo", headers=headers)
    assert demo_resp.status_code == 200
    assert demo_resp.json()["documents_processed"] == 5

    # 2. Check Graph
    graph_resp = await client.get(f"/api/v1/workspaces/{ws_id}/graph", headers=headers)
    assert graph_resp.status_code == 200
    graph_data = graph_resp.json()
    assert len(graph_data["nodes"]) >= 4
    assert len(graph_data["edges"]) >= 2

    # 3. Check Discoveries
    disc_resp = await client.get(f"/api/v1/workspaces/{ws_id}/discoveries", headers=headers)
    assert disc_resp.status_code == 200
    discoveries = disc_resp.json()
    assert len(discoveries) >= 1
    top_disc = discoveries[0]
    assert top_disc["impact_score"] >= 60
    assert top_disc["severity"] in ["high", "medium"]

    # Verify specialized discoveries (contradiction and personalized_impact)
    disc_types = [d.get("type") for d in discoveries]
    assert "contradiction" in disc_types
    assert "personalized_impact" in disc_types

    # 4. Check Explainability ("Why?")
    explain_resp = await client.get(f"/api/v1/discoveries/{top_disc['id']}/explain", headers=headers)
    assert explain_resp.status_code == 200
    exp_data = explain_resp.json()
    assert "reasoning_chain" in exp_data
    assert len(exp_data["reasoning_chain"]) >= 2
    assert "evidence_citations" in exp_data

    # Check explanation for personalized impact discovery
    pers_disc = next(d for d in discoveries if d.get("type") == "personalized_impact")
    pers_exp = await client.get(f"/api/v1/discoveries/{pers_disc['id']}/explain", headers=headers)
    assert pers_exp.status_code == 200
    assert pers_exp.json()["evidence_citations"] is not None

    # 5. Hybrid Query
    query_resp = await client.post(f"/api/v1/workspaces/{ws_id}/query", json={
        "query": "What could affect my exam on September 20?"
    }, headers=headers)
    assert query_resp.status_code == 200
    q_data = query_resp.json()
    assert "answer" in q_data
    assert len(q_data["sources"]) > 0

    # 6. What-If Simulation
    sim_resp = await client.post(f"/api/v1/workspaces/{ws_id}/simulate", json={
        "change": {
            "entity": "Main Gate Closure",
            "property": "end_date",
            "value": "2026-09-23"
        }
    }, headers=headers)
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert "impacted_nodes" in sim_data
    assert len(sim_data["impacted_nodes"]) >= 1
    assert "new_conflicts" in sim_data
    sim_id = sim_data["simulation_id"]

    # 7. Verify GET /simulations/{simulation_id}
    get_sim_resp = await client.get(f"/api/v1/simulations/{sim_id}")
    assert get_sim_resp.status_code == 200
    assert get_sim_resp.json()["simulation_id"] == sim_id

    # 8. Test Counterfactual Conflict Resolution (Reschedule Exam past closure)
    resolve_resp = await client.post(f"/api/v1/workspaces/{ws_id}/simulate", json={
        "change": {
            "entity": "Mid-Semester Examination",
            "property": "start_date",
            "value": "2026-09-24"
        }
    }, headers=headers)
    assert resolve_resp.status_code == 200
    res_data = resolve_resp.json()
    assert len(res_data["resolved_conflicts"]) >= 1

