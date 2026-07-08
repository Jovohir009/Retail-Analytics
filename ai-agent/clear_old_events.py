import sqlite3

conn = sqlite3.connect("data/agent.sqlite3")
cur = conn.cursor()

cur.execute("DELETE FROM visitor_events WHERE store_id = ?", ("local-store",))

conn.commit()
print(f"Deleted {cur.rowcount} rows")

conn.close()
