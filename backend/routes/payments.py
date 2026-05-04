"""Payment routes.

GET/POST /api/payments and DELETE /api/payments/<id> over the `payment` table
joined to resident + residential_unit. Supports ?resident_id and ?owner_id
so admin / owner / resident views all hit the same endpoint with a filter.
"""

from flask import Blueprint, request, jsonify
from db import get_cursor

bp = Blueprint("payments", __name__)

SELECT_JOIN = """
    SELECT p.payment_id, p.resident_id, p.amount, p.payment_date AS date,
           p.payment_mode AS mode, r.name AS resident_name, r.flat_no,
           ru.unit_id AS flat_id, ru.owner_id
    FROM payment p
    LEFT JOIN resident r ON r.resident_id = p.resident_id
    LEFT JOIN residential_unit ru ON ru.unit_no = r.flat_no
"""


@bp.get("")
def list_payments():
    resident_id = request.args.get("resident_id", type=int)
    owner_id = request.args.get("owner_id", type=int)
    where = []
    params = []
    if resident_id is not None:
        where.append("p.resident_id = %s")
        params.append(resident_id)
    if owner_id is not None:
        where.append("ru.owner_id = %s")
        params.append(owner_id)
    sql = SELECT_JOIN
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY p.payment_date DESC, p.payment_id DESC"
    with get_cursor() as cur:
        cur.execute(sql, params)
        rows = cur.fetchall()
        for r in rows:
            if r.get("date") is not None:
                r["date"] = r["date"].isoformat()
            if r.get("amount") is not None:
                r["amount"] = float(r["amount"])
        return jsonify(rows)


@bp.post("")
def create_payment():
    data = request.get_json(silent=True) or {}
    resident_id = data.get("resident_id")
    amount = data.get("amount")
    mode = (data.get("mode") or data.get("payment_mode") or "Cash").strip()
    date = data.get("date") or data.get("payment_date")
    if not resident_id or amount is None:
        return jsonify(error="resident_id_and_amount_required"), 400
    with get_cursor(commit=True) as cur:
        if date:
            cur.execute(
                "INSERT INTO payment (resident_id, amount, payment_date, payment_mode) VALUES (%s, %s, %s, %s)",
                (resident_id, amount, date, mode),
            )
        else:
            cur.execute(
                "INSERT INTO payment (resident_id, amount, payment_date, payment_mode) VALUES (%s, %s, CURDATE(), %s)",
                (resident_id, amount, mode),
            )
        new_id = cur.lastrowid
        cur.execute(SELECT_JOIN + " WHERE p.payment_id = %s", (new_id,))
        row = cur.fetchone()
        if row and row.get("date") is not None:
            row["date"] = row["date"].isoformat()
        if row and row.get("amount") is not None:
            row["amount"] = float(row["amount"])
        return jsonify(row), 201


@bp.delete("/<int:payment_id>")
def delete_payment(payment_id):
    with get_cursor(commit=True) as cur:
        cur.execute("DELETE FROM payment WHERE payment_id = %s", (payment_id,))
        if cur.rowcount == 0:
            return jsonify(error="not_found"), 404
        return jsonify(ok=True)
