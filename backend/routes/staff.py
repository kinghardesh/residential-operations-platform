"""Staff CRUD routes.

GET/POST /api/staff and PUT/DELETE /api/staff/<id> backed by the `staff`
table. Optional unit_id (aliased to flat_id) scopes a staff member to a flat.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("staff", __name__)

COLS = "staff_id, name, role, phone, unit_id AS flat_id"


@bp.get("")
def list_staff():
    with get_cursor() as cur:
        cur.execute(f"SELECT {COLS} FROM staff ORDER BY staff_id")
        return jsonify(cur.fetchall())


@bp.post("")
def create_staff():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip() or "New staff"
    role = (data.get("role") or "").strip()
    phone = (data.get("phone") or "").strip() or None
    flat_id = data.get("flat_id") or None
    if not role:
        return jsonify(error="role_required"), 400
    with get_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO staff (name, role, phone, unit_id) VALUES (%s, %s, %s, %s)",
            (name, role, phone, flat_id),
        )
        new_id = cur.lastrowid
        cur.execute(f"SELECT {COLS} FROM staff WHERE staff_id = %s", (new_id,))
        return jsonify(cur.fetchone()), 201


@bp.put("/<int:staff_id>")
def update_staff(staff_id):
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip() or "Staff"
    role = (data.get("role") or "").strip()
    phone = (data.get("phone") or "").strip() or None
    flat_id = data.get("flat_id") or None
    with get_cursor(commit=True) as cur:
        cur.execute(
            "UPDATE staff SET name = %s, role = %s, phone = %s, unit_id = %s WHERE staff_id = %s",
            (name, role, phone, flat_id, staff_id),
        )
        cur.execute(f"SELECT {COLS} FROM staff WHERE staff_id = %s", (staff_id,))
        row = cur.fetchone()
        if not row:
            return jsonify(error="not_found"), 404
        return jsonify(row)


@bp.delete("/<int:staff_id>")
def delete_staff(staff_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM staff WHERE staff_id = %s", (staff_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
