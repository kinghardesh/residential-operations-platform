"""Flat (residential_unit) CRUD routes.

Treats `residential_unit` as "flats" for the UI. Supports filtering by
?owner_id=<id>, used by OwnerFlats and OwnerDashboard. Aliases unit_id/unit_no
to flat_id/flat_no in responses.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("flats", __name__)

COLS = (
    "unit_id AS flat_id, unit_no AS flat_no, unit_type, unit_capacity, "
    "rent, occupancy_status, block_id, owner_id, floor_no"
)


@bp.get("")
def list_flats():
    owner_id = request.args.get("owner_id", type=int)
    with get_cursor() as cur:
        if owner_id is not None:
            cur.execute(f"SELECT {COLS} FROM residential_unit WHERE owner_id = %s ORDER BY unit_id", (owner_id,))
        else:
            cur.execute(f"SELECT {COLS} FROM residential_unit ORDER BY unit_id")
        return jsonify(cur.fetchall())


@bp.get("/<int:flat_id>")
def get_flat(flat_id):
    with get_cursor() as cur:
        cur.execute(f"SELECT {COLS} FROM residential_unit WHERE unit_id = %s", (flat_id,))
        row = cur.fetchone()
        if not row:
            return jsonify(error="not_found"), 404
        return jsonify(row)


@bp.post("")
def create_flat():
    data = request.get_json(silent=True) or {}
    flat_no = (data.get("flat_no") or "").strip()
    floor_no = data.get("floor_no")
    owner_id = data.get("owner_id") or None
    unit_type = data.get("unit_type") or "2-Sharing"
    unit_capacity = data.get("unit_capacity") or 2
    rent = data.get("rent") or 0
    block_id = data.get("block_id") or 10
    if not flat_no:
        return jsonify(error="flat_no_required"), 400
    with get_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO residential_unit (unit_no, unit_type, unit_capacity, rent, occupancy_status, block_id, owner_id, floor_no) "
            "VALUES (%s, %s, %s, %s, 'Available', %s, %s, %s)",
            (flat_no, unit_type, unit_capacity, rent, block_id, owner_id, floor_no),
        )
        new_id = cur.lastrowid
        cur.execute(f"SELECT {COLS} FROM residential_unit WHERE unit_id = %s", (new_id,))
        return jsonify(cur.fetchone()), 201


@bp.put("/<int:flat_id>")
def update_flat(flat_id):
    data = request.get_json(silent=True) or {}
    flat_no = (data.get("flat_no") or "").strip()
    floor_no = data.get("floor_no")
    owner_id = data.get("owner_id") or None
    with get_cursor(commit=True) as cur:
        cur.execute(
            "UPDATE residential_unit SET unit_no = %s, floor_no = %s, owner_id = %s WHERE unit_id = %s",
            (flat_no, floor_no, owner_id, flat_id),
        )
        if cur.rowcount == 0:
            cur.execute("SELECT unit_id FROM residential_unit WHERE unit_id = %s", (flat_id,))
            if not cur.fetchone():
                return jsonify(error="not_found"), 404
        cur.execute(f"SELECT {COLS} FROM residential_unit WHERE unit_id = %s", (flat_id,))
        return jsonify(cur.fetchone())


@bp.delete("/<int:flat_id>")
def delete_flat(flat_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM residential_unit WHERE unit_id = %s", (flat_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
