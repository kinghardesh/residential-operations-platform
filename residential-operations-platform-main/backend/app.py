"""Flask application factory.

Loads environment variables, enables CORS for /api/*, mounts every blueprint
under the /api prefix, and exposes a /api/health probe. Run directly with
`python app.py` to start the development server on FLASK_PORT (default 5000).
"""

import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS

from routes.auth import bp as auth_bp
from routes.owners import bp as owners_bp
from routes.residents import bp as residents_bp
from routes.flats import bp as flats_bp
from routes.staff import bp as staff_bp
from routes.complaints import bp as complaints_bp
from routes.payments import bp as payments_bp
from routes.visitors import bp as visitors_bp
from routes.resources import bp as resources_bp
from routes.dashboard import bp as dashboard_bp


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(owners_bp, url_prefix="/api/owners")
    app.register_blueprint(residents_bp, url_prefix="/api/residents")
    app.register_blueprint(flats_bp, url_prefix="/api/flats")
    app.register_blueprint(staff_bp, url_prefix="/api/staff")
    app.register_blueprint(complaints_bp, url_prefix="/api/complaints")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    app.register_blueprint(visitors_bp, url_prefix="/api/visitors")
    app.register_blueprint(resources_bp, url_prefix="/api/resource-usage")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.get("/api/health")
    def health():
        return jsonify(status="ok")

    @app.errorhandler(404)
    def not_found(_):
        return jsonify(error="not_found"), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify(error="server_error", detail=str(e)), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("FLASK_PORT", "5000")),
        debug=bool(int(os.getenv("FLASK_DEBUG", "1"))),
    )
