"""Complaint routes.

CRUD over the `complaint` table joined to resident + residential_unit so the
response carries resident_name, flat_no, owner_id. Supports ?resident_id and
?owner_id filters; PUT updates status, staff assignment, owner approval.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("complaints", __name__)

SELECT_JOIN = """
    SELECT c.complaint_id, c.resident_id, c.manager_id, c.complaint_type AS category,
           c.description, c.description AS name, c.complaint_status, c.status,
           c.created_at AS date, c.owner_approval, c.resolved_by AS staff_id,
           r.name AS resident_name, r.flat_no,
           ru.unit_id AS flat_id, ru.owner_id
    FROM complaint c
    LEFT JOIN resident r ON r.resident_id = c.resident_id
    LEFT JOIN residential_unit ru ON ru.unit_no = r.flat_no
"""


@bp.get("")
def list_complaints():
    resident_id = request.args.get("resident_id", type=int)
    owner_id = request.args.get("owner_id", type=int)
    where = []
    params = []
    if resident_id is not None:
        where.append("c.resident_id = %s")
        params.append(resident_id)
    if owner_id is not None:
        where.append("ru.owner_id = %s")
        params.append(owner_id)
    sql = SELECT_JOIN
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY c.complaint_id DESC"
    with get_cursor() as cur:
        cur.execute(sql, params)
        rows = cur.fetchall()
        for r in rows:
            if r.get("date") is not None:
                r["date"] = r["date"].isoformat()
        return jsonify(rows)


@bp.post("")
def create_complaint():
    data = request.get_json(silent=True) or {}
    resident_id = data.get("resident_id")
    category = (data.get("category") or data.get("complaint_type") or "").strip()
    description = (data.get("description") or data.get("name") or "").strip()
    if not resident_id or not category:
        return jsonify(error="resident_id_and_category_required"), 400
    with get_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO complaint (resident_id, manager_id, complaint_type, description, complaint_status, status, created_at) "
            "VALUES (%s, 101, %s, %s, 'Open', 'Pending', CURDATE())",
            (resident_id, category, description),
        )
        new_id = cur.lastrowid
        cur.execute(SELECT_JOIN + " WHERE c.complaint_id = %s", (new_id,))
        row = cur.fetchone()
        if row and row.get("date") is not None:
            row["date"] = row["date"].isoformat()
        return jsonify(row), 201


@bp.put("/<int:complaint_id>")
def update_complaint(complaint_id):
    data = request.get_json(silent=True) or {}
    fields = []
    params = []
    if "status" in data:
        fields.append("status = %s")
        params.append(data["status"])
        mapped = {"Pending": "Open", "In Progress": "Under Review", "Resolved": "Resolved"}
        fields.append("complaint_status = %s")
        params.append(mapped.get(data["status"], "Open"))
    if "staff_id" in data:
        fields.append("resolved_by = %s")
        params.append(data["staff_id"] or None)
    if "owner_approval" in data:
        fields.append("owner_approval = %s")
        params.append(1 if data["owner_approval"] else 0)
    if not fields:
        return jsonify(error="no_fields"), 400
    params.append(complaint_id)
    with get_cursor(commit=True) as cur:
        cur.execute(f"UPDATE complaint SET {', '.join(fields)} WHERE complaint_id = %s", params)
        cur.execute(SELECT_JOIN + " WHERE c.complaint_id = %s", (complaint_id,))
        row = cur.fetchone()
        if not row:
            return jsonify(error="not_found"), 404
        if row.get("date") is not None:
            row["date"] = row["date"].isoformat()
        return jsonify(row)


@bp.delete("/<int:complaint_id>")
def delete_complaint(complaint_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM complaint WHERE complaint_id = %s", (complaint_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
