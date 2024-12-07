from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database connection
connection = mysql.connector.connect(
    host='localhost',
    port=3306,
    database='lp',
    user='root',
    password='',
    autocommit=True
)

def get_random_airport_by_country(iso_country):
    """Fetch a random airport for the given ISO country code."""
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT name FROM airport WHERE iso_country = %s ORDER BY RAND() LIMIT 1;"
        cursor.execute(query, (iso_country,))
        result = cursor.fetchone()
        if result:
            return result['name']
        else:
            return None  # No airport found for the given country
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return None
    finally:
        cursor.close()

@app.route("/")
def home():
    """Render the home page."""
    return render_template("home.html")

@app.route("/submit_question", methods=["POST"])
def submit_question():
    """Handle requests to fetch a random airport for a country."""
    data = request.json
    iso_country = data.get("country")  # Country ISO code (e.g., "US", "FR")

    if not iso_country:
        return jsonify({"error": "Country code is required"}), 400

    random_airport = get_random_airport_by_country(iso_country)
    if random_airport:
        return jsonify({
            "random_airport": random_airport,
            "country_name": iso_country
        })
    else:
        return jsonify({"error": "No airports found for the given country"}), 404

if __name__ == "__main__":
    app.run(debug=True)
