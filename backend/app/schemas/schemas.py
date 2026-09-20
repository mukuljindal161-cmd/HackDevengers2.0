from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Workspace Schemas ---
class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class WorkspaceResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# --- Source Schemas ---
class SourceCreate(BaseModel):
    name: str
    type: str = "text_input" # pdf, txt, md, image, text_input, url
    content: Optional[str] = None
    uri: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class SourceResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    type: str
    uri: Optional[str] = None
    status: str
    metadata: Dict[str, Any] = Field(default_factory=dict, alias="metadata_")
    created_at: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True

class SourceStatusResponse(BaseModel):
    source_id: str
    status: str
    chunks_count: int = 0
    entities_count: int = 0

# --- Graph Schemas ---
class EntityResponse(BaseModel):
    id: str
    workspace_id: str
    type: str
    name: str
    description: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict, alias="metadata_")
    confidence: float
    created_at: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True

class RelationshipResponse(BaseModel):
    id: str
    workspace_id: str
    source_entity_id: str
    target_entity_id: str
    relationship_type: str
    confidence: float
    evidence: List[Any] = []
    temporal_metadata: Dict[str, Any] = {}
    created_at: datetime
    
    class Config:
        from_attributes = True

class GraphResponse(BaseModel):
    nodes: List[EntityResponse]
    edges: List[RelationshipResponse]

class NeighborResponse(BaseModel):
    entity: EntityResponse
    in_edges: List[RelationshipResponse]
    out_edges: List[RelationshipResponse]
    neighbors: List[EntityResponse]

# --- Discovery Schemas ---
class DiscoveryResponse(BaseModel):
    id: str
    workspace_id: str
    title: str
    description: str
    severity: str
    impact_score: float
    confidence: float
    type: str # confirmed, inferred, speculative
    status: str
    evidence: List[Any] = []
    reasoning: List[Any] = []
    affected_entities: List[str] = []
    recommended_actions: List[str] = []
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Timeline Schemas ---
class EventResponse(BaseModel):
    id: str
    workspace_id: str
    entity_id: Optional[str] = None
    title: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    event_type: str
    metadata: Dict[str, Any] = Field(default_factory=dict, alias="metadata_")
    confidence: float
    created_at: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True

# --- Query Schemas ---
class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

class QueryResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[Any] = []
    nodes: List[Any] = []
    reasoning: List[Any] = []
    discoveries: List[Any] = []

# --- Simulation Schemas ---
class SimulationChange(BaseModel):
    entity: str
    property: str
    value: Any

class SimulationRequest(BaseModel):
    change: SimulationChange

class SimulationResponse(BaseModel):
    simulation_id: str
    original_state: Dict[str, Any]
    modified_state: Dict[str, Any]
    impacted_nodes: List[EntityResponse]
    new_conflicts: List[str]
    resolved_conflicts: List[str]
    summary: str

# --- Execution Schemas ---
class ExecutionStep(BaseModel):
    agent_name: str
    status: str
    duration_ms: Optional[float] = None
    output_summary: Optional[str] = None

class ExecutionResponse(BaseModel):
    id: str
    workspace_id: str
    workflow_id: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    steps: List[ExecutionStep] = []

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    workspace_id: Optional[str] = None
    type: str = "info"
    title: str
    message: str
    read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

