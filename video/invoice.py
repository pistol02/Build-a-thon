import google.generativeai as genai
import PIL.Image
import json
import os
from datetime import datetime

def process_invoice_items(image_path, api_key):
    """
    Process an invoice image focusing on item details using Gemini Vision API.
    
    Args:
        image_path (str): Path to the invoice image
        api_key (str): Google API key for Gemini
    
    Returns:
        dict: Extracted item data
    """
    # Configure the API
    genai.configure(api_key=api_key)
    
    try:
        # Set up the model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Load the image
        image = PIL.Image.open(image_path)
        
        # Enhanced prompt to extract more invoice details
        prompt = """
        Analyze this invoice image and extract the following information in detail:
        1. Invoice header information:
           - invoice_number
           - invoice_date
           - due_date
           - from_address (complete address of the seller)
           - to_address (complete address of the buyer)
           - payment_terms
        
        2. List of all items with these exact details for each item:
           - item_name: The name or description of the item
           - quantity: The quantity ordered
           - unit_price: Price per unit
           - total_amount: Total price for this item
        
        3. Invoice summary:
           - subtotal
           - tax_amount
           - shipping_amount (if applicable)
           - invoice_total
        
        Format the response as a JSON structure exactly like this example:
        {
            "invoice_details": {
                "invoice_number": "INV-2024-001",
                "invoice_date": "2024-03-20",
                "due_date": "2024-04-19",
                "from_address": "Complete seller address",
                "to_address": "Complete buyer address",
                "payment_terms": "Net 30"
            },
            "items": [
                {
                    "item_name": "Example Item 1",
                    "quantity": "2",
                    "unit_price": "10.00",
                    "total_amount": "20.00"
                }
            ],
            "summary": {
                "subtotal": "20.00",
                "tax_amount": "2.00",
                "shipping_amount": "5.00",
                "invoice_total": "27.00"
            }
        }
        
        Only include the JSON data, no additional text or explanations.
        """
        
        try:
            response = model.generate_content([prompt, image])
            
            if not response or not response.text:
                raise ValueError("Empty response from Gemini API")
            
            # Extract JSON from the response
            response_text = response.text.strip()
            
            # Find JSON content in the response
            start_idx = response_text.find('{')
            end_idx = response_text.rindex('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No valid JSON found in response")
                
            json_str = response_text[start_idx:end_idx]
            
            # Parse JSON
            invoice_data = json.loads(json_str)
            
            # Add processing metadata
            invoice_data['metadata'] = {
                'processed_timestamp': datetime.now().isoformat(),
                'source_file': os.path.basename(image_path),
                'item_count': len(invoice_data.get('items', []))
            }
            
            # Calculate and add analysis metrics
            items = invoice_data.get('items', [])
            analysis = {
                'total_items': len(items),
                'total_quantity': sum(float(item['quantity']) for item in items),
                'item_breakdown': [f"{item['quantity']} x {item['item_name']}" for item in items],
                'average_item_price': sum(float(item['unit_price']) for item in items) / len(items) if items else 0
            }
            invoice_data['analysis'] = analysis
            
            # Create output directory if it doesn't exist
            output_dir = 'output'
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            
            # Generate output filename using invoice number if available
            invoice_number = invoice_data.get('invoice_details', {}).get('invoice_number', '')
            if invoice_number:
                # Clean invoice number for filename
                clean_invoice_number = ''.join(c for c in invoice_number if c.isalnum() or c in '-_')
                output_file = f'{clean_invoice_number}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            else:
                output_file = f'invoice_items_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            
            # Save to file in output directory
            output_path = os.path.join(output_dir, output_file)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(invoice_data, f, indent=2, ensure_ascii=False)
            
            print(f"Results saved to: {output_path}")
            return invoice_data
            
        except genai.types.generation_types.BlockedPromptException as e:
            print(f"Prompt was blocked: {str(e)}")
            return None
        except genai.types.generation_types.GenerationError as e:
            print(f"Generation error: {str(e)}")
            return None
            
    except PIL.UnidentifiedImageError:
        print(f"Error: Could not open or identify the image file: {image_path}")
        return None
    except Exception as e:
        print(f"Error processing invoice: {str(e)}")
        return None

def display_items_summary(invoice_data):
    """
    Display a clean summary of extracted items and invoice details.
    """
    if not invoice_data:
        print("No invoice data found")
        return
    
    # Display invoice details
    print("\n=== Invoice Details ===")
    if 'invoice_details' in invoice_data:
        details = invoice_data['invoice_details']
        print(f"Invoice Number: {details.get('invoice_number', 'N/A')}")
        print(f"Invoice Date: {details.get('invoice_date', 'N/A')}")
        print(f"Due Date: {details.get('due_date', 'N/A')}")
        print(f"\nFrom:\n{details.get('from_address', 'N/A')}")
        print(f"\nTo:\n{details.get('to_address', 'N/A')}")
        print(f"\nPayment Terms: {details.get('payment_terms', 'N/A')}")
    
    # Display items
    if 'items' in invoice_data:
        print("\n=== Invoice Items ===")
        print(f"Total Items Found: {len(invoice_data['items'])}")
        print("\nDetailed Items List:")
        print("-" * 70)
        print(f"{'Item Name':<30} {'Quantity':<10} {'Unit Price':<12} {'Total':<12}")
        print("-" * 70)
        
        for item in invoice_data['items']:
            print(f"{item['item_name'][:30]:<30} {item['quantity']:<10} {item['unit_price']:<12} {item['total_amount']:<12}")
    
    # Display summary
    if 'summary' in invoice_data:
        print("\n=== Invoice Summary ===")
        summary = invoice_data['summary']
        print(f"Subtotal: {summary.get('subtotal', 'N/A')}")
        print(f"Tax Amount: {summary.get('tax_amount', 'N/A')}")
        print(f"Shipping Amount: {summary.get('shipping_amount', 'N/A')}")
        print(f"Invoice Total: {summary.get('invoice_total', 'N/A')}")
    
    print("\n")

def main():
    # Replace with your API key
    api_key = "api-key"
    
    # Process image from test folder
    image_path = os.path.join('test', 'test.jpg')
    
    # Ensure the test directory exists
    if not os.path.exists('test'):
        os.makedirs('test')
        print("Test directory created. Please place test.jpg in the test folder.")
        return
    
    # Check if test file exists
    if not os.path.exists(image_path):
        print("test.jpg not found in test folder. Please add the test image.")
        return
    
    try:
        # Process the invoice
        result = process_invoice_items(image_path, api_key)
        
        if result:
            # Display formatted summary
            display_items_summary(result)
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()