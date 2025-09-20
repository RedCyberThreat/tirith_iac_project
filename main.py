from flask import Flask, request, send_from_directory
from QuickScan import threat_check
from DeepSearch import generate_deepsearch_result, lint_cloudformation_template
from utilities import save_file, delete_folder
import os


# fix CORS
from flask_cors import CORS


#IMPORTANT -> BEFORE RUNNING THE CODE YOU HAVE TO BUILD THE VITE PROJECT (npm run build)
app = Flask(__name__, static_folder='./dist')

CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST"], "allow_headers": ["Content-Type", "Authorization"]}})

#endpoint to retrieve the informations relative to the quickscan output
@app.route("/api/quickscan", methods=["POST"])
def quick_scan():

    user_data = request.get_json()

    return_json = threat_check(user_data)

    return return_json

#endpoint to retreve the informations relative to the deepsearch output
@app.route("/api/deepsearch", methods=['POST'])
def deep_search():

    raw_user_data = request.get_data(as_text=True)
    
    save_file(raw_user_data)

    scan_results = lint_cloudformation_template("./user_data/line_mapping.json")

    return_json = generate_deepsearch_result(scan_results)

    delete_folder()

    return return_json

#frontend route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    #add a check to ignore API routes
    if path.startswith('api/'):
        return

    #if the file exixt return it else return index
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run(debug=True, port=8080)
