from flask import Flask, request
from QuickScan import threat_check
from DeepSearch import generate_deepsearch_result, lint_cloudformation_template
from utilities import save_file, delete_folder

# fix CORS
from flask_cors import CORS


app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

#endpoint to retrieve the informations relative to the quickscan output
@app.route("/api/quickscan", methods=["POST"])
def quick_scan():

    user_data = request.get_json()

    return_json = threat_check(user_data)

    return return_json

#endpoint to retreve the informations relative to the deepsearch output
@app.route("/api/deepsearch", methods=['POST'])
def deep_search():

    user_data = request.get_json()

    save_file(user_data)

    scan_results = lint_cloudformation_template("./user_data/user_json.json")

    return_json = generate_deepsearch_result(scan_results)

    delete_folder()

    return return_json


if __name__ == "__main__":
    app.run(debug=True)
