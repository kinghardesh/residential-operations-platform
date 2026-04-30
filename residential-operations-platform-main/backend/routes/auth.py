"""Authentication routes.

POST /api/auth/login — verifies the supplied email (and password for admin)
against the admin / resident / owner tables and returns the user's profile
(userId, displayName, email, phone) so the frontend can hydrate AuthContext
without a separate profile-setup step.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("auth", __name__)


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    role = (data.get("role") or "").strip().lower()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if role not in ("admin", "resident", "owner"):
        return jsonify(error="invalid_role"), 400
    if not email:
        return jsonify(error="email_required"), 400

    with get_cursor() as cur:
        if role == "admin":
            cur.execute(
                "SELECT admin_id, admin_name, admin_email, contact_number, password_hash "
                "FROM admin WHERE admin_email = %s",
                (email,),
            )
            row = cur.fetchone()
            if not row or row["password_hash"] != password:
                return jsonify(error="invalid_credentials"), 401
            return jsonify(
                role="admin",
                userId=row["admin_id"],
                displayName=row["admin_name"],
                email=row["admin_email"],
                phone=row["contact_number"],
            )

        if role == "resident":
            cur.execute(
                "SELECT resident_id, name, email, contact_number FROM resident WHERE email = %s",
                (email,),
            )
            row = cur.fetchone()
            if not row:
                return jsonify(error="invalid_credentials"), 401
            return jsonify(
                role="resident",
                userId=row["resident_id"],
                displayName=row["name"],
                email=row["email"],
                phone=row["contact_number"],
            )

        # owner
        cur.execute(
            "SELECT owner_id, name, email, phone FROM owner WHERE email = %s",
            (email,),
        )
        row = cur.fetchone()
        if not row:
            return jsonify(error="invalid_credentials"), 401
        return jsonify(
            role="owner",
            userId=row["owner_id"],
            displayName=row["name"],
            email=row["email"],
            phone=row["phone"],
        )
