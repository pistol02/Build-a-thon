import csv
import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def upload_csv(request):
    """
    API endpoint to upload a CSV file, process it, and send data to another API.
    """
    if 'file' not in request.FILES:
        return JsonResponse({"error": "No file provided."}, status=400)

    csv_file = request.FILES['file']

    # Ensure it's a CSV file
    if not csv_file.name.endswith('.csv'):
        return JsonResponse({"error": "Invalid file format. Please upload a CSV file."}, status=400)

    try:
        # Read CSV and send data to another API
        csv_data = csv.DictReader(csv_file.read().decode('utf-8').splitlines())
        api_url = 'http://127.0.0.1:8000/api/add_product/'  # Replace with your target API endpoint
        responses = []

        for row in csv_data:
            formatted_data = {
                "product_id": row.get("product_id"),
                "product_name": row.get("product_name"),
                "opening_stock": int(row.get("opening_stock", 0)),
                "purchase_stock": int(row.get("purchase_stock", 0)),
                "units_sold": int(row.get("units_sold", 0)),
                "hand_in_stock": int(row.get("hand_in_stock", 0)),
                "cost_price_per_unit": f"{float(row.get('cost_price_per_unit', 0)):.2f}",
                "cost_price_total": f"{float(row.get('cost_price_total', 0)):.2f}",
            }

            # Send POST request to the external API
            response = requests.post(api_url, json=formatted_data)
            responses.append({
                "status_code": response.status_code,
                "response": response.json() if response.status_code == 200 else response.text
            })

        return JsonResponse({"message": "CSV processed successfully", "responses": responses}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
