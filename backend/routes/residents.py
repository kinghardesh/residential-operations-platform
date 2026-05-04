"""Resident CRUD routes.

GET/POST /api/residents and GET/PUT/DELETE /api/residents/<id> backed by the
`resident` table. Aliases `contact_number` to `phone` in responses to match
the frontend shape.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("residents", __name__)

SELECT_COLS = (
    "resident_id, name, contact_number AS phone, email, "
    "date_of_birth, gender, street, city, flat_no, pincode"
)


@bp.get("")
def list_residents():
    with get_cursor() as cur:
        cur.execute(f"SELECT {SELECT_COLS} FROM resident ORDER BY resident_id")
        return jsonify(cur.fetchall())


@bp.get("/<int:resident_id>")
def get_resident(resident_id):
    with get_cursor() as cur:
        cur.execute(
            f"SELECT {SELECT_COLS} FROM resident WHERE resident_id = %s",
            (resident_id,),
        )
        row = cur.fetchone()
        if not row:
            return jsonify(error="not_found"), 404
        return jsonify(row)


def _next_resident_id(cur):
    cur.execute("SELECT COALESCE(MAX(resident_id), 200) + 1 AS next_id FROM resident")
    return cur.fetchone()["next_id"]


@bp.post("")
def create_resident():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip() or None
    email = (data.get("email") or "").strip() or None
    flat_no = (data.get("flat_no") or "").strip() or None
    if not name:
        return jsonify(error="name_required"), 400

    with get_cursor(commit=True) as cur:
        resident_id = _next_resident_id(cur)
        cur.execute(
            "INSERT INTO resident (resident_id, name, contact_number, email, flat_no) "
            "VALUES (%s, %s, %s, %s, %s)",
            (resident_id, name, phone, email, flat_no),
        )
        cur.execute(
            f"SELECT {SELECT_COLS} FROM resident WHERE resident_id = %s",
            (resident_id,),
        )
        return jsonify(cur.fetchone()), 201


@bp.put("/<int:resident_id>")
def update_resident(resident_id):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip() or None
    email = (data.get("email") or "").strip() or None
    flat_no = (data.get("flat_no") or "").strip() or None
    if not name:
        return jsonify(error="name_required"), 400

    with get_cursor(commit=True) as cur:
        cur.execute(
            "UPDATE resident SET name = %s, contact_number = %s, email = %s, flat_no = %s "
            "WHERE resident_id = %s",
            (name, phone, email, flat_no, resident_id),
        )
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        cur.execute(
            f"SELECT {SELECT_COLS} FROM resident WHERE resident_id = %s",
            (resident_id,),
        )
        return jsonify(cur.fetchone())


@bp.delete("/<int:resident_id>")
def delete_resident(resident_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM resident WHERE resident_id = %s", (resident_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
