import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    workspaces = relationship("Workspace", back_populates="owner", cascade="all, delete-orphan")
    memberships = relationship("WorkspaceMember", back_populates="user", cascade="all, delete-orphan")

class Workspace(Base):
    __tablename__ = "workspaces"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    owner = relationship("User", back_populates="workspaces")
    members = relationship("WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan")
    sources = relationship("Source", back_populates="workspace", cascade="all, delete-orphan")
    entities = relationship("Entity", back_populates="workspace", cascade="all, delete-orphan")
    relationships = relationship("Relationship", back_populates="workspace", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="workspace", cascade="all, delete-orphan")
    discoveries = relationship("Discovery", back_populates="workspace", cascade="all, delete-orphan")
    executions = relationship("Execution", back_populates="workspace", cascade="all, delete-orphan")

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default="member") # owner, member, viewer
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    workspace = relationship("Workspace", back_populates="members")
    user = relationship("User", back_populates="memberships")

class Source(Base):
    __tablename__ = "sources"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # pdf, txt, md, image, text_input, url
    uri = Column(String(512), nullable=True)
    storage_path = Column(String(512), nullable=True)
    status = Column(String(50), default="pending") # pending, processing, completed, failed
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    workspace = relationship("Workspace", back_populates="sources")
    documents = relationship("Document", back_populates="source", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_id = Column(String(36), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    source = relationship("Source", back_populates="documents")
    chunks = relationship("Chunk", back_populates="document", cascade="all, delete-orphan")

class Chunk(Base):
    __tablename__ = "chunks"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    embedding = Column(JSON, nullable=True) # Stored as JSON list of floats for portability
    metadata_ = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    document = relationship("Document", back_populates="chunks")

class Entity(Base):
    __tablename__ = "entities"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False) # Person, Organization, Location, Event, Document, Deadline, Policy, Resource, Transport, Risk, Task, Topic
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    metadata_ = Column("metadata", JSON, default=dict)
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    workspace = relationship("Workspace", back_populates="entities")
    events = relationship("Event", back_populates="entity", cascade="all, delete-orphan")

class Relationship(Base):
    __tablename__ = "relationships"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    source_entity_id = Column(String(36), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False, index=True)
    target_entity_id = Column(String(36), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False, index=True)
    relationship_type = Column(String(100), nullable=False) # affects, causes, depends_on, occurs_before, occurs_after, located_at, applies_to, conflicts_with, requires, related_to, scheduled_for, impacts, blocks, enables
    confidence = Column(Float, default=1.0)
    evidence = Column(JSON, default=list) # list of chunk_id or text passages
    temporal_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    workspace = relationship("Workspace", back_populates="relationships")
    source_entity = relationship("Entity", foreign_keys=[source_entity_id])
    target_entity = relationship("Entity", foreign_keys=[target_entity_id])

class Event(Base):
    __tablename__ = "events"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_id = Column(String(36), ForeignKey("entities.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    event_type = Column(String(50), default="general")
    metadata_ = Column("metadata", JSON, default=dict)
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    workspace = relationship("Workspace", back_populates="events")
    entity = relationship("Entity", back_populates="events")

class Discovery(Base):
    __tablename__ = "discoveries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), default="medium") # low, medium, high, critical
    impact_score = Column(Float, default=50.0) # 0 to 100
    confidence = Column(Float, default=0.9)
    type = Column(String(50), default="inferred") # confirmed, inferred, speculative
    status = Column(String(50), default="active") # active, dismissed, resolved
    evidence = Column(JSON, default=list) # references to chunks / source passages
    reasoning = Column(JSON, default=list) # step-by-step reasoning chain
    affected_entities = Column(JSON, default=list) # list of entity names / IDs
    recommended_actions = Column(JSON, default=list) # list of strings
    created_at = Column(DateTime(timezone=True), default=utc_now)
    
    workspace = relationship("Workspace", back_populates="discoveries")

class Execution(Base):
    __tablename__ = "executions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    workflow_id = Column(String(100), nullable=False)
    status = Column(String(50), default="queued") # queued, running, completed, failed, cancelled
    started_at = Column(DateTime(timezone=True), default=utc_now)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    metadata_ = Column("metadata", JSON, default=dict)
    error = Column(Text, nullable=True)
    
    workspace = relationship("Workspace", back_populates="executions")
    agent_runs = relationship("AgentRun", back_populates="execution", cascade="all, delete-orphan")

class AgentRun(Base):
    __tablename__ = "agent_runs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    execution_id = Column(String(36), ForeignKey("executions.id", ondelete="CASCADE"), nullable=False, index=True)
    agent_name = Column(String(100), nullable=False)
    status = Column(String(50), default="running")
    input_data = Column("input", JSON, default=dict)
    output_data = Column("output", JSON, default=dict)
    started_at = Column(DateTime(timezone=True), default=utc_now)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)
    
    execution = relationship("Execution", back_populates="agent_runs")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=True)
    type = Column(String(50), default="info")
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
