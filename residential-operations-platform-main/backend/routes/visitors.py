"""Visitor (access_log) routes.

GET/POST /api/visitors and DELETE /api/visitors/<id> over the `access_log`
table. Normalises MySQL TIME deltas into HH:MM strings for the UI and
supports ?flat_id, ?owner_id, ?resident_id filters.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("visitors", __name__)

SELECT_JOIN = """
    SELECT al.log_id AS visitor_id, al.visitor_name AS name, al.visit_date,
           al.visit_time, al.exit_time, al.unit_id AS flat_id,
           al.resident_id, ru.unit_no AS flat_no, ru.owner_id
    FROM access_log al
    LEFT JOIN residential_unit ru ON ru.unit_id = al.unit_id
"""


def _clean(rows):
    for r in rows:
        if r.get("visit_date") is not None:
            r["visit_date"] = r["visit_date"].isoformat()
        for k in ("visit_time", "exit_time"):
            v = r.get(k)
            if v is None:
                continue
            if hasattr(v, "total_seconds"):
                total = int(v.total_seconds())
                r[k] = f"{total // 3600:02d}:{(total % 3600) // 60:02d}"
            else:
                r[k] = str(v)[:5]
    return rows


@bp.get("")
def list_visitors():
    flat_id = request.args.get("flat_id", type=int)
    owner_id = request.args.get("owner_id", type=int)
    resident_id = request.args.get("resident_id", type=int)
    where = []
    params = []
    if flat_id is not None:
        where.append("al.unit_id = %s")
        params.append(flat_id)
    if owner_id is not None:
        where.append("ru.owner_id = %s")
        params.append(owner_id)
    if resident_id is not None:
        where.append("al.resident_id = %s")
        params.append(resident_id)
    sql = SELECT_JOIN
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY al.visit_date DESC, al.log_id DESC"
    with get_cursor() as cur:
        cur.execute(sql, params)
        return jsonify(_clean(cur.fetchall()))


@bp.post("")
def create_visitor():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or data.get("visitor_name") or "").strip()
    visit_date = data.get("visit_date")
    visit_time = data.get("visit_time") or None
    exit_time = data.get("exit_time") or None
    flat_id = data.get("flat_id") or None
    resident_id = data.get("resident_id") or None
    if not name:
        return jsonify(error="name_required"), 400
    with get_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO access_log (resident_id, visitor_name, visit_date, visit_time, exit_time, unit_id) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (resident_id, name, visit_date, visit_time, exit_time, flat_id),
        )
        new_id = cur.lastrowid
        cur.execute(SELECT_JOIN + " WHERE al.log_id = %s", (new_id,))
        row = cur.fetchone()
        return jsonify(_clean([row])[0] if row else None), 201


@bp.delete("/<int:visitor_id>")
def delete_visitor(visitor_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM access_log WHERE log_id = %s", (visitor_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
