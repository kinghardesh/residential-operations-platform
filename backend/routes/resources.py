"""Resource usage routes.

GET/POST /api/resource-usage over the `resource_usage` table (water +
electricity readings per flat per month). Supports ?unit_id, ?flat_no,
?owner_id filters. Used by AdminResources and resident Resources pages.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("resources", __name__)


@bp.get("")
def list_usage():
    unit_id = request.args.get("unit_id", type=int)
    flat_no = request.args.get("flat_no", type=str)
    owner_id = request.args.get("owner_id", type=int)
    where = []
    params = []
    if unit_id is not None:
        where.append("ru.unit_id = %s")
        params.append(unit_id)
    if flat_no is not None:
        where.append("ru.unit_no = %s")
        params.append(flat_no)
    if owner_id is not None:
        where.append("ru.owner_id = %s")
        params.append(owner_id)
    sql = (
        "SELECT rs.usage_id, rs.unit_id AS flat_id, ru.unit_no AS flat_no, "
        "rs.electricity_units, rs.water_units, rs.month "
        "FROM resource_usage rs "
        "LEFT JOIN residential_unit ru ON ru.unit_id = rs.unit_id"
    )
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY rs.month, rs.unit_id"
    with get_cursor() as cur:
        cur.execute(sql, params)
        return jsonify(cur.fetchall())


@bp.post("")
def create_usage():
    data = request.get_json(silent=True) or {}
    unit_id = data.get("flat_id") or data.get("unit_id")
    electricity = data.get("electricity_units") or 0
    water = data.get("water_units") or 0
    month = (data.get("month") or "").strip()
    if not unit_id or not month:
        return jsonify(error="unit_id_and_month_required"), 400
    with get_cursor(commit=True) as cur:
        cur.execute(
            "INSERT INTO resource_usage (unit_id, electricity_units, water_units, month) VALUES (%s, %s, %s, %s)",
            (unit_id, electricity, water, month),
        )
        return jsonify(usage_id=cur.lastrowid), 201
