"""MySQL connection helper.

Lazily creates a mysql-connector connection pool on first use and exposes
`get_cursor()` as a context manager that yields a dict cursor and handles
commit / rollback / cleanup automatically.
"""

import os
from contextlib import contextmanager
from mysql.connector import pooling

_pool = None


def _get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="rorop_pool",
            pool_size=5,
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "rorop"),
            autocommit=False,
        )
    return _pool


@contextmanager
def get_cursor(dictionary=True, commit=False):
    conn = _get_pool().get_connection()
    cur = conn.cursor(dictionary=dictionary)
    try:
        yield cur
        if commit:
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cur.close()
        conn.close()
