/**
 * ATHLYNX Database Service
 * Handles connections to Neon PostgreSQL
 * 
 * @author ATHLYNX AI Corporation
 * @date January 19, 2026
 */

import os
import asyncpg
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger("athlynx-db")

class DatabaseService:
    def __init__(self):
        self.pool = None
        self.dsn = os.getenv("DATABASE_URL")
        
        # Default to Neon DB if not set
        if not self.dsn:
            self.dsn = "postgres://neondb_owner:npg_6jKzM5eXJt@ep-shiny-glade-a5r4q2.us-east-2.aws.neon.tech/neondb?sslmode=require"
            logger.warning("DATABASE_URL not set, using default Neon connection string")

    async def connect(self):
        """Establish connection pool to Neon DB"""
        try:
            if not self.pool:
                self.pool = await asyncpg.create_pool(
                    dsn=self.dsn,
                    min_size=5,
                    max_size=20,
                    command_timeout=60
                )
                logger.info("Successfully connected to Neon PostgreSQL")
                return True
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            return False

    async def disconnect(self):
        """Close connection pool"""
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("Database connection closed")

    async def check_connection(self) -> bool:
        """Verify database connectivity"""
        try:
            if not self.pool:
                await self.connect()
            
            async with self.pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            return True
        except Exception:
            return False

    # --- User Operations ---

    async def user_exists(self, email: str) -> bool:
        """Check if user email exists"""
        query = "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)"
        async with self.pool.acquire() as conn:
            return await conn.fetchval(query, email)

    async def create_user(self, user_data: Any) -> int:
        """Create new user and return ID"""
        query = """
            INSERT INTO users (email, password_hash, full_name, role, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id
        """
        # Note: In production, hash password before calling this
        async with self.pool.acquire() as conn:
            return await conn.fetchval(
                query, 
                user_data.email, 
                user_data.password, 
                user_data.full_name, 
                user_data.role
            )

    async def mark_user_verified(self, email: str):
        """Update user verification status"""
        query = "UPDATE users SET is_verified = TRUE WHERE email = $1"
        async with self.pool.acquire() as conn:
            await conn.execute(query, email)

    # --- Waitlist Operations ---

    async def add_to_waitlist(self, entry: Any) -> int:
        """Add to waitlist and return position"""
        async with self.pool.acquire() as conn:
            # Insert entry
            await conn.execute(
                "INSERT INTO waitlist (email, role, sport, created_at) VALUES ($1, $2, $3, NOW())",
                entry.email, entry.role, entry.sport
            )
            # Get position
            return await conn.fetchval("SELECT COUNT(*) FROM waitlist")
