"""Owner CRUD routes.

GET/POST /api/owners and GET/PUT/DELETE /api/owners/<id> backed by the
`owner` table. Used by AdminOwners and OwnerDashboard.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("owners", __name__)


@bp.get("")
def list_owners():
    with get_cursor() as cur:
        cur.execute("SELECT owner_id, name, phone, email FROM owner ORDER BY owner_id")
        return jsonify(cur.fetchall())


@bp.get("/<int:owner_id>")
def get_owner(owner_id):
    with get_cursor() as cur:
        cur.execute(
            "SELECT owner_id, name, phone, email FROM owner WHERE owner_id = %s",
            (owner_id,),
        )
        row = cur.fetchone()
        if not row:
            return jsonify(error="not_found"), 404
        return jsonify(row)


@bp.post("")
def create_owner():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    email = (data.get("email") or "").strip() or None
    if not name:
        return jsonify(error="name_required"), 400

    with get_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO owner (name, phone, email) VALUES (%s, %s, %s)",
            (name, phone, email),
        )
        new_id = cur.lastrowid
        cur.execute(
            "SELECT owner_id, name, phone, email FROM owner WHERE owner_id = %s",
            (new_id,),
        )
        return jsonify(cur.fetchone()), 201


@bp.put("/<int:owner_id>")
def update_owner(owner_id):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    email = (data.get("email") or "").strip() or None
    if not name:
        return jsonify(error="name_required"), 400

    with get_cursor(commit=True) as cur:
        cur.execute(
            "UPDATE owner SET name = %s, phone = %s, email = %s WHERE owner_id = %s",
            (name, phone, email, owner_id),
        )
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        cur.execute(
            "SELECT owner_id, name, phone, email FROM owner WHERE owner_id = %s",
            (owner_id,),
        )
        return jsonify(cur.fetchone())


@bp.delete("/<int:owner_id>")
def delete_owner(owner_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM owner WHERE owner_id = %s", (owner_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
