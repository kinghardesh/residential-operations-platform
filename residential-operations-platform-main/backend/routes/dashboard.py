"""Dashboard aggregation routes.

GET /api/dashboard/admin              — society-wide counts and monthly
                                        complaint / payment / resource trends
GET /api/dashboard/owner/<owner_id>   — owned vs occupied vs vacant flats
GET /api/dashboard/resident/<id>      — resident profile, flat, active
                                        complaints, pending dues
"""

from flask import Blueprint, jsonify
from db import get_cursor

bp = Blueprint("dashboard", __name__)


MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def _month_label(month_str):
    try:
        idx = int(month_str[5:7]) - 1
        return MONTH_SHORT[idx]
    except Exception:
        return month_str


@bp.get("/admin")
def admin_dash():
    with get_cursor() as cur:
        counts = {}
        for label, table in [
            ("residents", "resident"),
            ("owners", "owner"),
            ("flats", "residential_unit"),
            ("complaints", "complaint"),
            ("payments", "payment"),
            ("visitors", "access_log"),
            ("staff", "staff"),
        ]:
            cur.execute(f"SELECT COUNT(*) AS c FROM {table}")
            counts[label] = cur.fetchone()["c"]

        cur.execute(
            "SELECT DATE_FORMAT(created_at, '%Y-%m') AS m, COUNT(*) AS c "
            "FROM complaint WHERE created_at IS NOT NULL "
            "GROUP BY m ORDER BY m"
        )
        complaint_trend = [
            {"month": _month_label(r["m"]), "count": r["c"]} for r in cur.fetchall()
        ]

        cur.execute(
            "SELECT DATE_FORMAT(payment_date, '%Y-%m') AS m, SUM(amount) AS a "
            "FROM payment WHERE payment_date IS NOT NULL "
            "GROUP BY m ORDER BY m"
        )
        payment_trend = [
            {"month": _month_label(r["m"]), "amount": float(r["a"] or 0)} for r in cur.fetchall()
        ]

        cur.execute(
            "SELECT month AS m, SUM(water_units) AS water, SUM(electricity_units) AS electricity "
            "FROM resource_usage GROUP BY m ORDER BY m"
        )
        resource_trend = [
            {"month": _month_label(r["m"]), "water": int(r["water"] or 0), "electricity": int(r["electricity"] or 0)}
            for r in cur.fetchall()
        ]

    return jsonify(
        counts=counts,
        complaint_trend=complaint_trend,
        payment_trend=payment_trend,
        resource_trend=resource_trend,
    )


@bp.get("/owner/<int:owner_id>")
def owner_dash(owner_id):
    with get_cursor() as cur:
        cur.execute("SELECT COUNT(*) AS c FROM residential_unit WHERE owner_id = %s", (owner_id,))
        owned = cur.fetchone()["c"]
        cur.execute(
            "SELECT COUNT(*) AS c FROM residential_unit WHERE owner_id = %s AND occupancy_status = 'Occupied'",
            (owner_id,),
        )
        occupied = cur.fetchone()["c"]
        cur.execute("SELECT owner_id, name, phone, email FROM owner WHERE owner_id = %s", (owner_id,))
        owner = cur.fetchone() or {}

    return jsonify(
        owned_flats=owned,
        occupied=occupied,
        vacant=owned - occupied,
        owner=owner,
    )


@bp.get("/resident/<int:resident_id>")
def resident_dash(resident_id):
    with get_cursor() as cur:
        cur.execute(
            "SELECT resident_id, name, email, contact_number AS phone, flat_no FROM resident WHERE resident_id = %s",
            (resident_id,),
        )
        resident = cur.fetchone()
        if not resident:
            return jsonify(error="not_found"), 404
        cur.execute(
            "SELECT COUNT(*) AS c FROM complaint WHERE resident_id = %s AND status <> 'Resolved'",
            (resident_id,),
        )
        active_complaints = cur.fetchone()["c"]
        cur.execute(
            "SELECT COALESCE(SUM(amount), 0) AS paid FROM payment WHERE resident_id = %s",
            (resident_id,),
        )
        paid = float(cur.fetchone()["paid"] or 0)
        annual_due = 8500 * 12
        pending_dues = max(0, annual_due - paid)

        cur.execute(
            "SELECT unit_id AS flat_id, unit_no AS flat_no FROM residential_unit WHERE unit_no = %s",
            (resident["flat_no"],),
        )
        flat = cur.fetchone()

    return jsonify(
        resident=resident,
        flat=flat,
        active_complaints=active_complaints,
        pending_dues=pending_dues,
    )
